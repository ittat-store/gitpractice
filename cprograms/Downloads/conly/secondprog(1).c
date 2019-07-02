#include<stdio.h>
#include<string.h>
#include<stdlib.h>
main()
{
char *str,c;
int i=0,a,j,b,d;

str = (char*)malloc(1*sizeof(char));

while(c = getc(stdin),c!='\n')
{
str[i] = c;
i++;
realloc(str,i*sizeof(char));
}
str[i] = '\0';

a=strlen(str);
for(i=0;i<a;i++)
{
for(j=i+1;j<a;j++)
{
if(str[i]==str[j])
{
while(j!=a)
{
str[j]=str[j+1];
j++;
}
j--;
}
}
}
//printf("%s",str);
d=strlen(str);

//printf("%d",d);
for(i=0,j=d-1;i<j;j--,i++)
{
b=str[i];
str[i]=str[j];
str[j]=b;
}
printf("%s",str);

}

