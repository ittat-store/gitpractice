#include<stdio.h>
int fun()
{
static int a=10;
return a;
}



int main()
{
printf("%d\n",fun()++);
}

