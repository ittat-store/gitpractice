#include<stdio.h>
main()
{
	int i,j;
	int n=5;
	for(i=1;i<n;i++)
	{
		int k='A';
		for(j=1;j<=n;j++)
		{
			//if(j<=n-i)
			if(j<=i)
				//printf(" ");
				printf("%c",k++);
			else
				//printf("%c",k++);
				printf(" ");
		}
		printf("\n");
	}
}
