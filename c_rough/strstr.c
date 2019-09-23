#include<stdio.h>
char *strstr(char str1[],char str2[]);

main()
{
	int i,j;
	int *ptr,*q;
	char str1[20],str2[20];
	gets(str1);
	gets(str2);
	ptr=str1;
	while(ptr=strstr(ptr,str2))
	{
	q=ptr;
	ptr++;
	printf("%s\n",q);
	}
}


char *strstr(char str1[],char str2[])
{
	int i,j;
	for(i=0;str1[i];i++)
	{
		if(str1[i]==str2[0])
		{
			for(j=0;str2[j];j++)
			{
				if(str1[i+j]==str2[j])
					continue;
				else
					break;
			}

			if(str2[j]=='\0')
				return  str1+i;
		}
	}
}
