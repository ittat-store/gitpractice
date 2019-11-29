#include<stdio.h>
#include<string.h>
#include<stdlib.h>
int main()
{
	char arr[100];
	int count=0,count1=0,i;
	scanf("%s",arr);
	for(i=0;i<strlen(arr);i++)
	{
		if(arr[i]=='z' || arr[i]=='Z')
			count++;
		if(arr[i]=='o' || arr[i]=='O')
			count1++;
	}
	count*=2;
	if(count==count1)
		printf("YES\n");
	else
		printf("NO\n");


}
