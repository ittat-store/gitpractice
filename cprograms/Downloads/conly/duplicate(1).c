#include<stdio.h>
#include<string.h>
main()
{
char str[100];
int i,j;
printf("enter string");
gets(str);
char *buf=malloc(sizeof(str));
char *t=malloc(sizeof(buf));
strcpy(buf,str);
printf("%s \n",buf);
for(i=0;i<strlen(buf);i++)
{
for(j=i+1;buf[j]!=0;j++)
{
if(buf[i]==buf[j])
memmove(buf+i,buf+i+1,strlen(buf+i+1)+1);
}
}
printf("after removing duplicate");
printf("%s",buf);
for(i=0,j=strlen(buf)-1;i<=j;i++,j--)
{
t=buf[i];
buf[i]=buf[j];
buf[j]=t;
}
printf("after reversing");
printf("%s",buf);
}
