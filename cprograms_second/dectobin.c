#include<stdio.h>
#include<stdlib.h>
long int binary(int num)
{
long a=1,bin=0,rem;
while(num>0)
{
rem=num%2;
bin=bin+rem*a;
num=num/2;
a=a*10;
}
return bin;
}



int main()
{
int num;
printf("enter number\n");
scanf("%d",&num);
printf("decimal=%d,binary=%ld\n",num,binary(num));
return 0;
}
