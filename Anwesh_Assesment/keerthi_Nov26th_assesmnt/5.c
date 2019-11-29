#include<bits/stdc++.h>
using namespace std;
#define N 2010
int ST[N][2],EN[N][2],a[N];
int main()
{
	int n;
	cin>>n;
	for(int i=1;i<=n;i++)
		cin>>a[i];
	int tot = 0;  //stores the number of subarray whose XOR is 1 in the initial configuration
	for(int i=1;i<=n;i++)
	{
		int x = 0;
		for(int j=i;j<=n;j++)
		{
			x ^= a[j];
			tot+=x;
			ST[i][x]++; //XOR of subarrays starting at i
			EN[j][x]++; //XOR of subarrays ending at j
		}
	}
	int ans = 0;
	for(int i=1;i<=n;i++)
	{
		int tempans = tot;
		if(a[i]==1) // if already 1, then it will be changed to 0
		{
			tempans-=EN[i-1][0];
			tempans-=ST[i+1][0];
			tempans-=EN[i-1][0] * ST[i+1][0];
			tempans-=EN[i-1][1]*ST[i+1][1];
			tempans--;
			tempans+=EN[i-1][1];
			tempans+=ST[i+1][1];
			tempans+=(EN[i-1][0] * ST[i+1][1]) + (EN[i-1][1] * ST[i+1][0]);
		}
		else
		{
			tempans-=EN[i-1][1];
			tempans-=ST[i+1][1];
			tempans-=(EN[i-1][0] * ST[i+1][1]);
			tempans-=(EN[i-1][1] * ST[i+1][0]);
			tempans+=EN[i-1][0];
			tempans+=ST[i+1][0];
			tempans+=(EN[i-1][0]*ST[i+1][0]) + (EN[i-1][1] * ST[i+1][1]);
			tempans++;
		}
		ans = max(ans, tempans);
	}
	cout<<ans<<endl;
	return 0;
}
