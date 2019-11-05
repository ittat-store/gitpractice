#include<stdio.h>
union
{
	int num;
	char c[sizeof(int)];//sizeof(int)];
}u;
int main()
{
	u.num=0x12345678;
	char t;
	int j;
	for(int i=0,j=sizeof(int)-1;i<j;i++,j--)
	{
		t=u.c[i];
		u.c[i]=u.c[j];
		u.c[j]=t;
	}

	/*	t=u.c[0];
		u.c[0]=u.c[3];
		u.c[3]=t;
		t=u.c[1];
		u.c[1]=u.c[2];
		u.c[2]=t;*/
	printf("%x",u.num);
}

