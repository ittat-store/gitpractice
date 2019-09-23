#include<stdio.h>
main()
{
int i,v=0,out[32];
while(v<=127)
{
for(i=0;i<=8;i++)
{
out[i]=v&(1<<i);
}
for(i=0;i<8;i++)
printf(" %d , %c ,%d \n",v,v,out[i]);
v++;
}
}

/*main()
{
int bit;
int num=5,i,out[32];
bit=sizeof(int)*8-1;
for(i=0;i<=bit;i++)
{
//printf("%d ",(num>>i)&1);
out[i]=(num>>i)&1;
printf("%d",out[i]);
}
}*/
