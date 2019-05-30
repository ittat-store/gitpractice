int main(void)
{
    int fd;
    char gpio_buffer[10];
    char choice[10];
 
    fd = open( “/dev/gpio_drv”, O_RDWR );
 
    printf( “Value of fd is: %d”, fd );
 }
