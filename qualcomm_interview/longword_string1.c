#include<stdio.h>
//#include<conio.h>

int main()
{
	char a[100];
	int i,max=0,pos=0,l=0;
	//clrscr();
	gets(a);
	for(i=0;a[i]!='\0';i++)
	{

		if(l==max)
		{
			pos=i-max;
		}

		if(a[i]==' ')
		{
			l=0;
		}
		else
		{
			l++;
		}
		if(l>max)
		{
			max=l;
		}
	}
	printf("%d\n",max);
	for(i=1;i<=max;i++,pos++)
	{
		printf("%c",a[pos]);
	}
	//getch();
	return 0;
}

