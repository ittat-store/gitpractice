#include<stdio.h>
int main()
{
	int temp,i,j;
	char str[100];
	printf("enter string\n");
	//scanf("%s",str);
	gets(str);
	int l;
	l=strlen(str);
	for(i=0;i<l;i++)
	{
		for(j=i+1;j<l;j++)
		{
			if(str[i]>str[j])
			{
				temp=str[i];
				str[i]=str[j];
				str[j]=temp;
			}
		}
	}
	//for(i=0;i<l;i++)
	printf("%s",str);
}

