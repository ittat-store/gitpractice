#include<stdio.h>
#include<stdlib.h>
int main()
{
	int i,j,rows;
	int (*a)[3];
	printf("enter rows\n");
	scanf("%d",&rows);
	a=(int (*)[3])malloc(rows*3*sizeof(int));
	for(i=0;i<rows;i++)
	{
		for(j=0;j<3;j++)

		{
			printf("enter a[%d][%d]",i,j);
			scanf("%d",&a[i][j]);
		}
	}

/*	for(i=0;i<rows;i++)
	{
		for(j=0;j<3;j++)
			printf("%3d",a[i][j]);
		printf("\n");
	}*/

	for(i=0;i<rows&&j<3;j++)
	{
		printf("%3d",a[i][j]);
		if(j==3-1)
		{
			j=-1;
			i++;
			printf("\n");
		}
		else
			continue;
	}



}
