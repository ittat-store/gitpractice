#include<stdio.h>
#include<signal.h>
#include<pthread.h>
#include<string.h>
#include<signal.h>
#include<unistd.h>


/*pthread_cond_t condA = PTHREAD_COND_INITIALIZER;
  pthread_cond_t condB = PTHREAD_COND_INITIALIZER;
  pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;*/


int strcasecmpr(char *word,char *buf2)
{
	int i=0;
	int j=0;
	for(j=0;(buf2[j]&&word[j])!=0;j++)
	{
		if((word[i]==buf2[i])||(word[i]==buf2[i]-32)||(word[i]==buf2[i]+32))
			i++;
		else
			break;
	}
	if(buf2[i]=='\0'&&word[i]=='\0')
		return 0;
	else
		return -1;
}

pthread_t thread1,thread2;
void catch()
{
	//printf("siganl catches\n");
}

void *compare(void *arg);
char buf1[50],buf2[30];
char word[20];
FILE *fp;
void *readwords(void *arg)
{
      
	(void)signal(SIGUSR2,catch);
	//int rvalue;
	printf("in thread 1\n");
	//rvalue=pthread_mutex_unlock(&mutex);
	fp=fopen(buf1,"r+");
	if(fp<=0)
	{
		printf("can't open file");
	}      

	else
	{
		(void) signal(SIGUSR1,catch);	
		while(fscanf(fp,"%s",word)!=EOF)
		{
			printf("%s\n",word);
			//signal(SIGUSR1,&compare);
			  //raise(SIGUSR1);
			 /* sigset_t sigset;
			  sigemptyset(&sigset);
			  sigaddset(&sigset,SIGUSR1);
			  sigprocmask(SIG_BLOCK,&sigset,NULL);*/
			pthread_kill(thread2,SIGUSR1); 
			sleep(1);
			// pthread_exit(0);
			//(void) signal(SIGUSR1,catch);
			/*rvalue=pthread_cond_signal(&condB);
			  rvalue=pthread_mutex_lock(&mutex);
			  while(pthread_cond_wait(&condA,&mutex)!=0)*/
		}
		pthread_exit(0);
	//	fclose(fp);
	}
}


void *compare(void *arg)
{
	int rvalue,cmp;
	int i;
	int j;
	char rev[20];
	//char *str[20];
	//rvalue = pthread_mutex_lock(&mutex);
	//while(pthread_cond_wait(&condB,&mutex)!=0)
	//rvalue=pthread_mutex_unlock(&mutex);

	(void) signal(SIGUSR1,catch);
	printf("in thread2\n");
        while(!feof(fp))
        {
	if((strcasecmpr(word,buf2))==0)
	{
		printf("inside compare\n");
		//rev=revstring(argv[2])
		//	strcpy(str,word);
		for(i=strlen(word)-1,j=0;i>=0;i--,j++)
		{
			rev[j]=word[i];
		}
		rev[j]='\0';
		fseek(fp,-strlen(word),SEEK_CUR);
		fputs(rev,fp);
	//	memset(rev,'\0',strlen(rev));
                memset(word,'\0',strlen(word));
	}

	pthread_kill(thread1,SIGUSR2);
}
	sleep(1);
	pthread_exit(0);
	// rvalue=pthread_cond_signal(&condA);
}



int main(int argc,char *argv[])
{
	//pthread_t thread1,thread2;
	strcpy(buf1,argv[1]);
	strcpy(buf2,argv[2]);
	pthread_create(&thread1,NULL,&readwords,NULL);
	pthread_create(&thread2,NULL,&compare,NULL);
	pthread_join(thread1,NULL);
	pthread_join(thread2,NULL);
fclose(fp);
}
