#include<stdio.h>
#include<string.h>
#include<stdlib.h>
int main()
{
	char str[150],str1[52],c,*p,temp;
	int i=0,j=0;
	printf("enter the case sensitive string");
	scanf("%s",str);
	for(i=0;str[i]!='\0';i++)
	{
		if(i==0)
		{
			str1[j++]=str[i];
		}
		else
		{
			p=strchr(str1,str[i]);
			if(p==NULL)
			{
				str1[j++]=str[i];
			}
			else
				continue;
		}
	}
str1[j]='\0';
	for(i=strlen(str1)-1,j=0;i>j;i--,j++)
	{
		temp=str1[i];
		str1[i]=str1[j];
		str1[j]=temp;
	}
	printf("%s",str1);
}
