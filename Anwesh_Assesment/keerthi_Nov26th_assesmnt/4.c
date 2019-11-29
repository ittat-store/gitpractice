#include<stdio.h>

int main()

{

	int i,j,n,k;

	printf("enter the n,k values\n");

	scanf("%d%d",&n,&k);

	int a[10][20],b[10];

	printf("enter n values\n");

	for(i=0;i<n-1;i++)

	{

		for(j=0;j<2;j++)

		{

			scanf("%d",&a[i][j]);

		}

	}

	printf("enter k values\n");

	for(i=0;i<k;i++)

		scanf("%d",&b[i]);

	printf("value is %d\n",n-1);



}
