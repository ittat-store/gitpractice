#include<stdio.h>
#include<stdlib.h>
main()
{
int arr[10],i,size;
//arr=(int * )calloc(10,1);
size=sizeof(arr)/sizeof(arr[0]);
printf("%d\n",size);
for(i=0;i<size;i++)
scanf("%d ",&arr[i]);
for(i=0;i<size;i++)
printf("%d ",arr[i]);

int temp;
/*temp=arr[0];
for(i=0;i<size-1;i++)
arr[i]=arr[i+1];
arr[i]=temp;
printf("\n");
for(i=0;i<size;i++)
printf("%d ",arr[i]);
*/

int last=arr[size-1];
for(i=size;i>0;i--)
arr[i]=arr[i-1];
arr[i]=last;
printf("\n");
for(i=0;i<size;i++)
printf("%d ",arr[i]);


}

