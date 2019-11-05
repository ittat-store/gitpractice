#include<stdio.h>
main()
{
	int i,n;
	printf("enter decimal number\n");
	scanf("%d",&n);
	for(i=7;i>=0;i--)
		if(n&(1<<i))
			printf("1");
		else
			printf("0");
}
