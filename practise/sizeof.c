#include<stdio.h>
#define mysizeof(x) (char*)(&x+1)-(char *)(&x)
main()
{
double x;
printf("%d",mysizeof(x));
}
