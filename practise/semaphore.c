#include<stdio.h>
#include<semaphore.h>
#include<pthread.h>
sem_t mut;
pthread_t t1,t2;
//FILE *fp;
char buf[10];
void *find()
{
FILE *fp;
	sem_wait(&mut);
	fp=fopen("file.txt","r");
	while(fscanf(fp,"%s",buf)!=EOF)
		printf("%s",buf);
	sem_post(&mut);
}

int main()
{
	sem_init(&mut,0,2);
	pthread_create(&t1,NULL,find,NULL);
//	sleep(1);
	pthread_create(&t2,NULL,find,NULL);
	pthread_join(t1,NULL);
	pthread_join(t2,NULL);
	sem_destroy(&mut);
}

