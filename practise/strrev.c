#include<stdio.h>
#include<string.h>
main()
{
char *str=malloc(sizeof(str));
printf("enter the string");
gets(str);
printf("%s\n",str);
printf("%s",strrev(str));
}
