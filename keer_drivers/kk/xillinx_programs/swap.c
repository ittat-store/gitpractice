#include<stdio.h>
int main()
{
	int num1,num2;
	printf("enter num1 and num\n");
	scanf("%d %d",&num1,&num2);
	num1=num1+num2;
	num2=num1-num2;
	num1=num1-num2;
	printf("num1 and num2 is %d and %d\n",num1,num2);
	return 0;
}
