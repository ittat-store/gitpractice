/*
Input :
enter the string
a15c9b6a3
Output :
final string
a18b6c9
*/

#include<stdio.h>
#include<string.h>
int main()
{
	char a[100];
	char b[100];
	printf("enter the string\n");
	scanf("%s",a);
	int i,j,k=0,sum = 0,count = 0,sum1 = 0;
	int len = strlen(a);
	char ch,ch1;
	for(i=0;i<len;i++)
	{
		if(a[i]>='a' && a[i]<='z')
		{
			ch = a[i];
			count++;
			if(count>1)
			{
				while(sum)
				{
					b[k++] = ch1;
					sum--;
				}
			}
		}
		else
		{
			ch1 = ch;
			sum = sum*10 + a[i] - '0';
			sum1 = sum;
		}
	}

	while(sum1)
	{
		b[k++] = ch;
		sum1--;
	}
	b[k++] = '\0';
	printf("compress the string\n");
	printf("%s\n",b);
	int len1 = strlen(b);
	char temp,count1 = 0;
	for(i=0;i<len1;i++)
	{
		for(j=i+1;j<len1;j++)
		{
			if(b[i] > b[j])
			{
				temp = b[i];
				b[i] = b[j];
				b[j] = temp;
			}
		}
	}
	printf("sorting the string\n");
	printf("%s\n",b);
	printf("final string\n");
	for(i=0;i<len1;i++)
	{
		for(j=i;j<len1;j++)
		{
			if(b[i] == b[j])
			{
				ch = b[i];
				count1++;
			}
		}
		printf("%c",ch);
		printf("%d",count1);
		i = i+count1-1;
//		i = count1-1;
		count1 = 0;
	}
printf("\n");
}

