#include <stdio.h>
#include <stdlib.h>
main()
{
	long long int n, m, i, j, l, count=0, min, x;
	scanf("%lld",&n);
	scanf("%lld",&m);
	x = m*m*n - m*m;
	long long int array[n][m], diff[x];
	for(i=0;i<n;i++)
	{
		for(j=0;j<m;j++)
		{
			scanf("%lld",&array[i][j]);
		}
	}
	for(i=0;i < n-1;i++)
	{
		for(j=0;j<m;j++)
		{
			for(l=0;l<m;l++)
			{
				if(array[i][j] > array[i+1][l])
				{
					diff[count] = array[i][j] - array[i+1][l];
				}
				else
				{
					diff[count] = array[i+1][l] - array[i][j];
				}
				count = count + 1;
			}
		}
	}

	min = diff[0];

	for(i=0;i<x-1;i++)
	{
		if(diff[i+1] < min)
		{
			min = diff[i+1];
		}
	}

	if(n>=2&&m<=1000)
	{
		printf("%lld",min);
	}
}
