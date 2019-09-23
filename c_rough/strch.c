#include<stdio.h>
main()
{
int i;
char ch;
char str1[20];
gets(str1);
scanf("%c",&ch);
for(i=0;i<strlen(str1);i++)
{
if(str1[i]==ch)
printf("at index %d \n",i);
}
printf("%s\n",str1+i);
}

