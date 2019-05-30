#include<stdio.h>
#include<string.h>
void write(char buf[]);
int mystrcmp(char temp[],char str[]);
int wordcountfile();
void getword();
char buf[20],buf1[20];
FILE *fp1,*fp;
int main()
{
	fp=fopen("input.txt","r");
	fp1=fopen("output.txt","a+");
	if(fp==0)
	{
		printf("file not exist");
	}
	getword();
}
void getword()
{
	int count=0,a;
	while(fscanf(fp,"%s",buf)!=EOF)
	{
		rewind(fp1);
		count=0;
		while(fscanf(fp1,"%s",buf1)!=EOF)
		{
			a=mystrcmp(buf,buf1);
			if(a!=0)
			{
				count++;
			}
		}

		if(count==wordcountfile())
		{

			write(buf);
			memset(buf,'\0',strlen(buf));
		}

	}


}
void write(char buf[])
{
	int a=strlen(buf);
	fprintf(fp1,"%s",buf);
	fprintf(fp1,"%c",'\t');
	memset(buf,'\0',strlen(buf));
}

int mystrcmp(char temp[],char str[])
{
	int i=0,j=0,a;
	//	printf("%s %s\n",temp,str);
	//while(str[j]!='\0' && temp[i]!='\0')
	while(temp[i]!='\0')
	{
		if(temp[i]==str[j] || temp[i]+32==str[j] || str[j]+32==temp[i])
			a=0;
		else
		{
			a=1;
			break;
		}

		i++;
		j++;
	}
	//	printf("%d\n",a);
	return a;
}

int wordcountfile()
{
	FILE *fp2;
	char buf3[10];
	int count=0;
	fp2=fopen("output.txt","r");
	while(fscanf(fp2,"%s",buf3)!=EOF)
	{
		count++;
	}

	return count;
}
