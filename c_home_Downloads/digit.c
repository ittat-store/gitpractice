#include<stdio.h>
int main()
{
	int n,a,b,c,max=0,max1=0;
	printf("enter a number\n");
	scanf("%d",&n);
	b=n;
	while(n)
	{
		a=n%10;
		if(a>max)
			max=a;
		n=n/10;
	}
	while(b)
	{
		c=b%10;
		if(c<max && c>max1)
			max1=c;
		b=b/10;
	}
	printf("%d\n",max1);
		
}

