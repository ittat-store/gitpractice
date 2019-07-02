#include<stdio.h>
#include<stdlib.h>
int main()
{
	int data,p1,p2,out,x,y;
	printf("enter data\n");
	scanf("%d",&data);
	printf("enter two bit positions\n");
	scanf("%d %d",&p1,&p2);
	x=(data>>p1)&1;
	y=(data>>p2)&1;
	printf(" x and y is %d ,%d \n",x,y);
	if(x!=y)
	{
		out=data^((1<<p1)|(1<<p2));
		printf("%d\n",out);
	}
	else
		printf("%d\n",data);
	return 0;
}
