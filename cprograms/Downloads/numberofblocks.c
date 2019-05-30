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
#include <endian.h>
#include <asm/types.h>

#define llseek lseek
#define die( str ) fatal_error("%s: "str "\n")

#define TRUE 1			/* Boolean constants */
#define FALSE 0


static char *program_name="mkfs.fat";
static int valid_offset(int fd, loff_t offset);
static int sector_size=512;
static char *device_name=NULL;
static int orphaned_sectors=0;

static int valid_offset(int fd, loff_t offset)
{
	char ch;

	if (llseek(fd, offset, SEEK_SET) < 0)
		return FALSE;
	if (read(fd, &ch, 1) < 1)
		return FALSE;
	return TRUE;
}



static void fatal_error(const char *fmt_string)
{
	fprintf(stderr, fmt_string, program_name, device_name);
	exit(1);			/* The error exit code is 1! */
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

/*
 * ++roman: On m68k, check if this is an Atari; if yes, turn on Atari variant
 * of MS-DOS filesystem by default.
 */

static uint64_t count_blocks(char *filename, int *remainder)
{
	loff_t high, low;
	int fd;

	if ((fd = open(filename, O_RDONLY)) < 0) {
		perror(filename);
		exit(1);
	}

	/* first try SEEK_END, which should work on most devices nowadays */
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


int main(int argc,char **argv)
{
	uint64_t cblocks=0;
	int create=0;

	if (optind < argc) {
		device_name = argv[optind];     /* Determine the number of blocks in the FS */

		if (!device_name) {
			printf("No device specified.\n");
			usage();
		}

//		if (!create)
			cblocks = count_blocks(device_name, &orphaned_sectors);    /*  Have a look and see! */
		printf("%ld\n",cblocks);
	}
}


