#include<stdio.h>
#include<string.h>
#include<stdlib.h>
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

char *reverse(const char *sub)
{
int i,j=0;
char *buf=(char *)malloc(strlen(sub)*sizeof(char));
for(i=strlen(sub)-1;i>=0;i--,j++)
{
buf[j]=sub[i];
}
printf("%s\n",buf);
return buf;
}	


        void main()
	{
		char str[50],sub[50];
		int *ptr,*q;
                char *rev;
		printf("enter string\n");
		gets(str);
		printf("enter substring\n");
		gets(sub);
                ptr=str;
                q=str;
                //printf("%s\n",ptr);
		while(ptr=substring(ptr,sub))
                {
                        q=ptr;
                        ptr++;
                printf("%s\n",q);
                rev=reverse(sub);
                printf("%s\n",rev);
                strncpy(q,rev,strlen(rev));
                printf("%s\n",str);
                }
		return 0;
	}

