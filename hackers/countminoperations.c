#include<stdio.h>
#include<stdlib.h>
int isprime(int num)
{
	int i,count=0;
	for(i=1;i<=num;i++)
	{
		if(num%i==0)
			count++;
	}
	if(count<=2)
		return 0;
	else
		return 1;
}
int countzero(int num)
{
int count=0,j,k,min=0;
if(num==0)
return 0;
num--;
count++;
while(num!=0)
        {
                if(isprime(num)==0)
                {
                        count++;
                        num--;
                }
                else
                {
                        j=2;
                        while((j<num))
                        {
                                if(num%j==0)
                                {
                                        k=num/j;
                                        if(j<=k)
                                                min=k;
                                        j++;
                                }
                                else
                                        j++;
                        }
                        num=min;
                        count++;
                }

        }
return count;


}
int main()
{
	int num,count=0,min=0,k,j=2,a,count1=0;
	printf("enter the number");
	scanf("%d",&num);
a=num;
	while(num!=0)
	{
		if(isprime(num)==0)
		{
			count++;
			num--;
		}
		else
		{
			j=2;
			while((j<num))
			{
				if(num%j==0)
				{
					k=num/j;
					if(j<=k)
						min=k;
					j++;
				}
				else
					j++;
			}
			num=min;
			count++;
		}

	}
count1=countzero(a);
if(count<=count1)
	printf("%d",count);
else
printf("%d",count1);
}
