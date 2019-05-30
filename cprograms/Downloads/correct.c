#include "version.h"
#include"fat.h"
#include <fcntl.h>
#include <linux/hdreg.h>
#include <sys/mount.h>
#include <linux/fd.h>
#include <endian.h>
#include <mntent.h>
#include <signal.h>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/ioctl.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <sys/types.h>
#include <unistd.h>
#include <time.h>
#include <errno.h>
#include <ctype.h>
#include <stdint.h>
#include <asm/types.h>

#define llseek lseek
#define TRUE 1			/* Boolean constants */
#define FALSE 0
#define TEST_BUFFER_BLOCKS 16
#define HARD_SECTOR_SIZE   512
#define SECTORS_PER_BLOCK ( BLOCK_SIZE / HARD_SECTOR_SIZE )
#define NO_NAME "NO NAME    "
#define die( str ) fatal_error( "%s: " str "\n" )
#define mark_sector_bad( sector ) mark_FAT_sector( sector, FAT_BAD ) 
static inline int cdiv(int a, int b)  /* Compute ceil(a/b) */
{
	return (a + b - 1) / b;
}

static char *program_name = "mkfs.fat";	/* Name of the program */
static char *device_name = NULL;	/* Name of the device on which to create the filesystem */
static int atari_format = 0;	/* Use Atari variation of MS-DOS FS format */
static int check = FALSE;	/* Default to no readablity checking */
static int verbose = 0;		/* Default to verbose mode off */
static long volume_id;		/* Volume ID number */
static time_t create_time;	/* Creation time */
static struct timeval create_timeval;	/* Creation time */
static char volume_name[] = NO_NAME;	/* Volume name */
static uint64_t blocks;	/* Number of blocks in filesystem */
static int sector_size = 512;	/* Size of a logical sector */
static int sector_size_set = 0;	/* User selected sector size */
static int backup_boot = 0;	/* Sector# of backup boot sector */
static int reserved_sectors = 0;	/* Number of reserved sectors */
static int badblocks = 0;	/* Number of bad blocks in the filesystem */
static int nr_fats = 2;		/* Default number of FATs to produce */
static int size_fat = 0;	/* Size in bits of FAT entries */
static int size_fat_by_user = 0;	/* 1 if FAT size user selected */
static int dev = -1;		/* FS block device file handle */
static int ignore_full_disk = 0;	/* Ignore warning about 'full' disk devices */
static off_t currently_testing = 0;	/* Block currently being tested (if autodetect bad blocks) */
static struct msdos_boot_sector bs;	/* Boot sector data */
static int start_data_sector;	/* Sector number for the start of the data area */
static int start_data_block;	/* Block number for the start of the data area */
static unsigned char *fat;	/* File allocation table */
static unsigned alloced_fat_length;	/* # of FAT sectors we can keep in memory */
static unsigned char *info_sector;	/* FAT32 info sector */
static struct msdos_dir_entry *root_dir;	/* Root directory */
static int size_root_dir;	/* Size of the root directory in bytes */
static int sectors_per_cluster = 0;	/* Number of sectors per disk cluster */
static int root_dir_entries = 0;	/* Number of root directory entries */
static char *blank_sector;	/* Blank sector - all zeros */
static int hidden_sectors = 0;	/* Number of hidden sectors */
static int hidden_sectors_by_user = 0;	/* -h option invoked */
static int drive_number_option = 0;	/* drive number */
static int drive_number_by_user = 0;	/* drive number option invoked */
static int fat_media_byte = 0;	/* media byte in header and starting FAT */
static int malloc_entire_fat = FALSE;	/* Whether we should malloc() the entire FAT or not */
static int align_structures = TRUE;	/* Whether to enforce alignment */
static int orphaned_sectors = 0;	/* Sectors that exist in the last block of filesystem */

static void fatal_error(const char *fmt_string) __attribute__ ((noreturn));
static void mark_FAT_cluster(int cluster, unsigned int value);
static void mark_FAT_sector(int sector, unsigned int value);
static long do_check(char *buffer, int try, off_t current_block);
static void alarm_intr(int alnum);
static void check_blocks(void);
static void get_list_blocks(char *filename);
static int valid_offset(int fd, loff_t offset);
static uint64_t count_blocks(char *filename, int *remainder);
static void check_mount(char *device_name);
static void establish_params(int device_num, int size);
static void setup_tables(void);
static void write_tables(void);
static void fatal_error(const char *fmt_string)
{
	fprintf(stderr, fmt_string, program_name, device_name);
	exit(1);			/* The error exit code is 1! */
}
static void mark_FAT_cluster(int cluster, unsigned int value)
{
	
if(size_fat==32)
{			value &= 0xfffffff;
			fat[4 * cluster] = (unsigned char)(value & 0x000000ff);
			fat[(4 * cluster) + 1] = (unsigned char)((value & 0x0000ff00) >> 8);
			fat[(4 * cluster) + 2] = (unsigned char)((value & 0x00ff0000) >> 16);
			fat[(4 * cluster) + 3] = (unsigned char)((value & 0xff000000) >> 24);
	}
}
static void mark_FAT_sector(int sector, unsigned int value)
{
	int cluster;
	cluster = (sector - start_data_sector) / (int)(bs.cluster_size) /
		(sector_size / HARD_SECTOR_SIZE);
	if (cluster < 0)
		die("Invalid cluster number in mark_FAT_sector: probably bug!");
	mark_FAT_cluster(cluster, value);
}

static void alarm_intr(int alnum)
{
	(void)alnum;
	if (currently_testing >= blocks)
		return;
	signal(SIGALRM, alarm_intr);
	alarm(5);
	if (!currently_testing)
		return;
	printf("%lld... ", (unsigned long long)currently_testing);
	fflush(stdout);
}

static int valid_offset(int fd, loff_t offset)
{
	char ch;
	if (llseek(fd, offset, SEEK_SET) < 0)
		return FALSE;
	if (read(fd, &ch, 1) < 1)
		return FALSE;
	return TRUE;
}
static uint64_t count_blocks(char *filename, int *remainder)
{
	loff_t high, low;
	int fd;
	if ((fd = open(filename, O_RDONLY)) < 0) {
		perror(filename);
		exit(1);
	}
	if ((low = llseek(fd, 0, SEEK_END)) <= 0) {
		low = 0;
		for (high = 1; valid_offset(fd, high); high *= 2)
			low = high;
		while (low < high - 1) {
			const loff_t mid = (low + high) / 2;
			if (valid_offset(fd, mid))
				low = mid;
			else
				high = mid;
		}
		++low;
	}

	close(fd);
	*remainder = (low % BLOCK_SIZE) / sector_size;
	return (low / BLOCK_SIZE);
}
static void check_mount(char *device_name)
{
	FILE *f;
	struct mntent *mnt;

	if ((f = setmntent(MOUNTED, "r")) == NULL)
		return;
	while ((mnt = getmntent(f)) != NULL)
		if (strcmp(device_name, mnt->mnt_fsname) == 0)
			die("%s contains a mounted filesystem.");
	endmntent(f);
}
static void establish_params(int device_num, int size)
{
	long loop_size;
	struct hd_geometry geometry;
	struct floppy_struct param;
	int def_root_dir_entries = 512;
	if((device_name)!=0)		/* Must be a hard disk then! */
	{
		
		if (ioctl(dev, HDIO_GETGEO, &geometry) || geometry.sectors == 0
				|| geometry.heads == 0) {
			printf("unable to get drive geometry, using default 255/63\n");
			bs.secs_track = htole16(63);
			bs.heads = htole16(255);
		} else {
			bs.secs_track = htole16(geometry.sectors);	/* Set up the geometry information */
			bs.heads = htole16(geometry.heads);
			if (!hidden_sectors_by_user)
				hidden_sectors = htole32(geometry.start);
		}
def_hd_params:
		bs.media = (char)0xf8;	/* Set up the media descriptor for a hard drive */
		if (!size_fat && blocks * SECTORS_PER_BLOCK > 1064960) {
			if (verbose)
				printf("Auto-selecting FAT32 for large filesystem\n");
			size_fat = 32;
		}
		if (size_fat == 32) {		
			uint32_t sz_mb =
				(blocks + (1 << (20 - BLOCK_SIZE_BITS)) - 1) >> (20 -
						BLOCK_SIZE_BITS);
			bs.cluster_size =
				sz_mb >= 32 * 1024 ? 64 : sz_mb >= 16 * 1024 ? 32 : sz_mb >=
				8 * 1024 ? 16 : sz_mb > 260 ? 8 : 1;
		} else {
			
			bs.cluster_size = (char)4;
		}
	}
	if (!root_dir_entries)
		root_dir_entries = def_root_dir_entries;
}
static unsigned int align_object(unsigned int sectors, unsigned int clustsize)
{
	if (align_structures)
		return (sectors + clustsize - 1) & ~(clustsize - 1);
	else
		return sectors;
}
static void setup_tables(void)
{
	unsigned num_sectors;
	unsigned cluster_count = 0, fat_length;
	struct tm *ctime;
	struct msdos_volume_info *vi =
		(size_fat == 32 ? &bs.fat32.vi : &bs.oldfat.vi);
	 if(!(atari_format))
		memcpy((char *)bs.system_id, "mkfs.fat", strlen("mkfs.fat"));
	if (bs.media == 0xf8)
		vi->drive_number=0x80;
	else
		vi->drive_number=0x00;
	if (size_fat == 32) {
		root_dir_entries = 0;
	}
	if (atari_format) {
		bs.system_id[5] = (unsigned char)(volume_id & 0x000000ff);
		bs.system_id[6] = (unsigned char)((volume_id & 0x0000ff00) >> 8);
		bs.system_id[7] = (unsigned char)((volume_id & 0x00ff0000) >> 16);
	} else {
		vi->volume_id[0] = (unsigned char)(volume_id & 0x000000ff);
		vi->volume_id[1] = (unsigned char)((volume_id & 0x0000ff00) >> 8);
		vi->volume_id[2] = (unsigned char)((volume_id & 0x00ff0000) >> 16);
		vi->volume_id[3] = (unsigned char)(volume_id >> 24);
	}
	if (!atari_format) {
		memcpy(vi->volume_label, volume_name, 11);
		memcpy(bs.boot_jump, dummy_boot_jump, 3);
		bs.boot_jump[1] = ((size_fat == 32 ?
					(char *)&bs.fat32.boot_code :
					(char *)&bs.oldfat.boot_code) - (char *)&bs) - 2;
		if (size_fat == 32) {
			int offset = (char *)&bs.fat32.boot_code -
				(char *)&bs + MESSAGE_OFFSET + 0x7c00;
			if (dummy_boot_code[BOOTCODE_FAT32_SIZE - 1])
				printf("Warning: message too long; truncated\n");
			dummy_boot_code[BOOTCODE_FAT32_SIZE - 1] = 0;
			memcpy(bs.fat32.boot_code, dummy_boot_code, BOOTCODE_FAT32_SIZE);
			bs.fat32.boot_code[MSG_OFFSET_OFFSET] = offset & 0xff;
			bs.fat32.boot_code[MSG_OFFSET_OFFSET + 1] = offset >> 8;
		} 
		bs.boot_sign = htole16(BOOT_SIGN);
	} 
	if (!reserved_sectors)
		reserved_sectors = (size_fat == 32) ? 32 : 1;
	else {
		if (size_fat == 32 && reserved_sectors < 2)
			die("On FAT32 at least 2 reserved sectors are needed.");
	}
	bs.reserved = htole16(reserved_sectors);
	bs.fats = (char)nr_fats;
	if (!atari_format || size_fat == 32)
		bs.hidden = htole32(hidden_sectors);
	else {
		__u16 hidden = htole16(hidden_sectors);
		if (hidden_sectors & ~0xffff)
			die("#hidden doesn't fit in 16bit field of Atari format\n");
		memcpy(&bs.hidden, &hidden, 2);
	}
	num_sectors =
		(long long)(blocks * BLOCK_SIZE / sector_size) + orphaned_sectors;
	if (!atari_format) {
		unsigned fatdata1216;	/* Sectors for FATs + data area (FAT12/16) */
		unsigned fatdata32;	/* Sectors for FATs + data area (FAT32) */
		unsigned fatlength12, fatlength16, fatlength32;
		unsigned maxclust12, maxclust16, maxclust32;
		unsigned clust12, clust16, clust32;
		int maxclustsize;
		unsigned root_dir_sectors = cdiv(root_dir_entries * 32, sector_size);
		printf("num_sectors=%ul\n",num_sectors);
		if (num_sectors <= 8192) {
			if (align_structures && verbose >= 2)
				printf("Disabling alignment due to tiny filesystem\n");

			align_structures = FALSE;
		}
		if (sectors_per_cluster)
			bs.cluster_size = maxclustsize = sectors_per_cluster;
		else
			maxclustsize = 128;
		do {
			fatdata32 = num_sectors - reserved_sectors;
			fatdata1216 = fatdata32
				- align_object(root_dir_sectors, bs.cluster_size);
			if (verbose >= 2)
				printf("Trying with %d sectors/cluster:\n", bs.cluster_size);
			clust12 = 2 * ((long long)fatdata1216 * sector_size + nr_fats * 3) /
				(2 * (int)bs.cluster_size * sector_size + nr_fats * 3);
			fatlength12 = cdiv(((clust12 + 2) * 3 + 1) >> 1, sector_size);
			fatlength12 = align_object(fatlength12, bs.cluster_size);
			clust12 = (fatdata1216 - nr_fats * fatlength12) / bs.cluster_size;
			maxclust12 = (fatlength12 * 2 * sector_size) / 3;
			if (maxclust12 > MAX_CLUST_12)
				maxclust12 = MAX_CLUST_12;
			if (verbose >= 2)
				printf("FAT12: #clu=%u, fatlen=%u, maxclu=%u, limit=%u\n",
						clust12, fatlength12, maxclust12, MAX_CLUST_12);
			if (clust12 > maxclust12 - 2) {
				clust12 = 0;
				if (verbose >= 2)
					printf("FAT12: too much clusters\n");
			}
			clust16 = ((long long)fatdata1216 * sector_size + nr_fats * 4) /
				((int)bs.cluster_size * sector_size + nr_fats * 2);
			fatlength16 = cdiv((clust16 + 2) * 2, sector_size);
			fatlength16 = align_object(fatlength16, bs.cluster_size);
			clust16 = (fatdata1216 - nr_fats * fatlength16) / bs.cluster_size;
			maxclust16 = (fatlength16 * sector_size) / 2;
			if (maxclust16 > MAX_CLUST_16)
				maxclust16 = MAX_CLUST_16;
			if (verbose >= 2)
				printf("FAT16: #clu=%u, fatlen=%u, maxclu=%u, limit=%u\n",
						clust16, fatlength16, maxclust16, MAX_CLUST_16);
			if (clust16 > maxclust16 - 2) {
				if (verbose >= 2)
					printf("FAT16: too much clusters\n");
				clust16 = 0;
			}
			if (clust16 < FAT12_THRESHOLD
					&& !(size_fat_by_user && size_fat == 16)) 
				clust16 = 0;
			clust32 = ((long long)fatdata32 * sector_size + nr_fats * 8) /
				((int)bs.cluster_size * sector_size + nr_fats * 4);
			fatlength32 = cdiv((clust32 + 2) * 4, sector_size);
			clust32 = (fatdata32 - nr_fats * fatlength32) / bs.cluster_size;
			maxclust32 = (fatlength32 * sector_size) / 4;
			if (maxclust32 > MAX_CLUST_32)
				maxclust32 = MAX_CLUST_32;
			if (clust32 && clust32 < MIN_CLUST_32
					&& !(size_fat_by_user && size_fat == 32)) {
				clust32 = 0;
			}
			if (clust32 > maxclust32) {
				clust32 = 0;
				if (verbose >= 2)
					printf("FAT32: too much clusters\n");
			}
			if ((clust12 && (size_fat == 0 || size_fat == 12)) ||
					(clust16 && (size_fat == 0 || size_fat == 16)) ||
					(clust32 && size_fat == 32))
				break;
			bs.cluster_size <<= 1;
		} while (bs.cluster_size && bs.cluster_size <= maxclustsize);
		if (!size_fat) {
			size_fat = (clust16 > clust12) ? 16 : 12;
			
		}
		if(size_fat==32) {
				if (clust32 < MIN_CLUST_32)
					fprintf(stderr,
							"WARNING: Not enough clusters for a 32 bit FAT!\n");
				cluster_count = clust32;
				fat_length = fatlength32;
				bs.fat_length = htole16(0);
				bs.fat32.fat32_length = htole32(fatlength32);
				memcpy(vi->fs_type, MSDOS_FAT32_SIGN, 8);
				root_dir_entries = 0;}
		if (align_structures) {
			root_dir_entries = align_object(root_dir_sectors, bs.cluster_size)
				* (sector_size >> 5);
		}
	} 
	bs.sector_size[0] = (char)(sector_size & 0x00ff);
	bs.sector_size[1] = (char)((sector_size & 0xff00) >> 8);
	bs.dir_entries[0] = (char)(root_dir_entries & 0x00ff);
	bs.dir_entries[1] = (char)((root_dir_entries & 0xff00) >> 8);
	if (size_fat == 32) {
		bs.fat32.flags = htole16(0);
		bs.fat32.version[0] = 0;
		bs.fat32.version[1] = 0;
		bs.fat32.root_cluster = htole32(2);
		bs.fat32.info_sector = htole16(1);
		if (!backup_boot)
			backup_boot = (reserved_sectors >= 7) ? 6 :
				(reserved_sectors >= 2) ? reserved_sectors - 1 : 0;
		else {
			if (backup_boot == 1)
				die("Backup boot sector must be after sector 1");
			else if (backup_boot >= reserved_sectors)
				die("Backup boot sector must be a reserved sector");
		}
		bs.fat32.backup_boot = htole16(backup_boot);
		memset(&bs.fat32.reserved2, 0, sizeof(bs.fat32.reserved2));
	}
	if (num_sectors >= 65536) {
		bs.sectors[0] = (char)0;
		bs.sectors[1] = (char)0;
		bs.total_sect = htole32(num_sectors);
	} 
	if (!atari_format)
		vi->ext_boot_sign = MSDOS_EXT_SIGN;
	start_data_sector = (reserved_sectors + nr_fats * fat_length) *
		(sector_size / HARD_SECTOR_SIZE);
	start_data_block = (start_data_sector + SECTORS_PER_BLOCK - 1) /
		SECTORS_PER_BLOCK;
	if (blocks < start_data_block + 32)	/* Arbitrary undersize filesystem! */
		die("Too few blocks for viable filesystem");
	if (malloc_entire_fat)
		alloced_fat_length = fat_length;
	else
		alloced_fat_length = 1;

	if ((fat =(unsigned char *)malloc(alloced_fat_length * sector_size)) == NULL)
		die("unable to allocate space for FAT image in memory");
	memset(fat, 0, alloced_fat_length * sector_size);
	mark_FAT_cluster(0, 0xffffffff);	/* Initial fat entries */
	mark_FAT_cluster(1, 0xffffffff);
	fat[0] = (unsigned char)bs.media;	/* Put media type in first byte! */
	if (size_fat == 32) {
		mark_FAT_cluster(2, FAT_EOF);/* Mark cluster 2 as EOF (used for root dir) */
	}
	size_root_dir = (size_fat == 32) ?
		bs.cluster_size * sector_size :
		(((int)bs.dir_entries[1] * 256 + (int)bs.dir_entries[0]) *
		 sizeof(struct msdos_dir_entry));
	if ((root_dir = (struct msdos_dir_entry *)malloc(size_root_dir)) == NULL) {
		free(fat);		/* Tidy up before we die! */
		die("unable to allocate space for root directory in memory");
	}
	memset(root_dir, 0, size_root_dir);
	if (size_fat == 32) {
		struct fat32_fsinfo *info;
		if (!(info_sector = malloc(sector_size)))
			die("Out of memory");
		memset(info_sector, 0, sector_size);
		info = (struct fat32_fsinfo *)(info_sector + 0x1e0);
		info_sector[0] = 'R';
		info_sector[1] = 'R';
		info_sector[2] = 'a';
		info_sector[3] = 'A';
		info->signature = htole32(0x61417272);
		info->free_clusters = htole32(cluster_count - 1);
		info->next_cluster = htole32(2);
		*(__u16 *) (info_sector + 0x1fe) = htole16(BOOT_SIGN);
	}
	if (!(blank_sector = malloc(sector_size)))
		die("Out of memory");
	memset(blank_sector, 0, sector_size);
}
#define error(str)				\
	do {						\
		free (fat);					\
		if (info_sector) free (info_sector);	\
		free (root_dir);				\
		die (str);					\
	} while(0)

#define seekto(pos,errstr)						\
	do {									\
		loff_t __pos = (pos);						\
		if (llseek (dev, __pos, SEEK_SET) != __pos)				\
		error ("seek to " errstr " failed whilst writing tables");	\
	} while(0)

#define writebuf(buf,size,errstr)			\
	do {							\
		int __size = (size);				\
		if (write (dev, buf, __size) != __size)		\
		error ("failed whilst writing " errstr);	\
	} while(0)
static void write_tables(void)
{
	int x;
	int fat_length;
	fat_length = (size_fat == 32) ?
		le32toh(bs.fat32.fat32_length) : le16toh(bs.fat_length);
	seekto(0, "start of device");
	for (x = 0; x < reserved_sectors; ++x)
		writebuf(blank_sector, sector_size, "reserved sector");
	seekto(0, "boot sector");
	writebuf((char *)&bs, sizeof(struct msdos_boot_sector), "boot sector");
	if (size_fat == 32) {
		seekto(le16toh(bs.fat32.info_sector) * sector_size, "info sector");
		writebuf(info_sector, 512, "info sector");
		if (backup_boot != 0) {
			seekto(backup_boot * sector_size, "backup boot sector");
			writebuf((char *)&bs, sizeof(struct msdos_boot_sector),
					"backup boot sector");
		}
	}
	seekto(reserved_sectors * sector_size, "first FAT");
	for (x = 1; x <= nr_fats; x++) {
		int y;
		int blank_fat_length = fat_length - alloced_fat_length;
		writebuf(fat, alloced_fat_length * sector_size, "FAT");
		for (y = 0; y < blank_fat_length; y++)
			writebuf(blank_sector, sector_size, "FAT");
	}
	writebuf((char *)root_dir, size_root_dir, "root directory");

	if (blank_sector)
		free(blank_sector);
	if (info_sector)
		free(info_sector);
	free(root_dir);		/* Free up the root directory space from setup_tables */
	free(fat);			/* Free up the fat table space reserved during setup_tables */
}
static void usage(void)
{
	fatal_error("\
			Usage: mkfs.fat [-a][-A][-c][-C][-v][-I][-l bad-block-file][-b backup-boot-sector]\n\
			[-m boot-msg-file][-n volume-name][-i volume-id]\n\
			[-s sectors-per-cluster][-S logical-sector-size][-f number-of-FATs]\n\
			[-h hidden-sectors][-F fat-size][-r root-dir-entries][-R reserved-sectors]\n\
			[-M FAT-media-byte][-D drive_number]\n\
			/dev/name [blocks]\n");
}
static void check_atari(void)
{
#ifdef __mc68000__
	FILE *f;
	char line[128], *p;

	if (!(f = fopen("/proc/hardware", "r"))) {
		perror("/proc/hardware");
		return;
	}
	while (fgets(line, sizeof(line), f)) {
		if (strncmp(line, "Model:", 6) == 0) {
			p = line + 6;
			p += strspn(p, " \t");
			if (strncmp(p, "Atari ", 6) == 0)
				atari_format = 1;
			break;
		}
	}
	fclose(f);
#endif
}
int main(int argc, char **argv)
{
	int c;
	char *tmp;
	char *listfile = NULL;
	FILE *msgfile;
	struct stat statbuf;
	int i = 0, pos, ch;
	int create = 0;
	uint64_t cblocks = 0;
	int min_sector_size;
	if (argc && *argv) {	/* What's the program name? */
		char *p;
		program_name = *argv;
		if ((p = strrchr(program_name, '/')))
			program_name = p + 1;
	}
	gettimeofday(&create_timeval, NULL);
	create_time = create_timeval.tv_sec;
	volume_id = (u_int32_t) ((create_timeval.tv_sec << 20) | create_timeval.tv_usec);	/* Default volume ID = creation time, fudged for more uniqueness */
	check_atari();
	printf("mkfs.fat " VERSION " (" VERSION_DATE ")\n");
	if (optind < argc) {
		device_name = argv[optind];	/* Determine the number of blocks in the FS */
			cblocks = count_blocks(device_name, &orphaned_sectors);	/*  Have a look and see! */
	}
	 if (optind == argc - 1) {	/*  Or use value found */
		if (create)
			die("Need intended size with -C.");
		blocks = cblocks;
		tmp = "";
	} 
	if (check && listfile)	/* Auto and specified bad block handling are mutually */
		die("-c and -l are incompatible");	/* exclusive of each other! */
	if (!create) {
		check_mount(device_name);	/* Is the device already mounted? */
		dev = open(device_name, O_EXCL | O_RDWR);	/* Is it a suitable device to build the FS on? */
		if (dev < 0) {
			fprintf(stderr, "%s: unable to open %s: %s\n", program_name,
					device_name, strerror(errno));
			exit(1);		/* The error exit code is 1! */
		}
	}
	if (fstat(dev, &statbuf) < 0)
		die("unable to stat %s");
	if (!S_ISBLK(statbuf.st_mode)) {
		statbuf.st_rdev = 0;
		check = 0;
	} else
		if (!ignore_full_disk && ((statbuf.st_rdev & 0xffffff3f) == 0x0300 ||	/* hda, hdb */
					(statbuf.st_rdev & 0xffffff0f) == 0x0800 ||	/* sd */
					(statbuf.st_rdev & 0xffffff3f) == 0x0d00 ||	/* xd */
					(statbuf.st_rdev & 0xffffff3f) == 0x1600)	/* hdc, hdd */
		   )
			die("Device partition expected, not making filesystem on entire device '%s' (use -I to override)");
	 if(!(sector_size_set)){
		if (ioctl(dev, BLKSSZGET, &min_sector_size) >= 0) {
			sector_size = min_sector_size;
			sector_size_set = 1;
		}
	}
	establish_params(statbuf.st_rdev, statbuf.st_size); /* Establish the media parameters */
	setup_tables();		/* Establish the filesystem tables */
	write_tables();		/* Write the filesystem tables away! */
	exit(0);			/* Terminate with no errors! */
}
