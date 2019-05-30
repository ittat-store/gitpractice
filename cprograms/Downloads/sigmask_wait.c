#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <errno.h>

pthread_t thread,thread1;
int i=5,j=5;
/* Simple error handling functions */

#define handle_error_en(en, msg) \
	do { errno = en; perror(msg); exit(EXIT_FAILURE); } while (0)

	static void *sig_thread(void *arg)
{
	sigset_t *set = arg;
	int s, sig;
	//printf("t1::Hii2\n");
	while (i-->0) {
		pthread_sigmask(SIG_BLOCK, set, NULL);
		printf("t1::Hii3\n");
		pthread_kill(thread1, SIGUSR1);
		s = sigwait(set, &sig);
		if (s != 0)
			handle_error_en(s, "sigwait");
		printf("t1::Signal handling thread got signal %d\n", sig);
		pthread_sigmask(SIG_UNBLOCK, set, NULL);
		if(i==0)
			exit(0);
	}
	
	//
}

static void *sig_thread1(void *arg)
{
	sigset_t *set = arg;
	int s, sig;
	// printf("t2::Hii2\n");
	while(j-->0) {
		pthread_sigmask(SIG_BLOCK, set, NULL);
		printf("t2::Hii3\n");
		//       printf("t2::sig1::%d\n",sig);
		pthread_kill(thread, SIGUSR2);
		s = sigwait(set, &sig);
		if (s != 0)
			handle_error_en(s, "sigwait");
		printf("t2::Signal handling thread got signal %d\n", sig);
		pthread_sigmask(SIG_UNBLOCK, set, NULL);
	}
	if(j==0)
		exit(0);
	pthread_exit(NULL);
}


	int main(int argc, char *argv[])
{
	//          pthread_t thread,thread1;
	sigset_t set;
	int s;

	/* Block SIGQUIT and SIGUSR1; other threads created by main()
	   will inherit a copy of the signal mask. */
	sigemptyset(&set);
	sigaddset(&set, SIGUSR2);
	sigaddset(&set, SIGUSR1);
	printf("hii1\n");
	//s = pthread_sigmask(SIG_BLOCK, &set, NULL);
	if (s != 0)
		handle_error_en(s, "pthread_sigmask");

	s = pthread_create(&thread, NULL, &sig_thread, (void *) &set);
	if (s != 0)
		handle_error_en(s, "pthread_create");
	s = pthread_create(&thread1, NULL, &sig_thread1, (void *) &set);
	if (s != 0)
		handle_error_en(s, "pthread_create");

	//s = pthread_sigmask(SIG_UNBLOCK, &set, NULL);

	/* Main thread carries on to create other threads and/or do
	   other work */

	//  pause();            /* Dummy pause so we can test program */
	pthread_join(thread,NULL);
	pthread_join(thread1,NULL);
	pthread_exit(0);
	
}

