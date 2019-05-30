#include<stdio.h>
#include<stdlib.h>
#include<string.h>
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

int factor(int num,int i)
{
int j,k,min;
	if(num!=0)
	{
		if(isprime(num)==0)
		{
			a[++i]=1;
			factor(--num,i);
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
			a[++i]=num;
			factor(num,i);
		}

	}
}
int counttozero(int num)
{
	int i=0,b[num],count=0;
	while(i<num)
	{
		count=factor(a[i]-i,i);
		b[i]=count;
	}
}
int main()
{
	int num,*p,*p1,count=0;
	printf("enter the number");
	scanf("%d",&num);
	p=realloc(p1,sizeof(int)*num);
	memset(p,num,sizeof(int)*num);
	count=counttozero(num);
	printf("%d",count);
}
