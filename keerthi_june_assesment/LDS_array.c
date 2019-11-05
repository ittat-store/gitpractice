#include<stdio.h>
#include<stdlib.h>

int Lds(int arr[],int n)
{
        int lds[n];
        int i,j,max=0;
        for(i=0;i<n;i++)
                lds[i]=1;
        for(i=1;i<n;i++)
                for(j=0;j<i;j++)
                        if(arr[i]<arr[j] && lds[i]<lds[j]+1)
                                lds[i]=lds[j]+1;
        for(i=0;i<n;i++)
                if(max<lds[i])
                        max=lds[i];

        return max;
}


int main()
{
        int ret;
        //int arr[]={5,8,10,11,30,34};
        int arr[]={3,4,7,8,6};
        int n=sizeof(arr)/sizeof(arr[0]);
        ret=Lds(arr,n);
        printf("%d\n",ret);
}              
