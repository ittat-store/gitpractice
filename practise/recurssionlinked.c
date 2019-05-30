
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
FILE *fp,*fp1;
char buf[10];
void recurssion();
int main()
{
//fp=fopen("file.txt","r");
fp1=fopen("file.txt","r");
recurssion();
}
void recurssion()
{
char buf1[10]={'\0'};
if(fp1==NULL)
return ;
if(fscanf(fp1,"%s",buf1)!=EOF){
printf("%s\n",buf1);
recurssion();

printf("%s\n",buf1);
}

}

