#include<stdio.h>
int x=10;
static int y=&x;
main()
{
printf("%u\n",y);
}
