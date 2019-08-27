#include<stdio.h>
#include<string.h>
#include<stdlib.h>
void call();
char *substring(char str[],char sub[])
{
	int i,j;
	for(i=0;str[i];i++)
	{
                if(str[i]==sub[0])
                {
		for(j=0;sub[j];j++)
		{
			if(str[i+j]==sub[j])
				continue;
			else
				break;
		}
        
		if(sub[j]=='\0')          
                return str+i;
}
}
}
	
        void main()
	{
                int cases,values=0;
                printf("enter test cases\n");
                scanf("%d",&cases);
                while(values<=cases)
                {
                values++;
                call();
                }
         }


void call()
{                

               char str[50],sub[50];
                int *ptr,*q;
                int YES=0,count=0,tab=0;
		printf("enter string\n");
		gets(str);
		printf("enter substring\n");
		gets(sub);
                ptr=str;
                q=str;
                //printf("%s\n",ptr);
		while(ptr=substring(ptr,sub))
                {
                       if(ptr)
                       {
                        q=ptr;
                        ptr++;
                        YES=1;
                        count++;
                        if(count==1)
                        printf("YES\n");
                        else
                           ;
                       }
                 else
                   ptr++;
                }
                if(YES==0)
                printf("No\n");
		return 0;
	}
