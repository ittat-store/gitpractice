#include<stdio.h>
#include<string.h>
#include<signal.h>
#include<pthread.h>
#include<signal.h>
#include<unistd.h>

pthread_t a,thread1,thread2;
void catch()
{
	//printf("signal catches\n");
}

FILE *fp1,*fp2;
char word1[20];
char word2[20];
void *readword1(void *arg);
void *readword2(void *arg);

void writefile()
{
        sigset_t set;
        int sig;
        sigemptyset(&set);
        sigaddset(&set,SIGALRM);
        fp2=fopen("kumari.txt","w");
        if(fp2<=0)
        {
                printf("can't open file\n");
        }
        else
        {
        pthread_kill(thread1,SIGUSR1);
        while((thread2) && (!feof(fp1)))
        {
       // while(!feof(fp1))
        //{
        sigwait(&set,&sig);
        pthread_kill(thread1,SIGUSR1);
        //sigwait(&set,&sig);
        printf("......in main.......\n");
        fprintf(fp2,"%s ",word1);
        memset(word1,'\0',strlen(word1));
        fprintf(fp2,"%s ",word2);
        memset(word2,'\0',strlen(word2));
        //pthread_kill(thread1,SIGUSR1);
        //sigwait(&set,&sig);

        }
        }   
        //}
}

int main()
{
	(void) signal(SIGUSR1,catch);
	//sleep(1);
	(void) signal(SIGUSR2,catch);
        (void) signal(SIGALRM,catch);
        a= pthread_self();
        //printf("%d\n",a);
	int r1,r2;
        
	r1=pthread_create(&thread1,NULL,&readword1,NULL);
	if(r1!=0)
	{
		printf("thread1 not created\n");
	}
	
        r2=pthread_create(&thread2,NULL,&readword2,NULL);
	if(r2!=0)
	{
		printf("thread2 not created\n");
	}
        
        writefile();
        pthread_join(thread1,NULL);
        pthread_join(thread2,NULL);
        //thread_join(a,NULL);
        fclose(fp1);
        fclose(fp2);
}

void *readword1(void *arg)
{
	int sig;
	sigset_t set;
	sigemptyset(&set);
	sigaddset(&set,SIGUSR1);
        printf(".......in thread1......\n");
	fp1=fopen("keerthi.txt","r");
	if(fp1<=0)
	{
		printf("can't open\n");
	}
	else
        {
	
        sigwait(&set,&sig);
        while((thread2) && (!feof(fp1)))
        {
        while(fscanf(fp1,"%s\n",word1)!=EOF)
	{
	       printf("%s\n",word1);
		pthread_kill(thread2,SIGUSR2); 
                sigwait(&set,&sig);        
	}
        pthread_kill(thread2,SIGUSR2);
	printf(".......t1 exiting.......\n");
	pthread_exit(0);
        }
        }
}
void *readword2(void *arg)
{
	int sig;
	sigset_t set;
	sigemptyset(&set);
	sigaddset(&set,SIGUSR2);
	sigwait(&set,&sig);
	printf(".......in thread2.......\n");
        while((a) && (!feof(fp1)))
        {
	while(fscanf(fp1,"%s\n",word2)!=EOF)
	{
               // sigwait(&set,&sig);
		printf("%s\n",word2);
		pthread_kill(a,SIGALRM);
                sigwait(&set,&sig);
	}
        pthread_kill(a,SIGALRM);
	printf("......t2 exiting......\n");
	pthread_exit(0);
        }
}
