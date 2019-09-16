#include<stdio.h>
#pragma pack(1)
struct st
{
int a;
char b;
double c;
}
main()
{
printf("size is %d\n",sizeof(struct st));
}
