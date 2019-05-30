#include<stdio.h>
#include<stdlib.h>
#include<math.h>
void factor(int arr[],int);
#define size 1000
int s=0;
int main()
{
	int num,arr[size],count=1;
	printf("enter the number");
	scanf("%d",&num);
	arr[0]=num;
	factor(arr,count);
}
void factor(int arr[],int count)
{
	int i,j,k=0,u;
	int b[size];
	for(i=0;i<count;i++)
	{
		for(j=1;j<=sqrt(arr[i]);j++)
		{
			if(arr[i]%j==0)
			{
				if(j==1)
				{
					b[k]=arr[i]-1;
					k++;
				}
				else
				{
					u=arr[i]/j;
					b[k]=u;
					k++;
				}
			}
		}
	}
	for(j=0;j<k;j++)
	{
		if(b[j]==0)
		{
			printf("%d\n",s+1);
			return;
		}
	}
	s++;
	factor(b,k);
	return;
}
