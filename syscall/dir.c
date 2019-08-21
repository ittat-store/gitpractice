#include<stdio.h>
main(int argc,char *argv)
{
DIR *dp;
struct dirent *ptr;
dp=opendir(argv[1]);
while(ptr=readdir(dp))
printf("%s ",ptr->d_name);
closedir(dp);
}
