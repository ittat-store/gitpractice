#include<stdio.h>
#include<stdlib.h>
#include<string.h>

int binarytodec(int num)
{
	int  a=1,dec=0,rem;
	printf("number is %d\n",num);
	while(num>0)
	{
		rem=num%10;
		dec=dec+rem*a;
		num=num/10;
		a=a*2;
	}
	return dec;
}



int main()
{
	int k,i,num,out[100];
	int temp,buffer;
	int bit1,bit2;
	int bit=sizeof(num)*8-1;
	printf("enter  num\n");
	scanf("%d",&num);
	for(i=bit;i>=0;i--)
	{
		k=num>>i;
		if(k&1)
		{
			out[i]=1;
			printf("%d ",out[i]);
		}
		else
		{
			out[i]=0;
			printf("%d ",out[i]);
		}
	}
	printf("binary equivalent is \n");
	for(i=bit;i>=0;i--)
	{
		printf("%d",out[i]);
	}
	printf("enter two bit positions\n");
	scanf("%d %d",&bit1,&bit2);
	if(out[bit1]!=out[bit2])
	{
		temp=out[bit1];
		out[bit1]=out[bit2];
		out[bit2]=temp;
	}
	printf("after swap is\n");
	for(i=bit;i>=0;i--)
	{
		printf("%d",out[i]);
	}

	//strncpy(buffer,out);

	//printf("decimal is %d\n",binarytodec(out));
}



