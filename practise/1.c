
#include<stdio.h> 
#include<wait.h> 
#include<signal.h> 
pid_t pid; 
int counter = 0,i=0; 
void handler1(int sig) 
{ 
    counter++; 
    printf("counter::h1::%d = %d\n",++i, counter); 
    /* Flushes the printed string to stdout */
    fflush(stdout); 
    kill(pid, SIGUSR2); 
} 
void handler2(int sig) 
{ 
    counter += 3; 
    printf("counter ::h2::%d= %d\n",++i, counter); 
    exit(0); 
} 
  
int main() 
{ 
    pid_t p; 
    int status; 
    signal(SIGUSR1, handler1); 
    if ((pid = fork()) == 0) 
    { 
        signal(SIGUSR2, handler2); 
        kill(getppid(), SIGUSR1); 
        while(1) ; 
    }
	printf("1"); 
    if ((p = wait(&status)) > 0) 
    { 
        counter += 4; 
        printf("counter = %d\n", counter); 
    } 
} 

