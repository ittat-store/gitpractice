#include<stdio.h>
main()
{
char *ptr="void pointer";
void *vptr;
vptr=&ptr;
printf("%s",*(char**)vptr);
}
