#include<stdio.h>
#include<string.h>
main()
{
int i;
char str[20];
char ch;
gets(str);
scanf("%c",&ch);
for(i=strlen(str)-1;i>=0;i++)
{
if(str[i]==ch)
{
printf("at index %d\n",i);
break;
}
}
printf("%s\n",str+i);
}
