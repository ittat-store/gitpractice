#include <stdio.h>
#include <stdlib.h>
int main()
{
    int num, *arr,*arr1, i,j,temp;
    scanf("%d", &num);
    arr = (int*) malloc(num * sizeof(int));
    arr1=(int*)  malloc(num*sizeof(int));
    for(i = 0; i < num; i++) {
        scanf("%d", arr + i);
    }
   

    /*logic to reverse the array.*/
    /*for(i=0,j=num-1;i<j;i++,j--)
    {
        temp=*(arr+i);
        *(arr+i)=*(arr+j);
        *(arr+j)=temp;
    }*/

    for(i = 0; i < num; i++)
        printf("%d ", *(arr + i));
   
     printf("\n");
     printf("reverse array is \n");
    for(i=0,j=num-1;j>=0;i++,j--)
    {
     *(arr1+i)=*(arr+j);
     printf("%d ",*(arr1+i));
    }

   return 0;

}

