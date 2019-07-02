#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>
#include<string.h>

int mystrcasecmp(char temp[],char str[])
{
	int i=0,j=0,a;
	while(str[j]!='\0' && temp[i]!='\0')
	{
		if(temp[i]==str[i] || temp[i]+32==str[j] || str[j]+32==temp[i])
			a=0;
		else
			a=1;
		i++;
		j++;
	}
	return a;
}		


sigset_t set;
FILE *fp;
char arg[10],arg1[10],buf[20];
pthread_t t1,t2;
void my_handler(int sig)
{
}

void *stringoper()
{
	int sig;
	int i,a,o=0,j;
	char buf1[10];

	sleep(1);	
	signal(SIGUSR1,my_handler);
	sigwait(&set,&sig);

	while(feof(fp)==0)
	{
		a=strlen(buf);
		i=mystrcasecmp(buf,arg1);

		if(i==0)
		{



			for(j=a-1,o=0;j>=0;j--)
			{
				buf1[o]=buf[j];
				o++;
			}
			buf1[o]='\0';
			printf("%s\n",buf1);
			fseek( fp, -strlen(buf1), 1);
			fprintf(fp,buf1);
			memset(buf1,'\0',strlen(buf1));
			memset(buf,'\0',strlen(buf));
		}

		else
			printf("strings are not equal\n");




		pthread_kill(t1,SIGUSR2);


		sigwait(&set,&sig);
	}
	printf("thread2 ready for exit\n");

	pthread_exit(0);
}


void *openfile()
{
	int sig;
	sleep(1);
	signal(SIGUSR2,my_handler);	
	fp=fopen(arg,"r+");


	while((fscanf(fp,"%s",buf))!=EOF)
	{

		printf("%s\n",buf);

		pthread_kill(t2,SIGUSR1);

		sigwait(&set,&sig);


	}
	printf("thread1 ready for exit\n");
	pthread_kill(t2,SIGUSR1);
	pthread_exit(0);
}
int main(int argc, char **argv)
{

	int s;
	strcpy(arg,argv[1]);
	strcpy(arg1,argv[2]);

	sigemptyset(&set);
	sigaddset(&set, SIGUSR1);
	sigaddset(&set,SIGUSR2);
	sigprocmask(SIG_SETMASK, &set, NULL);

	s=pthread_create(&t1,NULL,&openfile,NULL);
	if(s!=0)
		printf("thred1 not created");
	else
		printf("thread1 created");


	s=pthread_create(&t2,NULL,&stringoper,NULL);
	if(s!=0)
		printf("thread 2 not created");
	else
		printf("thread2 created");
	pthread_join(t1,NULL);
	pthread_join(t2,NULL);
	//	fclose(fp);
	//	pthread_exit(0);
}
