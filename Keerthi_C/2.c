#include<stdio.h>
main()
{
int i=5;
void *vptr;
vptr=&i;
printf("value of vptr=%d",*vptr);
}
