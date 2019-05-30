#include <math.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <assert.h>
#include <limits.h>
#include <stdbool.h>

int main(){
    int t,k=1;
    long long int a[10001];
    scanf("%d",&t);
    for(long int i=2;i<100;i++)
    {
        int count=0;
        for(long int j=1;j<=i;j++)
        {
            if(i%j==0)
                count++;
        }
        if(count==2)
        {
            a[k]=i;
            k++;
        }
        
        
    }
    for(int a0 = 0; a0 < t; a0++){
        int n;
printf("enter the n"); 
        scanf("%d",&n);
        printf("%lld\n",a[n]);
    }
    return 0;
}
