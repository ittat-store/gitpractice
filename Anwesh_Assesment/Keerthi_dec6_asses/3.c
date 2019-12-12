#include<stdio.h>
#include<stdlib.h>
int main()
{	int i;
	int a[8],out[2],cnt1=0;
	for(i=0;i<8;i++)
	{
		scanf("%d",&a[i]);
		if(a[i]==3)
			cnt1++;
	}
	out[0]=cnt1;
	out[1]=0;
	printf("output:\n");
	for(i=0;i<2;i++)
	{
		printf("%d\n",out[i]);
	}
}

