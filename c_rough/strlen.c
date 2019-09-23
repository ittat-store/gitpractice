#include<stdio.h>
main()
{
char str[20];
int i;
gets(str);
while(str[i]!='\0')
{
i++;
}
printf("%d\n",i);
}
