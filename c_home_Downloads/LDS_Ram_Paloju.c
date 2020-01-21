#include<stdio.h>
#include<stdlib.h>

int main()
{
  int *arr1,n,i;//[5]={1,2,3,4,5};
  printf("How many elements you want to put in an Array:");
  scanf("%d",&n);
  arr1=(int*)malloc(n*sizeof(int));

  printf("Enter the Array elements :");

  for(i=0;i<n;i++)
  {
   scanf("%d",&arr1[i]);
  }

/*  printf("You Entered Array is:");
  for(i=0;i<n;i++)
  {
   printf("%d ",arr1[i]);
  }
  printf("\n"); */

//******************************** 
//** Main program logic is here **
//********************************

int count,j=0,k=0,m=0,l=0,*arr2=(int*)malloc(0);
  for(i=0;;i++)
  {
    count=0;
  label:
    while(arr1[i]>arr1[i+1] && i<(n-1))
    {
     count++;
     arr2=(int*)realloc(arr2,sizeof(int));
     arr2[count-1]=arr1[i];
     i++;
    }
    
    if(count>k)
    {
     count++;
     k=count;
     arr2=(int*)realloc(arr2,sizeof(int));
     arr2[count-1]=arr1[i]; 
    }

    if(m==1)
    break;

    if(i==(n-1))
    { 
     l=0; m++;
     while(arr1[i]>arr1[l])
     {
      count++;
      arr2=(int*)realloc(arr2,sizeof(int));
      arr2[count-1]=arr1[i];
      i=l;
      goto label;
     }
    }
  }
 
//**************************
//** Printing the results **
//**************************

  printf("LDS is %d\n",k);
   for(i=0;i<k;i++)
  {
   printf("%d ",arr2[i]);
  }
  printf("\n");
}
