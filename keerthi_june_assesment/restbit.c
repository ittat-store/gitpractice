#include<stdio.h>
int main()
{
	int i,num,pos;
	printf("enter num and pos\n");
	scanf("%d %d",&num,&pos);
	int bit=sizeof(int)*8-1;
	for(i=bit;i>=0;i--)
		if((num>>i)&1)
			printf("1");
		else
			printf("0");
	printf("\n");
	num=num&(~(1<<pos));
	printf("%d\n",num);
	return 0;
}
