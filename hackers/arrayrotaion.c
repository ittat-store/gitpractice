#include<stdio.h>
#define size 100
int main()
{
	int arr[size];
	int n,r,i,j;
	printf("enter the nof elem to be inserted");
	scanf("%d",&n);
	for(i=0;i<n;i++)
	{
		scanf("%d",&arr[i]);
	}
	printf("enter the r rotation");
	scanf("%d",&r);
	for(i=0;i<r;i++)
	{
		int temp=arr[0];
		for(j=0;j<n;j++)
		{
			arr[j]=arr[j+1];
		}
		arr[--j]=temp;
	}
for(i=0;i<n;i++)
printf("%d",arr[i]);
}

