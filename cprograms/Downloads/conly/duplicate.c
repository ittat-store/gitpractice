#include<stdio.h>
#include<string.h>
main()
{
	char *str=malloc(sizeof(str));
	int i,j;
	printf("enter string");
	gets(str);
	char *buf=malloc(sizeof(str));
	char *t=malloc(sizeof(buf));
	strcpy(buf,str);
	printf("%s \n",buf);
	for(i=0;i<strlen(buf);i++)
	//for(i=0;buf[i]!='\0';i++)
	{
		for(j=i+1;buf[j]!=0;j++)
		{
			if(buf[i]==buf[j])
			{
				memmove(buf+j,buf+j+1,strlen(buf+j+1)+1);
				j--;
			}
		}
	}
	printf("after removing duplicate\n");
	printf("%s\n",buf);
	for(i=strlen(buf)-1,j=0;i>=0;i--,j++)
	{
	t[j]=buf[i];
	}
	printf("after reversing\n");
	printf("%s",t);
}
