#include<bits/stdc++.h>
using namespace std;
int main()
{
    int i,n,diff,min=1;
    cin>>n;
    int arr[n];
    for(i=0;i<n;i++)
        cin>>arr[i];
    sort(arr,arr+n);
    for(i=0;i<n;i++)
    {
        diff=abs(arr[i+1]-arr[i]);
        if(diff<min)
        {
            min=diff;
        }
    }
    for(i=0;i<n;i++)
    {
        if(min==abs(arr[i+1]-arr[i]))
        {
            cout<<arr[i]<<" ";
            cout<<arr[i+1]<<" ";
        }
    }
    return 0;
}
