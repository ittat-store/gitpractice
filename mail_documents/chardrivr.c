
#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/fs.h>
#include <linux/poll.h>
#include <linux/ioport.h>
#include <linux/errno.h>
#include <linux/cdev.h>
MODULE_AUTHOR("AKBAR");
MODULE_LICENSE("GPL..");
MODULE_DESCRIPTION("CHARECTER DRIVER");
#define DEVICE "chardriv" 
#define MAX_BUF_SIZE 1024
//static int Major;
static int my_start(void);
void my_exit(void);
static int mydev_open(struct inode * ,struct file *);
static int mydev_close(struct inode *,struct file *);
static ssize_t mydev_write(struct file *, const char *, size_t , loff_t *);
static ssize_t mydev_read(struct file *, char *, size_t , loff_t *);
/*
 *all total operations done by driver 
 *is mentioned in this fileoperations 
 *structure. here this driver has open 
 *read write and close functions along 
 *with init and exit modules
 */
typedef struct {
	char buf[1024];
	int noofchar;
	struct cdev mycdev;
}mydev_t;
mydev_t mydev;
dev_t devno;
static struct file_operations fops =
{
  .read    = mydev_read,
  .write   = mydev_write,
  .open    = mydev_open,
  .release = mydev_close
};

static int my_start(void){
    
    int ret;
    devno=MKDEV(42,0);
   ret= register_chrdev_region(devno,10,DEVICE);
   if(ret<0){
      printk("<1>""device not registered \n");
      my_exit();
   }
   cdev_init(&mydev.mycdev,&fops);
   mydev.mycdev.owner=THIS_MODULE; 
   printk("<1>""device registered \n");
   cdev_add(&mydev.mycdev,devno,10);
   mydev.noofchar=0;
   return 0;
}
void my_exit(void){
 
	devno=MKDEV(42,0);
	cdev_del(&mydev.mycdev);
        unregister_chrdev_region(devno,10);
        printk("<1>""device un registered \n");
  
}

static int mydev_open(struct inode *inode ,struct file *file){
  try_module_get(THIS_MODULE);
  file->private_data=&mydev;
  if(file->f_mode&FMODE_READ)
	printk("<1>""open read error");
 if(file->f_mode&FMODE_WRITE)
	printk("<1>""open write error");
 return 0;
}


static int mydev_close(struct inode *inode,struct file *file)
{
module_put(THIS_MODULE);
printk("<1>""closed");
return 0;
}



static ssize_t mydev_write(struct file *file, const char *buf, size_t count, loff_t *offset)
{
	mydev_t *tdev;
	tdev=file->private_data;
	if(count<MAX_BUF_SIZE)
	count=MAX_BUF_SIZE;
	copy_from_user(tdev->buf, buf,count);
	tdev->noofchar=count;
	return (ssize_t)count;
}


static ssize_t mydev_read(struct file *file, char *buf, size_t count, loff_t *offset)
{
	mydev_t *tdev;
	tdev=file->private_data;
	if(count>tdev->noofchar)
	count=tdev->noofchar;
	copy_to_user(buf,tdev->buf,count);
	printk("<1>""read called");
	return (ssize_t)count;
}

module_init(my_start);
module_exit(my_exit);


