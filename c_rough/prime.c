#include<stdio.h>
#include<math.h>
 int count=0;
void prime(int n)
{
int i;
for(i=2;i<=sqrt(n);i++)
if(n%2==0)
break;
if(i>sqrt(n))
{
printf("prime number is %d\n",n);
count++;
printf("count is %d\n",count);
}
else
;
//printf("not a prime number %d\n",n);
}


main()
{
int i;
for(i=2;count!=10;i++)
prime(i);
}

