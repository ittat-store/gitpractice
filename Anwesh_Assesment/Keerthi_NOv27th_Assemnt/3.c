#include <stdio.h>
 
int main()
{
    int t,a[100000],i,min,n;
    scanf("%d",&t);
    while(t--)
    {    min=1000000000;
        int cnt=0;
        scanf("%d",&n);
        
        for(i=0;i<n;i++)
       { scanf("%d",&a[i]);
          if(a[i]<=min)
           min=a[i];
       }
       for(i=0;i<n;i++)
        if(a[i]==min)
         cnt++;
         
        if(cnt%2==0)
        printf("Unlucky\n");
        
        else
        printf("Lucky\n");
    }
    return 0;
}

