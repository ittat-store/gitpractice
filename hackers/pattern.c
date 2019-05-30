#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>

int main() 
{

	int n;
	scanf("%d", &n);
	// Complete the code to print the pattern.
	for(int row=0;row<n;row++)
	{
		for(int col=0;col<2*n-1;col++)
		{
			if(row>col)
				printf("%d ",n-col);
			else if(col<(2*n-1-row))
				printf("%d ",n-row);
			else
				printf("%d ",col-n+2);

		}
		printf("\n");
	}
	for(int row=n-1;row>0;row--)
	{
		for(int col=0;col<2*n-1;col++)
		{
			if(row>col)
				printf("%d ",n-col);
			else if(col<(2*n-1-row))
				printf("%d ",n-row+1);
			else
				printf("%d ",col-n+2);
		}
		printf("\n");
	}
}

