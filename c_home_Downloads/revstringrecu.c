#include<stdio.h>
char* rev(char *str)
{
char buf[20];
int i=0;
if(*str=='\0')
return ;
else
rev(str+1);
printf("%c",*str);
buf[i++]=*str;
//return buf;
}

main()
{
char str[20],out;
gets(str);
rev(str);
//printf("%s\n",out);
}

