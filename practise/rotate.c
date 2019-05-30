#include<stdio.h>
#include<stdlib.h>
int main()
{
	int *arr;
	int n,i=0,r,t,j;
	printf("enter the no of elements to be inserted");
	scanf("%d",&n);
	arr=malloc(n*sizeof(int));
	for(i=0;i<n;i++)
	{

		printf("enter the element");
		scanf("%d",&arr[i]);
	}
	printf("enter the number of rotations");
	scanf("%d",&r);
	for(i=0;i<r;i++)
	{
		for(j=0;j<n-1;j++)
		{
			t=arr[j];
			arr[j]=arr[j+1];
			arr[j+1]=t;
		}
	}
	for(i=0;i<n;i++)
		printf("%d",arr[i]);



}
