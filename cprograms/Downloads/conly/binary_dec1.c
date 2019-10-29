#include<stdio.h>
main()
{
	int num=0,i;
	char ch;
	for(i=0;i<8;i++)
	{
		ch=getchar();
		if(ch=='0')
			num=num<<1;
		else if(ch=='1')
			num=(num<<1)+1;
		else
			break;
	}
	printf("%d\n",num);
}
