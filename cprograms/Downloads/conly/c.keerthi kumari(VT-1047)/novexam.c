#include<stdio.h>
#include<signal.h>
#include<pthread.h>
#include<unistd.h>
#include<string.h>
#include<signal.h>



/*pthread_cond_t condA = PTHREAD_COND_INITIALIZER;
pthread_cond_t condB = PTHREAD_COND_INITIALIZER;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;*/

char *word[20];
void *readwords(void *argone)
{
int rvalue;
FILE *fp;
//rvalue=pthread_mutex_unlock(&mutex);
fp=fopen(argone,"r");
if(fp<=NULL)
{
printf("can't open file");
}
else
{
while((fscanf(fp,"%s",word)!=EOF))
{
printf("%s",word);
signal(SIGUSR1,&compare);
raise(SIGUSR1);
sigset_t sigset;
sigemptyset(&sigset);
sigaddset(&sigset,SIGUSR1);
sigprocmask(SIG_BLOCK,&sigset,NULL);

/*rvalue=pthread_cond_signal(&condB);
rvalue=pthread_mutex_lock(&mutex);
while(pthread_cond_wait(&condA,&mutex)!=0)*/
}
}
fclose(fp);
}

void *compare(void *argtwo)
{
int rvalue,cmp;
int i;
int j=0;
char rev[20];
char str[20];
//rvalue = pthread_mutex_lock(&mutex);
//while(pthread_cond_wait(&condB,&mutex)!=0)
//rvalue=pthread_mutex_unlock(&mutex);
cmp=strcasecmp(word,argtwo);
if(cmp==0)
{
//rev=revstring(argv[2])
strcpy(str,word);
for(i=strlen(str)-1;i>=0;i--)
{
rev[j++]=str[i];
}
fputs(rev,fp);
}
else
// rvalue=pthread_cond_signal(&condA);
}


main(int argc,char **argv[])
{
pthread_t thread1,thread2;
pthread_create(&thread1,NULL,readwords,(void *)&argv[1]);
pthread_create(&thread2,NULL,compare,(void *)&argv[2]);
pthread_join(thread1,NULL);
pthread_join(thread2,NULL);
}
