#include<stdio.h>
main()
{
int num,temp,max,rem;
scanf("%d",&num);
while(num)
{
rem=num%10;
if(rem>max)
max=rem;
num=num/10;
}
printf("%d",max);
}
