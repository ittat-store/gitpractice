#include<stdio.h>
main()
{
int i,num;
printf("enter num\n");
scanf("%d",&num);
for(i=7;i>=0;i--)
printf("%d ",((num>>i)&1));
}
