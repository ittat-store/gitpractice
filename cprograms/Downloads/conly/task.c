#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<pthread.h>
#include<signal.h>
#include<unistd.h>

void *thread2(void *arg);
void catch(int sig)
{

}

pthread_t tid1,tid2,b;
FILE *fp=NULL;
FILE *fd=NULL;



char str[100];
char buf1[100],buf2[20];


void *thread1(void *arg)
{       int sig;
	sigset_t signals;
	sigemptyset(&signals);
	sigaddset(&signals,SIGUSR1);
	sigprocmask(SIG_BLOCK,&signals,NULL);
	int m,i,l,n=0;

	fp=fopen(str,"r");
	if(fp==NULL)
	{
		printf("fp is empty\n");

	}

	sigwait(&signals,&sig);
	while((fscanf(fp,"%s",buf1))!=EOF)
	{

		printf("---in t1%s\n",buf1);
		pthread_kill(tid2,SIGUSR1);
		sigwait(&signals,&sig);

	}
	if(tid2)
		pthread_kill(tid2,SIGUSR1);
	else		
		printf("thread1 is not there");
	pthread_exit(0);
}


void *thread2(void *arg)
{	
	int sig;
	sigset_t signals;
	sigemptyset(&signals);

	sigaddset(&signals,SIGUSR1);

	sigprocmask(SIG_BLOCK,&signals,NULL);

	fp=fopen(str,"r");
	if(fp==NULL)
		printf("fp is empty");
	else
		printf("fp is open");

	sigwait(&signals,&sig);
	while(((fscanf(fp,"%s",buf2))!=EOF)&&(tid2))
	{
		printf("----in t2%s\n",buf2);                                                              
		pthread_kill(b,SIGUSR1);
		sigwait(&signals,&sig);
	}

	if(b)
		pthread_kill(b,SIGUSR1);
	else
		printf("thread1 is not there");
		

	pthread_exit(0);
}



int main(int argc,char *argv[])

{	
	if(argc!=3)
		printf("input invalid"); 
b=pthread_self();

	sigset_t signal;
	sigemptyset(&signal);
	sigaddset(&signal,SIGUSR1);

	sigprocmask(SIG_BLOCK,&signal,NULL);

	int sig;
	//if(argc!=3)
	//	printf("input in valid"); 

	int err1,err2;

	strcpy(str,argv[1]);
	err1=pthread_create(&tid1,NULL,&thread1,NULL);
	if(err1!=0)
		printf("error");
	else
		printf("thread1 created successfully\n");
	err2=pthread_create(&tid2,NULL,&thread2,NULL);
	if(err2!=0)
		printf("error");
	else
		printf("thread2 created successfully\n");
	fd=fopen(argv[2],"w");
	if(fd==NULL)
		printf("fd is empty");
	else
	{	

		printf("fd is opened");
	}
	if(tid1)
		pthread_kill(tid1,SIGUSR1);
	else
		printf("thread1 is not there");
	sigwait(&signal,&sig);
	while(!feof(fp))
	{	
		puts("-----in main\n");
		fprintf(fd,"%s",buf1);
		fprintf(fd,"%s"," ");
		memset(buf1,'\0',strlen(buf1));
		fprintf(fd,"%s",buf2);
		fprintf(fd,"%s"," ");
		memset(buf2,'\0',strlen(buf2));

		pthread_kill(tid1,SIGUSR1);
		sigwait(&signal,&sig);
	}
	fclose(fd);
	fclose(fp);
	return 0;

}
