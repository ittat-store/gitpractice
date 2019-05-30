#include<stdio.h>
#include<stdlib.h>
int main()
{
	char bit;
	int i,num=0;
	printf("enter bit pattern\n");
	for(i=0;i<=8;i++)
	{
		bit=getchar();
		if(bit=='0')
			num=num<<1;
		else if(bit=='1')
			num=(num<<1)+1;
		else
			break;
	}
	printf("decimal %d\n",num);
}
