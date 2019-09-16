#include<stdio.h>
main()
{
//char *t tr="keerthi";
//ptr[1]='t';
//printf("%s",*ptr);
char const volatile str[] = "hello";
str[0] = 'm';
printf("%s ", str); //mello

}
