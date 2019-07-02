#include<stdio.h>
#include<string.h>

char *strrev(const char *str)
{
	int i,j=0;
	char *buf;
	buf=(char *)malloc(strlen(str)*sizeof(char));
	memset(buf,'\0',strlen(str)*sizeof(char));
	for(i=strlen(str)-1;i>=0;i--,j++)
	{
		buf[j]=str[i];
	}
	return buf;
}

main(int argc,char *argv[])
{
	FILE *fp;
        int a;
	char *rev;
	char *change=malloc(100);
	int cmp,i;
	char *word=malloc(100);
	int count=0;
	fp=fopen(argv[1],"r+");
	if(fp<=0)
	{
		printf("eroor \n");
	}
	while(fscanf(fp,"%s",word)!=EOF)
	{
		//printf("%s \n",word);
		cmp=strcasecmp(word,argv[2]);
		if(cmp==0)
		{
                        //a=ftell(fp);
                        //printf("%d \n",a);
			printf("%s \n",word);
			printf("%d \n",strlen(word));
                        a=strlen(word);
			for(i=0;i<=strlen(word);i++)
			{
				change[i]=word[i]^32;
			}
			//printf("%s\n",change);
			rev=strrev(change);
			printf("%s \n",rev);
			fseek(fp,-a,1);
			fputs(rev,fp);
		}
                
		//count++;
		//printf("%d \n",count++);
	}                         
}


