#include<stdio.h>
main()
{
int n,m,ans=0,count=0;
printf("enter n,m\n");
scanf("%d %d \n",&n,&m);
while(m)
{
if(m%2==1)
ans+=n<<count;
count++;
m/=2;
}
printf("answer is %d\n",ans);
}

