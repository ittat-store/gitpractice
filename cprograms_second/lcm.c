#include<stdio.h>
#include<stdlib.h>
int main()
{
	int a,b;
	printf("enter a and b\n");
	scanf("%d %d",&a,&b);
	int x,y;
	x=a;
	y=b;
	while(a!=b)
	{
		if(a<b)
			a=a+x;
		else
			b=b+y;
	}
	printf("lcm is %d",a);
}
