#include <stdio.h>
#include <stdlib.h>
#include <mntent.h>
#include<string.h>
int main(void)
{
  struct mntent *ent;
  FILE *aFile,*fd;
char *str;
  aFile = setmntent("/proc/mounts", "r");
  if (aFile == NULL) {
    perror("setmntent");
    exit(1);
  }

while (NULL != (ent = getmntent(aFile))) {
//    printf("%s \n", ent->mnt_type);
//printf("%s \n", ent->mnt_fsname);
printf("%s \n", ent->mnt_fsname);
if(strcmp(ent->mnt_fsname,"/dev/sdb1")==0)
{
printf("%s \n", ent->mnt_fsname);
printf("%s \n", ent->mnt_dir);
str=ent->mnt_dir;
fd=fopen(str,"r");
printf("%d",fd);


}

  }
  endmntent(aFile);
}
                   
