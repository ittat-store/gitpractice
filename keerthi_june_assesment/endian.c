#include<stdio.h>
int main()
{
	short int v=1;
	short int *p=&v;
	if(*p==1)
		printf("little endian\n");
	else
		printf("big endian\n");
	return 0;
}
