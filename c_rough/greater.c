#include<stdio.h>
main()
{
	int *arr,i,j,n,max;
	scanf("%d",&n);
	arr=(int *)malloc(n*sizeof(int));

	for(i=0;i<n;i++)
		scanf("%d",&arr[i]);

	max=arr[0];

	for(i=1;i<n;i++)
	{
		if(max>arr[i])
			continue;
		else
			max=arr[i];
	}

	printf("%d",max);
}
