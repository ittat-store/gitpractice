#include <stdio.h>
#include <stdlib.h>
#include<string.h>

int main()
{
    int num, *arr, i,*temp;
    scanf("%d", &num);
    arr = (int*) malloc(num * sizeof(int));
    int j=num-1;
    for(i = 0; i < num; i++) {
        scanf("%d", arr + i);
    }
   for(i=0;i<j;i++,j--)
   {
       temp=arr[i];
       arr[i]=arr[j];
       arr[j]=temp;
   }

    /* Write the logic to reverse the array. */

    for(i = 0; i < num; i++)
        printf("%d ", *(arr + i));
    return 0;
}

