#include<stdio.h>
/*main()
  {
  int *arr,n,i,j=0;
  scanf("%d",&n);
  arr=(int *)malloc(n*sizeof(int));
  for(i=0;i<n;i++)
  scanf("%d",&arr[i]);
  for(i=0;i<n-1;i++)
  {
  if(arr[i]!=arr[i+1])
  arr[j++]=arr[i];
  }
  arr[j++]=arr[n-1];
  for(i=0;i<j;i++)
  printf("%d ",arr[i]);

  }*/

main()
{
	int *arr,*temp,n,i,j;
	scanf("%d",&n);
	temp=(int *)malloc(n*sizeof(int));
	arr=(int *)malloc(n*sizeof(int));
	for(i=0;i<n;i++)
		scanf("%d",&arr[i]);
	for(i=0;i<n-1;i++)
	{
		if(arr[i]!=arr[i+1])
			temp[j++]=arr[i];
	}
	temp[j++]=arr[n-1];
	for(i=0;i<j;i++)				
		printf("%d ",temp[i]);
}
