#include<stdio.h>
#include<string.h>
char stack[100];
static int i=0;
int mystringcmp(char string[],char str[])
{
	int i,j;
	char temp;
	int k=strlen(string);
	char buf[k];
	strcpy(buf,string);
	for(i=0,j=strlen(buf)-1;i<j;i++,j--)
	{
		temp=buf[i];
		buf[i]=buf[j];
		buf[j]=temp;
	}
	if(strcmp(buf,str)==0)
		return 1;
	else
		return 0;
}

void push(char ch)
{
	stack[i++]=ch;
}
char pop(char stack[])
{
	char ch;
	ch=stack[--i];
	return ch;
}
int mystack(char *str,char *str1)
{
	int a=strlen(str1),b=0,j=0,c;
	char string[a],ch;

	while(*str!='\0')
	{
		push(*str);
		str++;
	}
	while(i>=0)
	{
		//ch=pop(stack);
		if(b<a)
		{
                        ch=pop(stack);
			string[b++]=ch;
		}
		else
		{
			c=mystringcmp(string,str1);
			if(c==1)
				return 1;
			else 
			{
				j=0;
				while(string[j]!='\0')
				{
					string[j]=string[j+1];
					j++;

				}
				b=j-1;

			}

		}
	}
	//		printf("%s",string);
	return 0;
}
int main()
{
	char str[10],str1[10];
	int a;
	printf("enter the string");
	gets(str);
	printf("enter the sub string");
	scanf("%s",&str1);
	a=mystack(str,str1);
	if(a==1)
		printf("sub string is present in main string");
	else
		printf("sub string is not present in main string");
}
