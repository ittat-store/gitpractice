#include<stdio.h>
int  recur(int num)
{
	if(num>100)
		return 0;
	printf("num is %d\n",num);
	recur(++num);
}


int main()
{
	int a=1;
	recur(a);
	printf("printing 1 to 100 is completed\n");
	return 0;
}

