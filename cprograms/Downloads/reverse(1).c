#include<stdio.h>
#include<string.h>
void myreverse(char str[],int);
main()
{
char *str,c;
int a,i=0,j,b;
//printf("enter the string");
//gets(str);
str = (char*)malloc(1*sizeof(char));

while(c = getc(stdin),c!='\n')
{
str[i] = c;
i++;
realloc(str,i*sizeof(char));
}
str[i] = '\0';
printf("%s",str);

a=strlen(str);
for(i=0,j=a-1;i<j;j--,i++)
{
b=str[i];
str[i]=str[j];
str[j]=b;
}
printf("%s",str);
}

