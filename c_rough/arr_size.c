#include<stdio.h>

void fun(int a[])
{
	int size=sizeof(a)/4;
	int i;
	for(i=0;i<size;i++)
	{
		printf("%d\n",a[i]);
	}
}



main()
{
	int a[]={1,2,3,4,5};
	fun(a);
        int *p;
        printf("size of %d\n",sizeof(p));
}
