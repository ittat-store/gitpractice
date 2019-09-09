#include<stdio.h>
main()
{
int i=5,*ptr;
ptr=&i;
void *vptr;
vptr=&ptr;
printf("value of iptr=%d",**(int ***)vptr);
}
