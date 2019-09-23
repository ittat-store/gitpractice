#include<stdio.h>
main()
{
int temp;
int i,j;
char str[20];
gets(str);
for(i=0,j=strlen(str)-1;i<j;i++,j--)
{
temp=str[i];
str[i]=str[j];
str[j]=temp;
}
printf("%s\n",str);
}
