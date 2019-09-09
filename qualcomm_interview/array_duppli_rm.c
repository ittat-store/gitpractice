#include<stdio.h>
main()
{
	int arr[10];
	int size,i;
	size=sizeof(arr)/sizeof(arr[0]);
	for(i=0;i<size;i++)
		scanf("%d",&arr[i]);

	printf("\n");
	int j=0;
	for(i=0;i<size-1;i++)
	{
		if(arr[i]!=arr[i+1])
		{
			arr[j]=arr[i];
			j++;
		}
	}
	arr[j]=arr[size-1];
       for(i=0;i<size;i++)
       printf("%d ",arr[i]);
}

