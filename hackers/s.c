#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>
int main() {

	/* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
	char c;
	char str[30]={0};
	int a,count=0,i,j;
	int num;
	printf("enter the string");
	scanf("%s",str);
	a=strlen(str);
	for(i=0;i<=9;i++)
	{
		count=0;
		for(j=0;j<a;j++)
		{
			c=str[j];
if(c>=48 &&c<=57)


{
		//	num=atoi(&c);
num=c-48;
			printf("num=%d",num);			
			if(num==i)
			{

				count++;
			}

		}
}
		printf("%d",count);
	}
	return 0;
}

