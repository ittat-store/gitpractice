#include<stdio.h>

int strcmp(char str1[],char str2[]);
main()
{
	char str1[20],str2[20];
	int i,out;
	gets(str1);
	gets(str2);
	out=strcmp(str1,str2);
	if(out==0)
		printf("equal\n");
	else
		printf("not equal %d\n",out);
}

int strcmp(char str1[],char str2[])
{
	int i;
	for(i=0;str1[i]&&str2[i];i++)
		if(str1[i]!=(str2[i]^32))
			break;
	if ((str1[i]&&str2[i])==0)
		return 0;
	else 
		return (str1[i]-str2[i]);
}
