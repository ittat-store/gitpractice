/*#include<stdio.h>
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
}*/

main()
{
char *str=malloc(1024);
int i,j=0;
char *temp=malloc(sizeof(str));
gets(str);
printf("%s\n",str);
//for(i=strlen(str)-1;i>=0;i--)
//temp[j++]=str[i];
//printf("%s\n",temp);
for(i=0,j=strlen(str)-1;i<=j;i++,j--)
{
temp=str[i];
str[i]=str[j];
str[j]=temp;
}
printf("%s\n",str);
}



