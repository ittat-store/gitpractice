#include<stdio.h>
#include<stdlib.h>
int main()
{
	int i,j=0,k=0;
	int arr1[100];
	int a[2][3]={{1,2,3},{4,5,6}};
	int row=sizeof(a)/sizeof(a[0]);
	int col=sizeof(a[0])/sizeof(a[0][0]);
	/*	for(i=0;i<row;i++)
		{
		for(j=0;j<col;j++)
		{
		printf("%3d",a[i][j]);
		arr1[k]=a[i][j];
		k++;
		}
		}
		printf("\n");
		for(i=0;i<row*col;i++)
		printf("%3d",arr1[i]);*/

	for(i=0;i<row&&j<col;j++)
	{
		printf("%d ",a[i][j]);
		if(j==col-1)
		{
			j=-1;
			i++;
			printf("\n");
		}
		else
			continue;
	}
}
