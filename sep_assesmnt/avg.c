#include<stdio.h>
int main()
{
int n,i,num;
float sum=0;
//printf("enter num of integers\n");
scanf("%d",&n);
for(i=0;i<n;i++)
{
scanf("%d",&num);
sum=sum+num;
}
sum=sum/n;
printf("%.3f\n",sum);
}
