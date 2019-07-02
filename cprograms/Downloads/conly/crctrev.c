#include<stdio.h>
#include<string.h>
#include<stdlib.h>
char *strrev(const char *str)
{
	int i,j=0;
	char *buf;
	buf=(char *)malloc(strlen(str)*sizeof(char));
	memset(buf,'\0',strlen(str)*sizeof(char));
	for(i=strlen(str)-1;i>=0;i--,j++)
	{
		buf[j]=str[i];
	}
	return buf;
}
main()
{
	char *str=malloc(sizeof(str));
	char c;
	char *rev;
	int i;
	printf("enter string");
	/*str = (char*)malloc(1*sizeof(char));
	  while(c = getc(stdin),c!='\n')
	  {
	  str[i] = c;
	  i++;
	  realloc(str,i*sizeof(char));
	  }
	  str[i] = '\0';*/
	//printf("%s",str);
	//str=(char *)malloc(40*sizeof(char));
	//printf("enter string \n");
	gets(str);
	rev=strrev(str);
	printf("%s",rev);
}
