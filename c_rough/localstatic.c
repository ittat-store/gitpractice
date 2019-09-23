#include<stdio.h>
 int a=5;
void fun()
{
a++;
printf("%d\n",a);
}

main()
{
 //int a=5;
printf("%d\n",++a);
fun();
}
