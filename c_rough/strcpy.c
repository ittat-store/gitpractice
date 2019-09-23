#include<stdio.h>
main()
{
int i=0;
char *str1=malloc(20);
char str2[20];
gets(str1);
gets(str2);
while((str1[i]=str2[i])!=0)
i++;
printf("%s\n",str1);
}
