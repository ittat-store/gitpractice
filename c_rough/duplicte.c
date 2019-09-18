#include<stdio.h>
main()
{
	int arr[]={1,2,2,3,4};
	int i,j=0,n=5;
	//for(i=0;i<n;i++)
		//scanf("%d",&arr[i]);

	for(i=0;i<n-1;i++)
	{
		if(arr[i]!=arr[i+1])
		{
			arr[j++]=arr[i];
			//printf("%d",arr[j]);
			//j++;
		}
	}
       arr[j++]=arr[n-1];
for(i=0;i<j;i++)
printf("%d\n",arr[i]);
}
