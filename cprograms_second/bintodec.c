#include<stdio.h>
#include<stdlib.h>
 int deci(int num)
{
int  a=1,dec=0,rem;
while(num>0)
{
rem=num%10;
dec=dec+rem*a;
num=num/10;
a=a*2;
}
return dec;
}



int main()
{
int num;
printf("enter number\n");
scanf("%d",&num);
printf("binary=%ld,decimal=%d\n",num,deci(num));
return 0;
}
