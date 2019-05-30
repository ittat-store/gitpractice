#include<stdio.h>
#include<string.h>
#include<stdlib.h>
char *reverse(const char*);
main()

{
	char *str=malloc(sizeof(str)),*c;
	printf("enter the string");
	gets(str);
	reverse(str);
	//printf("%s",c);
}
char *reverse(const char* str)
{
	char *buf,t;
	int i,j,k;
	buf=malloc(sizeof(char)*strlen(str));
	memcpy(buf,str,sizeof(char)*strlen(str));
	//remove duplicate characters
	printf("%s\n",buf);
	for(i=0;i<strlen(buf);i++)
	{
		for(j=i+1;j<strlen(buf);j++)
		{
			if(buf[i]==buf[j])
			{
				k=j;
				  while(k<strlen(buf))
				  {
				  buf[k]=buf[k+1];
				  k++;
				  }
				  buf[k]='\0';
				//memmove(buf+j,buf+j+1,strlen(buf+j+1)+1);
				j--;
			}
		}
	}
	printf("%s\n",buf);
	//reverse of str
	for(i=0,j=strlen(buf)-1;i<j;i++,j--)
	{
		t=buf[i];
		buf[i]=buf[j];
		buf[j]=t;
	}
	printf("%s\n",buf);
}
