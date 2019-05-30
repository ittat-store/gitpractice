#include<stdio.h>
#include<pthread.h>
#include<string.h>
#include<signal.h>

//string comparision
char islower(char ch)
{
	if(ch>='A' && ch<='Z')
		ch=ch+32;
	return ch;
}
int mystrcasecmp(char buf[],char str[])
{

	int i=0;
	while(islower(buf[i])==islower(str[i++]))
	{
		if(str[i]=='\0')
			return 0;

	}
	return (islower(buf[i])-islower(str[i]));
}


sigset_t set;
pthread_t tid[2];
FILE *fp;
char arg[10],arg1[10],buf[10];
void my_handler()
{
//usleep(100);
}
void *stringoper(void)
{
	int sig;
	int i,a,o=0,j;
	char buf1[10];
	a=strlen(buf);
sleep(1);
        (void)signal(SIGUSR1,my_handler);


	i=mystrcasecmp(arg1,buf);
	if(i==0)
	{
		//	printf("strings are equal so replace the string in file by reverse order\n");


		for(j=a-1;j>=0;j--)
		{
			buf1[o]=buf[j];
			o++;
		}
		buf1[o]='\0';
		printf("%s\n",buf1);
		fseek( fp, -strlen(buf1), 1);
		fprintf(fp,buf1);
	}  

	else
		printf("strings are not equal\n");
	
	pthread_kill(tid[0],SIGUSR2);
	sigwait(&set,&sig);
}

void *openfile()
{

	char ch;
	int i=0,sig;
	sleep(1);
	(void)signal(SIGUSR2,my_handler);


	fp=fopen(arg,"r+");


	while((fscanf(fp,"%s",buf))!=EOF)
	{

		printf("%s\n",buf);
		pthread_kill(tid[1],SIGUSR1);
		sigwait(&set,&sig);

	}
	printf("thread1 ready for exit\n");
        pthread_kill(tid[2],SIGUSR1);
	pthread_exit(0);
}

main(int argc, char **argv)
{
	int s;
	strcpy(arg,argv[1]);
	strcpy(arg1,argv[2]);
	sigemptyset(&set);
	sigaddset(&set, SIGUSR1);
	sigaddset(&set,SIGUSR2);
 sigprocmask(SIG_SETMASK, &set, NULL);


	s=pthread_create(&tid[0],NULL,&openfile,NULL);  //thread one creation
	if(s!=0)
		printf("thread1 unable to create");
	else
		printf("thread1 created sucessfully");

	s=pthread_create(&tid[1],NULL,&stringoper,NULL);
	if(s!=0)
		printf("thread2 unable to create");
	else
		printf("thread2 created sucessfully");



	pthread_join(tid[0], NULL); 
	pthread_join(tid[1],NULL);


}
