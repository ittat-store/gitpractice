#include<stdio.h>
#pragma pack(1)
#pragma GCC poison printf
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
