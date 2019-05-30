#include<stdio.h>
#include<string.h>
/*char islower(char ch)
{
if(ch>='A' && ch<='Z')
ch='a'+(ch-'A');
return ch;
}
int mystrcmp(char buf[],char str[])
{
char ch;
int i=0;
while(islower(buf[i])==islower(str[i++]))
{
if(str[i]=='\0')
return 0;

}
return (islower(buf[i])-islower(str[i]));
}*/

main(int argc,char **argv)
{
FILE *fp;
char str[10];
char buf[10],ch;
int i=0,a,count=0;
fp=fopen(argv[1],"r");
printf("enter the string to be search in file");
scanf("%s",str);
while((ch=fgetc(fp))!=EOF)
{
if(ch==' ')
{
buf[i]='\0';
a=strcasecmp(str,buf);
if(a==0)
count++;
i=0;
}
buf[i]=ch;
i++;
}
printf("%d",count);
}


