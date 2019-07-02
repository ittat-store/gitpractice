#include<stdio.h>
#include<stdlib.h>
int main()
{
	int num,i,r;
	printf("enter binary format\n");
	scanf("%d",&num);
	printf("enter number of rotations\n");
	scanf("%d",&r);
	for(i=1;i<=r;i++)
	{
		if(num&1)
			num=(num>>1)|(1<<8);
		else
			num=(num>>1)&(~(1<<8));
	}
	printf("%d",num);
}

