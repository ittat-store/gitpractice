#include<stdio.h>
#include<string.h>
main(int argc,char *argv[])
{
	FILE *fp;
        char *temp=NULL;
	int cmp,out,cnt=0;
	char *word=malloc(sizeof(word));
	int count=0;
	fp=fopen(argv[1],"r");
	if(fp<=0)
	{
		printf("eroor \n");
	}
	while(fscanf(fp,"%s",word)!=EOF)
	{
               out=strcmp(argv[3],"-i");
               if(out==0)
               {
		//printf("%s \n",word);
		cmp=strcasecmp(word,argv[2]);
		if(cmp==0)
		{
			printf("%s \n",word);
		//	count++;
		//	printf("%d \n",count++);
		}
                }
         }
             
            out=strcmp(argv[3],"-n");
             if(out==0)
             {
		printf("di");
             while(fgets(temp,80,fp))
             {
              cnt++;
		printf("%d",cnt);
             if(strstr(temp,argv[2]))
             printf("%d",cnt);         
              }
                        
}
}
