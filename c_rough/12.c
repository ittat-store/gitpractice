#include<stdio.h>
main()
{
int k=5;
int *p=&k;
int **m=&p;
printf("%d%d%d\n",k,*p,**m);
}

