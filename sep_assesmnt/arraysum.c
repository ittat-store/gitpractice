#include <stdio.h>
#include <stdlib.h>
#include<string.h>

int main()
{
    int num, *arr, i,*temp;
    int sum=0;
    scanf("%d", &num);
    arr = (int*) malloc(num * sizeof(int));
    int j=num-1;
    for(i = 0; i < num; i++) {
        scanf("%d", arr + i);
    }
   for(i=0;i<num;i++)
   {
    sum=sum+*(arr+i);
   }

    /* Write the logic to reverse the array. */
  printf("%d\n",sum);
    return 0;
}

