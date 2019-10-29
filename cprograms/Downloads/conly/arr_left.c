#include<stdio.h>
main()
{
int arr[5];
int i,temp;
printf("enter the array elements\n");
for(i=0;i<5;i++)
scanf("%d",&arr[i]);
/*temp=arr[0];
for(i=0;i<4;i++)
arr[i]=arr[i+1];

arr[i]=temp;*/

temp=arr[4];
for(i=5;i>0;i--)
arr[i]=arr[i-1];

arr[i]=temp;

for(i=0;i<5;i++)
printf("%d ",arr[i]);
}

