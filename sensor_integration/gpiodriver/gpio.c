#include<linux/init.h>
#include<linux/module.h>
#include<linux/gpio.h>
#include<linux/kernel.h>
#include<linux/interrupt.h>
MODULE_LICENSE("GPL");
MODULE_AUTHOR("AKBAR");
MODULE_DESCRIPTION("GPIO DRIVER FOR BEAGAL BONE BLACK");
static unsigned int gpioled=49;
static unsigned int gpiobutton=115;
static unsigned int irqnumber;
static unsigned int noofpress=0;
static bool ledon=0;
static irq_handler_t gpio_irqhandler(unsigned int irq, void *dev_id, struct pt_regs *regs);

  static int gpio_init(void)
  {
    int res=0;
    printk(KERN_INFO"gpio intialization");
        if(!gpio_is_valid(gpioled)){
               printk(KERN_INFO"gpio is not valid");
               return -ENODEV;
           }
     ledon=true;
     gpio_request(gpioled,"sysfs");
     gpio_direction_output(gpioled,ledon);
     gpio_export(gpioled,false);
     gpio_request(gpiobutton,"sysfs");
     gpio_direction_input(gpiobutton);
     gpio_set_debounce(gpiobutton,200);
     gpio_export(gpiobutton,false);
     printk(KERN_INFO"gpio button state %d\n",gpio_get_value(gpiobutton));
     irqnumber=gpio_to_irq(gpiobutton);
     printk(KERN_INFO"gpiobutton is mapped to irq:%d\n",irqnumber);
     res=request_irq(irqnumber, (irq_handler_t)gpio_irqhandler, IRQF_TRIGGER_RISING,"ebb_gpio_handler",NULL);
     printk(KERN_INFO"request irq result is:%d\n",res);
     return res;
  }
  void gpio_exit(void){
    printk(KERN_INFO"gpiobutton status:%d\n",gpio_get_value(gpiobutton));
    printk(KERN_INFO"gpiobutton preesed noftimes:%d\n",noofpress);
    gpio_set_value(gpioled,0);
    gpio_unexport(gpioled);
    free_irq(irqnumber,NULL);
    gpio_unexport(gpiobutton);
    gpio_free(gpioled);
    gpio_free(gpiobutton);
    printk(KERN_INFO"good bye all");
  }

  
  static irq_handler_t gpio_irqhandler(unsigned int irq, void *dev_id, struct pt_regs *regs)
  {
    ledon=!ledon;
    gpio_set_value(gpioled,ledon);
    printk(KERN_INFO"irqhandler buttonstate :%d\n",gpio_get_value(gpiobutton));
    noofpress++;
    return (irq_handler_t)IRQ_HANDLED;
  }
module_init(gpio_init);
module_exit(gpio_exit);





