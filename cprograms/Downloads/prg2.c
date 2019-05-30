#include<stdio.h>
#include<string.h>
#include<stdlib.h>
int main()
{
	char *ptr,*ptr1,*ptr2;
	int i,j=0;
	printf("enter the ptr");
	ptr=malloc(30*sizeof(char));
	gets(ptr);
	ptr1=malloc(strlen(ptr)*sizeof(char));
	ptr2=malloc(strlen(ptr)*sizeof(char));
	printf("original ptr:%s\n",ptr);
	strcpy(ptr1,ptr);
	for(i=0;ptr1[i];i++)
	{	for(j=i+1;ptr1[j];j++)
		{
			if(ptr1[i]==ptr1[j])
			{
				memmove(ptr1+j,ptr1+j+1,strlen(ptr1));
				i--;
			}
		}
	}
	printf("ptr1:%s\n",ptr1);

	for(i=0;ptr1[i];i++);
	for(i--,j=0;ptr1[i];i--)
	{
		ptr2[j]=ptr1[i];
		j++;
	}

	printf("original ptr:%s\n",ptr);
	printf("ptr1:%s\n",ptr1);
	printf("ptr2:%s",ptr2);
	return 0;
}
