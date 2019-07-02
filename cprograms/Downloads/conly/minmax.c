#include<stdio.h>
#include<stdlib.h>
#include<string.h>
int min;
int max;
void minmax(int arr_count,int *arr)
{
	int i=0;
	max=arr[0];
	min=arr[0];
	for(i=1;i<arr_count;i++)
	{
		if(max>arr[i])
			continue;
		else
			max=arr[i];
	}
	printf("%d\n",max);
	for(i=1;i<arr_count;i++)
	{
		if(min<arr[i])
			continue;
		else
			min=arr[i];
	}
	printf("%d\n",min);

}

void print(int arr_count,int *arr,int min,int max)
{
	int maxarray[4],minarray[4],maxsum=0,minsum=0,i,j,k,countmin=0,countmax=0,sum=0;

	for(i=0;i<arr_count;i++)
	{
		if(arr[i]==min)
		{
			if(countmin==0)
			{
			   countmin++;            
                  	}       
                        else
                        maxsum=maxsum+arr[i];
		}
		else
		{	
                maxsum=maxsum+arr[i];
		//printf("%d ",maxsum);
	        }
                //printf("\n");
        }
	  printf("%d\n",maxsum);

	for(i=0,j=0;(i<arr_count)&&(j<arr_count-1);i++)
	{
		if(arr[i]==max)
		{
			if(countmax==0)
			{
				countmax++;
			}
                        else
                        minarray[j++]=arr[i];
		}
		else
                      {
			minarray[j++]=arr[i];
		        //printf("%d ",minarray[j]);
	               }
                       //printf("\n");
        }
	  for(k=0;k<arr_count-1;k++)
	  minsum=minsum+minarray[k];
	  printf("%d\n",minsum);

}







int main()
{
	int arr[5],i;
	printf("enter array\n");
	for(i=0;i<5;i++)
	{
		scanf("%d",&arr[i]);
	}
	printf("array elements are\n");
	for(i=0;i<5;i++)
		printf("%d ",arr[i]);
	printf("\n");
	minmax(5,arr);
        printf("\n");
	print(5,arr,min,max);
	return 0;
}
