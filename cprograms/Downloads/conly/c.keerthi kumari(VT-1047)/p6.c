#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<pthread.h>
#include<signal.h>
#include<unistd.h>
int my_strcasecompare(char *str,char*s1)
{

	int l=strlen(str),i,j;
	int l1=strlen(s1);
	if(l==l1)
	{
		i=0,j=0;
		while(str[i]!='\0')
		{
			if((str[i]==s1[j])||(str[i]==s1[j]-32)||(str[i]==s1[j]+32))
			{
				i++;
				j++;
			}
			else
				break;
		}
		printf("%d\n",i);
		printf("%d\n",l);
		if(i==l)
		{
			printf("same\n");
			return 0;
		}
		else
		{
			printf("not same1\n");
			return 1;
		}
	}
	else
		printf("not same\n");
	return 1;
}

void *t2(void *arg);
void mm(int sig)
{
	printf("its working\n");
}

pthread_t th1,th2;
FILE *fp;

char str[100];
char m2[100],m3[20];
//thread 1
void *t1(void *arg)
{
	printf("thread 1\n");
	//	(void)signal(SIGUSR1,m);
	int m,i,l;
	fp=fopen(m2,"r+");
	if(fp==NULL)
	{
		printf("perror\n");
	
	}
	(void) signal(SIGUSR1,mm);

	while((fscanf(fp,"%s",str))!=EOF)
	{
		printf("%s\n",str);
		pthread_kill(th2,SIGUSR2);
		sleep(1);
		//(void)signal(SIGUSR2,m);	
	}
	printf("1 exit\n");
	pthread_exit(0);
}
//thread 2

void *t2(void *arg)
{
	//intf("thread 2\n");
	// (void) signal(SIGUSR2,mm);
	int j,i,l,m=0;
	char rev[100];
	 (void) signal(SIGUSR2,mm);
	//char str[10]="mouni";
	printf("thread 2\n");
	//strlen(str);
	//printf("%s,%s",str,m3);
	while(!feof(fp))
	{
	if(my_strcasecompare(str,m3)==0)
	{	//pritf("%s,%s",str,m3);
		for(i=strlen(str)-1,j=0;i>=0;i--,j++)
		{
			rev[j]=str[i];
		}
		rev[j]='\0';


		//rev=strrev(str);
		printf("%s",rev);                                                                                    
		fseek(fp,-strlen(str),SEEK_CUR);
		fputs(rev,fp);
		memset(str,'\0',strlen(str));
	}
		//printf("%d\n",m);

	pthread_kill(th1,SIGUSR2);
	}
	sleep(1);

	printf("2 exit\n");
	pthread_exit(0);
}



int main(int argc,char *argv[])
{
	//pthread_t th1,th2;
	int e1,e2;
	strcpy(m2,argv[1]);
	strcpy(m3,argv[2]);
	e1=pthread_create(&th1,NULL,&t1,NULL);
	if(e1!=0)
		printf("error");
	else
		printf("success\n");
	e2=pthread_create(&th2,NULL,&t2,NULL);
	if(e2!=0)
		printf("error");
	else
		printf("success\n");
	pthread_join(th1,NULL);
	pthread_join(th2,NULL);
	fclose(fp);
	return 0;

}
