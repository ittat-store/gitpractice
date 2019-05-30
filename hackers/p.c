#include<stdio.h>
int*fun();
int main()
{
int *p;
p=fun();
printf("%d",*p);
}
int*fun()
{
int *ptr,x;
x=100;
ptr=&x;
return ptr;
}
