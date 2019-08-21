#include<stdio.h>
#include<sys/stat.h>
int main()
{
  struct stat sfile; //pointer to stat struct
  stat("stat.c", &sfile); //stat system call
  printf("st_mode = %o\n", sfile.st_mode); //accessing st_mode (data member of stat struct)
  printf("no of hard links for the file = %o",sfile.st_nlink); 
  return 0;
}
