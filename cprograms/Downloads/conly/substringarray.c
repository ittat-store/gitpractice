#include<stdio.h>
#include<string.h>
char *mystrstr(char str[],char str1[]);
void replace(char str[],char str1[],char *p);
int main()
{
	char str[20],str1[10],*p;
	printf("enter the strings");
	gets(str);
	scanf("%s",str1);
	p=mystrstr(str,str1);
	//	printf("%s",p);
	replace(str,str1,p);
}
char *mystrstr(char str[],char str1[])
{
	int i=strlen(str)-1,j=0;
	char *p;
	while(i>=0)
	{
		if(str[i]==str1[j])
		{
			p=&str[i];
			while(str[i]==str1[j])
			{


				i++;
				j++;
				if(str1[j]=='\0')
				{
					return p;
				}


			}
		}
		else
			i--;
	}
	return 0;
}
void replace(char str[],char str1[],char *p)
{
	int i=0,j=strlen(str1)-1,a;
	a=strlen(str1);
	while(str[i]!='\0')
	{
		if(&str[i]==p)
		{
			while(j>=0)
			{
				str[i]=str1[j];
				i++;
				j--;
			}
		}
		else
			i++;
	}
	printf("%s",str);
}
