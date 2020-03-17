#include<stdio.h>
int a,b;
void swap(int *a, int *b)
{
int temp;
temp=*a;
*a=*b;
*b=temp;
printf("%d %d\n",*a,*b);
}


main()
{
scanf("%d %d",&a,&b);
swap(&a,&b);
//printf("%d %d\n",a,b);
}
