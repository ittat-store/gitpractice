#include<stdio.h>
#include<stdlib.h>
int main()
{
int data;
printf("enter data\n");
scanf("%d",&data);
if((data&0x01)==0)
printf("even");
else
printf("odd");
}

