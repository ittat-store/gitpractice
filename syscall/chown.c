/* CELEBC12

   This example changes the owner and group of a file.

 */
#define _POSIX_SOURCE
#include <unistd.h>
#include <sys/stat.h>
#include <sys/types.h>
#undef _POSIX_SOURCE
#include <stdio.h>

main() {
  char fn[]="./temp.file";
  FILE *stream;
  struct stat info;

  if ((stream = fopen(fn, "w")) == NULL)
    perror("fopen() error");
  else {
    fclose(stream);
    stat(fn, &info);
    printf("original owner was %d and group was %d\n", info.st_uid,
           info.st_gid);
    if (chown(fn, 25, 0) != 0)
      perror("chown() error");
    else {
      stat(fn, &info);
      printf("after chown(), owner is %d and group is %d\n",
             info.st_uid, info.st_gid);
    }
    unlink(fn);
  }
}
