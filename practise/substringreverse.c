#include<stdio.h>
#include<string.h>
char *findsub(char *str,char *str1);
int main()
{
	char str[20],str1[10];
	char *p;
	printf("enter the main string");
	gets(str);
	printf("enter the sub string");
gets(str1);
//	scanf("%s",str1);
	//printf("%s %s",str,str1);
	p=findsub(str,str1);
	printf("%s",p);
}
char *findsub(char *str,char *str1)
{
	char *p;
	if(*str==*str1)
	{
		//printf("%c",*str);
		p=str;
		while(*str==*str1)
		{
			if(*str1=='\0')
				return p;
			str++;
			str1++;

		}
	}
	else
{
		str++;
}
//	return 0;
}
