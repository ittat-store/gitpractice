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
	//int rvalue;
 (void)  signal(SIGUSR1,catch);
	//rvalue=pthread_mutex_unlock(&mutex);
	fp=fopen(buf1,"r+");
	if(fp<=NULL)
	{
		printf("can't open file");
	}
	else
	{
		while((fscanf(fp,"%s",word)!=EOF))
		{
                  
			printf("%s",word);
			/*signal(SIGUSR1,&compare);
			  raise(SIGUSR1);
			  sigset_t sigset;
			  sigemptyset(&sigset);
			  sigaddset(&sigset,SIGUSR1);
			  sigprocmask(SIG_BLOCK,&sigset,NULL);*/
			  pthread_kill(thread2,SIGUSR1); 
		         	sleep(1);
                         pthread_exit(0);
                        // signal(SIGUSR1,catch);
			/*rvalue=pthread_cond_signal(&condB);
			  rvalue=pthread_mutex_lock(&mutex);
			  while(pthread_cond_wait(&condA,&mutex)!=0)*/
		}
                fclose(fp);
	}
}

void *compare(void *arg)
{
	int rvalue,cmp;
	int i;
	int j=0;
	char rev[20];
	//char *str[20];
	//rvalue = pthread_mutex_lock(&mutex);
	//while(pthread_cond_wait(&condB,&mutex)!=0)
	//rvalue=pthread_mutex_unlock(&mutex);
	void signal(SIGINT,catch);
	printf("in thread2\n");
	if((strcasecmpr(word,buf2))==0)
        {
		printf("inside compare\n");
		//rev=revstring(argv[2])
	//	strcpy(str,word);
		for(i=strlen(word)-1;i>=0;i--,j++)
		{
			rev[j]=word[i];
		}
		fseek(fp,-strlen(word),1);
		fputs(rev,fp);
		memset(word,'\0',strlen(word));
	}

		pthread_kill(thread1,SIGUSR1);
		sleep(1);
                pthread_exit(0);
	// rvalue=pthread_cond_signal(&condA);
}


main(int argc,char *argv[])
{
	//pthread_t thread1,thread2;
	strcpy(buf1,argv[1]);
	strcpy(buf2,argv[2]);
	pthread_create(&thread1,NULL,readwords,NULL);
	pthread_create(&thread2,NULL,compare,NULL);
	pthread_join(thread1,NULL);
	pthread_join(thread2,NULL);
}
