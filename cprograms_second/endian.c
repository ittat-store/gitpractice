#include<stdio.h>
#include<stdlib.h>
int main()
{
short int a=5
printf("%hd\n",a);
char *p=&a;
char temp;
printf("%hd,%hd\n",*p,*(p+1));
temp=*p;
*p=*(p+1);
*(p+1)=temp;
printf("%hd,%hd\n",*p,*(p+1));


//printf("%hd\n",a);

return 0
}

