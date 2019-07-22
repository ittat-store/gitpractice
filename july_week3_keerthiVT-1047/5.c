#include<stdio.h>
main()
{
int a=5;
int b,c;

b=++a;
c=b++;
a=++b+c++;
printf("%d %d %d \n",a,b,c);
}
