#include<stdio.h>
int main()
{
int  n;
printf("enter num\n");
scanf("%x",&n);
n=(((n<<8)&0x00ff0000)|((n<<24)&0xff000000)|((n>>8)&0x0000ff00)|((n>>24)&0x000000ff));
	printf("%x\n",n);
return 0;
}

