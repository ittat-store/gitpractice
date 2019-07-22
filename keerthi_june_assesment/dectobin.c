#include<stdio.h>
main()
{
int num[10],i,temp;
printf("enter bin\n");
scanf("%d",&num);
for(i=7;i>=0;i--)
{
if(num[i]==0)
temp=temp<<1;
else
temp=temp<<1+1;
}
//r(i=7;i>=0;i--)
printf("%d ",temp);
}
