#include<stdio.h>
#include<string.h>
char islower(char ch)
{
	if(ch>='A' && ch<='Z')
		ch=ch+32;
	return ch;
}
int mystrcmp(char buf[],char str[])
{

	int i=0;
	while(islower(buf[i])==islower(str[i++]))
	{
		if(str[i]=='\0')
			return 0;

	}
	return (islower(buf[i])-islower(str[i]));
}

main(int argc,char **argv)
{
	FILE *fp;
	char str[10];
	char buf[10],ch;
	int i=0,a,count=0;
	fp=fopen(argv[1],"r");
	printf("enter the string to be search in file");
	scanf("%s",str);
	while(fscanf(fp,"%s",buf)!=EOF)
	{

		a=mystrcmp(buf,str);
		if(a==0)
			count++;



	}
	printf("%d",count);
}


