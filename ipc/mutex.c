#include<stdio.h>
#include<pthread.h>
pthread_mutex_t lock;
pthread_t t1,t2;
char buf[10];
void *fileopen()
{
	pthread_mutex_lock(&lock);
	FILE *fp;
	fp=fopen("file.txt","r");
	while(fscanf(fp,"%s",buf)!=EOF)
	printf("%s",buf);
	pthread_mutex_unlock(&lock);
}

int main()
{
	int s;
	pthread_mutex_init(&lock,NULL);
	s=pthread_create(&t1,NULL,&fileopen,NULL);
	s=pthread_create(&t2,NULL,&fileopen,NULL);
	pthread_join(t1,NULL);
	pthread_join(t2,NULL);
	pthread_mutex_destroy(&lock);
}
