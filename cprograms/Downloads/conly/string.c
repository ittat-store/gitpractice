#include<stdio.h>
#include<string.h>
main()
{
int i;
char a[10];
printf("enter string");
gets(a);
for(i=strlen(a)-1;i>=0;i--)
{
printf("%c",a[i]);
}
}
