#include <asm/types.h>
#define ATTR_RO      1		/* read-only */
#define ATTR_HIDDEN  2		/* hidden */
#define ATTR_SYS     4		/* system */
#define ATTR_VOLUME  8		/* volume label */
#define ATTR_DIR     16		/* directory */
#define ATTR_ARCH    32		/* archived */
#define ATTR_NONE    0		/* no attribute bits */
#define ATTR_UNUSED  (ATTR_VOLUME | ATTR_ARCH | ATTR_SYS | ATTR_HIDDEN)
#define FAT_EOF      (atari_format ? 0x0fffffff : 0x0ffffff8)
#define FAT_BAD      0x0ffffff7
#define MSDOS_EXT_SIGN 0x29	/* extended boot sector signature */
#define MSDOS_FAT12_SIGN "FAT12   "	/* FAT12 filesystem signature */
#define MSDOS_FAT16_SIGN "FAT16   "	/* FAT16 filesystem signature */
#define MSDOS_FAT32_SIGN "FAT32   "	/* FAT32 filesystem signature */
#define BOOT_SIGN 0xAA55	/* Boot sector magic number */
#define MAX_CLUST_12	((1 << 12) - 16)
#define MAX_CLUST_16	((1 << 16) - 16)
#define MIN_CLUST_32    65529
#define MAX_CLUST_32	((1 << 28) - 16)
#define FAT12_THRESHOLD	4085
#define OLDGEMDOS_MAX_SECTORS	32765
#define GEMDOS_MAX_SECTORS	65531
#define GEMDOS_MAX_SECTOR_SIZE	(16*1024)
#define BOOTCODE_SIZE		448
#define BOOTCODE_FAT32_SIZE	420
struct msdos_volume_info {
	__u8 drive_number;		/* BIOS drive number */
	__u8 RESERVED;		/* Unused */
	__u8 ext_boot_sign;		/* 0x29 if fields below exist (DOS 3.3+) */
	__u8 volume_id[4];		/* Volume ID number */
	__u8 volume_label[11];	/* Volume label */
	__u8 fs_type[8];		/* Typically FAT12 or FAT16 */
} __attribute__ ((packed));
struct msdos_boot_sector {
	__u8 boot_jump[3];		/* Boot strap short or near jump */
	__u8 system_id[8];		/* Name - can be used to special case
					   partition manager volumes */
	__u8 sector_size[2];	/* bytes per logical sector */
	__u8 cluster_size;		/* sectors/cluster */
	__u16 reserved;		/* reserved sectors */
	__u8 fats;			/* number of FATs */
	__u8 dir_entries[2];	/* root directory entries */
	__u8 sectors[2];		/* number of sectors */
	__u8 media;			/* media code (unused) */
	__u16 fat_length;		/* sectors/FAT */
	__u16 secs_track;		/* sectors per track */
	__u16 heads;		/* number of heads */
	__u32 hidden;		/* hidden sectors (unused) */
	__u32 total_sect;		/* number of sectors (if sectors == 0) */
	union {
		struct {
			struct msdos_volume_info vi;
			__u8 boot_code[BOOTCODE_SIZE];
		} __attribute__ ((packed)) _oldfat;
		struct {
			__u32 fat32_length;	/* sectors/FAT */
			__u16 flags;	/* bit 8: fat mirroring, low 4: active fat */
			__u8 version[2];	/* major, minor filesystem version */
			__u32 root_cluster;	/* first cluster in root directory */
			__u16 info_sector;	/* filesystem info sector */
			__u16 backup_boot;	/* backup boot sector */
			__u16 reserved2[6];	/* Unused */
			struct msdos_volume_info vi;
			__u8 boot_code[BOOTCODE_FAT32_SIZE];
		} __attribute__ ((packed)) _fat32;
	} __attribute__ ((packed)) fstype;
	__u16 boot_sign;
} __attribute__ ((packed));
#define fat32	fstype._fat32
#define oldfat	fstype._oldfat
struct fat32_fsinfo {
	__u32 reserved1;		/* Nothing as far as I can tell */
	__u32 signature;		/* 0x61417272L */
	__u32 free_clusters;	/* Free cluster count.  -1 if unknown */
	__u32 next_cluster;		/* Most recently allocated cluster.
					 * Unused under Linux. */
	__u32 reserved2[4];
};
struct msdos_dir_entry {
	char name[8], ext[3];	/* name and extension */
	__u8 attr;			/* attribute bits */
	__u8 lcase;			/* Case for base and extension */
	__u8 ctime_ms;		/* Creation time, milliseconds */
	__u16 ctime;		/* Creation time */
	__u16 cdate;		/* Creation date */
	__u16 adate;		/* Last access date */
	__u16 starthi;		/* high 16 bits of first cl. (FAT32) */
	__u16 time, date, start;	/* time, date and first cluster */
	__u32 size;			/* file size (in bytes) */
} __attribute__ ((packed));
char dummy_boot_jump[3] = { 0xeb, 0x3c, 0x90 };

char dummy_boot_jump_m68k[2] = { 0x60, 0x1c };
#define MSG_OFFSET_OFFSET 3
char dummy_boot_code[BOOTCODE_SIZE] = "\x0e"	/* push cs */
"\x1f"			/* pop ds */
"\xbe\x5b\x7c"		/* mov si, offset message_txt */
/* write_msg: */
"\xac"			/* lodsb */
"\x22\xc0"			/* and al, al */
"\x74\x0b"			/* jz key_press */
"\x56"			/* push si */
"\xb4\x0e"			/* mov ah, 0eh */
"\xbb\x07\x00"		/* mov bx, 0007h */
"\xcd\x10"			/* int 10h */
"\x5e"			/* pop si */
"\xeb\xf0"			/* jmp write_msg */
/* key_press: */
"\x32\xe4"			/* xor ah, ah */
"\xcd\x16"			/* int 16h */
"\xcd\x19"			/* int 19h */
"\xeb\xfe"			/* foo: jmp foo */
/* message_txt: */
"This is not a bootable disk.  Please insert a bootable floppy and\r\n"
"press any key to try again ... \r\n";
#define MESSAGE_OFFSET 29	/* Offset of message in above code */
