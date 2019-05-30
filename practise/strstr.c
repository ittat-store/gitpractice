#include<stdio.h>
#include<string.h>
char *mystrstr(char str[],char str1[]);
int main()
{
	char str[20],str1[10];
	printf("enetr teh string");
	gets(str);
	printf("enter the sub string");
	scanf("%s",str1);
	char *p=mystrstr(str,str1);
	printf("%s",p);
}
char *mystrstr(char str[],char str1[])
{
	int i=0,j;
	char *p;
	while(str[i]!='\0')
	{
		j=0;
		if(str[i]==str1[j])
		{
			p=&str[i];
			while(str[i]==str1[j])
			{
				i++;
				j++;
				if(str1[j]=='\0')
					return p;
			}
		}
		else 
			i++;
	}
	return 0;
}
