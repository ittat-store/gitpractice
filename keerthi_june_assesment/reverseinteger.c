#include<stdio.h>
#include<stdlib.h>
int main()
{
int num,temp,rev=0,rem;
printf("enter number\n");
scanf("%d",&num);
temp=num;
while(temp)
{
rem=temp%10;
rev=rev*10+rem;
temp=temp/10;
}
printf("reversed number is %d\n",rev);
return 0;
}
