#include <linux/kernel.h>
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kdev_t.h>
#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/device.h>
#include<linux/slab.h>                 //kmalloc()
#include<linux/uaccess.h>              //copy_to/from_user()
#include<linux/ioctl.h>

#define WR_VALUE_IOW('a','a',int32_t*)
#define RD_VALUE_IOR('a','b',int32_t*)

int main()
{
int fd;
int32_t value,number;
printf("*************\n");
printf("******welcome******\n");

printf("\n opening driver\n");
fd=open("/dev/etx_device",O_RDWR);
if(fd<0)
{
printf("cannot open device file...\n");
return 0;
}

printf("enter the value to send\n");
scanf("%d",&number);
printf("writing value to driver\n");
ioctl(fd,WR_VALUE,(int32_t*) &number);

printf("reading value to driver\n");
ioctl(fd,RD_VALUE,(int32_t*) &value);
printf("value is %d\n",value);

printf("closing driver\n");
close(fd);
}

