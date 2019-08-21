#include<stdio.h> 
#include<stdlib.h> 
#include<unistd.h> 
#include<sys/types.h> 
#include<string.h> 
#include<sys/wait.h> 


int main() 
{ 
	int fd1[2];
	pid_t p;
	char input_str[]="votary tech";
	if (pipe(fd1)==-1) 
    	{ 
        	fprintf(stderr, "Pipe Failed" ); 
       		 return 1;
	}
	p=fork();
	//parent process
//writing to the pipe from parent process

	if(p>0){
		printf("pid of the child %d\n ",p);
		write(fd1[1],input_str,strlen(input_str));
		close(fd1);
	}
//child process
//the data written to the parent reads here.

	else{
		char out_put[100];
		read(fd1[0],out_put,100);
		printf(" ---%s--- ",out_put);
	}
}
