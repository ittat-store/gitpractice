#include<stdio.h>
int main()
{
int rem,num,count =0;
printf("enter number\n");
scanf("%d",&num);
while(num)
{
rem=num%2;
if(rem==1)
count++;
num=num/2;
}
printf("number of ones in a number is %d\n",count);
return 0;
}
