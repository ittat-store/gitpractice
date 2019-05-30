#include <unistd.h>
#include<pthread.h>
#include<stdio.h>
#include<string.h>
#include<stdlib.h>
#include<signal.h>
#include<fcntl.h>
FILE *fp;
pthread_t t1,t2;
char *userbufer=NULL;
char buf[100];

char* rev(const char *str);
int compare(char *buff, char *str);
void *com(void *str);
void *readf(void *str);


char* rev_string(const char *str)
{
  int i=0;
  int j=strlen(str)-1;

  char *temp=(char *)malloc(strlen(str));
  if(temp)
  {
    while(j>=0)
    {
      temp[i++]=str[j--];
    }
    temp[i]='\0';
    return temp;
  }

  else
  {
    puts("--ERROR");
  }
}


int compare_string(char *buff, char *str) 
{
  int i=0,cnt=0,flg=0; 
  if(strlen(buff)==strlen(str))
  {
    while(buff[i])
    {
      if( (str[i]==buff[i])||(str[i]==buff[i]+32) || (buff[i]==str[i]+32))
      {
        flg=1;
      }
      else
        return 1;
      i++;
    }

    if(flg)
    {

      return 0;
    }
  }
  else
    return 1;


}


void *T2_process_word(void *str)
{

  int sig;
  sigset_t *set=str;
  char *str1=NULL;

  if( sigwait(set,&sig))
  {
    printf(" sigwait ERROR ");
  }

  while(feof(fp)==0)
  {
    if(compare_string(buf,userbufer)==0)
    {
      str1=rev_string(userbufer);
      int l=strlen(str1);
      fseek(fp,-l,SEEK_CUR);
      fputs(str1,fp);
    }
    memset(buf,'\0',strlen(buf));


    pthread_kill(t1,SIGUSR2);
    if( sigwait(set,&sig))
    {
      printf(" sigwait ERROR ");
    }

  }
  pthread_exit(NULL);

}

void *T1_read_from_file(void *str)
{
  int sig;
  sigset_t *se=str;


  while(fscanf(fp,"%s",buf)!=EOF)
  { 
    pthread_kill(t2,SIGUSR1);
    if( sigwait(se,&sig)!=0)
    {
      printf(" sigwait ERROR ");
    }


  }

  pthread_exit(NULL);
}


int main(int argc,char* argv[])
{
  sigset_t set;
  sigemptyset(&set);
  sigaddset(&set, SIGUSR2);
  sigaddset(&set, SIGUSR1);

  if(argc<3||argv[2]==NULL)
  {
    printf("--ERROR--usage:<a.out> <file name> <string>\n");
    exit(0);
  }

  fp=fopen(argv[1],"r+");
  if(fp==0)
  {
    printf("error in file opening");
  }
/*  
  fseek(fp,0,2);
  if(ftell(fp)==0)
  {
    printf(" file is empty \n");
  }
  fseek(fp,0,0);
*/
  userbufer=argv[2];
  pthread_sigmask(SIG_BLOCK, &set, NULL);

  if(pthread_create(&t1,0,&T1_read_from_file,&set)!=0)
  {
    printf("thread1 is not created\n");
  }
  if( pthread_create(&t2,0,&T2_process_word,&set)!=0)
  {
    printf("thread1 is not created\n");
  }

  pthread_join(t1,NULL);
  pthread_kill(t2,SIGUSR1);
  pthread_join(t2,NULL);
 // pthread_sigmask(SIG_UNBLOCK, &set, NULL);
  fclose(fp);
  printf("\n**********file updated********\n");
  exit(0);
}
