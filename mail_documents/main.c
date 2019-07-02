#include<stdio.h>
#include<stdlib.h>
#include<fcntl.h>

#define DEVICE "/dev/fake device"

int main()
{
int i,fd;
char ch,write_buf[100],read_buf[100];

fd=open(DEVICE,O_RDWR);
if(fd==-1)
{
printf("file either does not exist or hads been locked by another process\n",DEVICE);
exit(-1);
}

printf("r=read from device \nw=write to device\nenter command:");
scanf("%c",&ch);

switch(ch)
{
case 'w':printf("enter data\n");
         write(fd,write_buf,sizeof(write_buf));
         break;
case 'r':read(fd,read_buf,sizeof(read_buf));
         printf("device:%s\n",read_buf);
         break;
default :
printf("command not recognized\n");
}
close(fd);
return 0;
}

