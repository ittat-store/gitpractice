#include<stdio.h>
main()
{
int i=0,j=0;
char str1[20],str2[20];
gets(str1);
gets(str2);
while(str1[i]!='\0')
i++;
while((str1[i]=str2[j])!=0)
{
i++;
j++;
}
printf("%s\n",str1);
}
