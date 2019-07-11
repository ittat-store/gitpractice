#include<stdio.h>
#include<stdlib.h>
#define MAX 50
int binarsearch(int arr[],int size,int item)
{
int low=0,up=size-1,mid;
while(low<=up)
{
mid=(low+up)/2;
if(item>arr[mid])
low=mid+1;
else if(item<arr[mid])
up=mid-1;
else
return mid;
}
return -1;
}

int main()
{
int i,size,item,arr[MAX],index;
printf("enter elements size\n");
scanf("%d",&size);
printf("enter elem in sorted order\n");
for(i=0;i<size;i++)
scanf("%d",&arr[i]);
printf("enter search item\n");
scanf("%d",&item);
index=binarsearch(arr,size,item);
if(index==-1)
printf("not found\n");
else
printf("%d found at %d",item,index);
return 0;
}



