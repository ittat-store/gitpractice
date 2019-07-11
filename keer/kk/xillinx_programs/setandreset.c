#include<stdio.h>
int main()
{
	int i,num,bit1,bit2;
	printf("enter num and bit1 and bit2\n");
	scanf("%d %d %d",&num,&bit1,&bit2);
	int bit=sizeof(int)*8-1;
	for(i=bit;i>=0;i--)
		if((num>>i)&1)
			printf("1");
		else
			printf("0");
	printf("\n");
	num=num|(1<<bit1);
	printf("%d\n",num);

	num=num&(~(1<<bit2));
	printf("%d\n",num);
	return 0;
}
