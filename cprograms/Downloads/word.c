#include<stdio.h>
#include<string.h>
main(int argc,char *argv[])
{
	FILE *fp;
	int cmp;
	char *word=malloc(sizeof(word));
	int count=0;
	fp=fopen(argv[1],"r");
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
			printf("%s \n",word);
			count++;
			//printf("%d \n",count++);
		}
	}
	printf("%d \n",count);
}
