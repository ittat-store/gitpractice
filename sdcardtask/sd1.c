#include<stdio.h>
#include<dirent.h>
#include<string.h>
#include<unistd.h>
#include<sys/types.h>
#include<fcntl.h>
#include<sys/stat.h>
void main()
{
        DIR *dir;
        struct dirent *ent;
        char *file,ch;
        FILE *fp;
	char pathname[1024];
        if((dir=opendir("/media/bagamuda/BOOT"))!=NULL)
        {
                printf("directory opened sucessfully\n");
                while((ent=readdir(dir))!=NULL)
                {
                        if(ent->d_type!=DT_DIR)
                        {
                                printf("%s\n",ent->d_name);
                                printf("not a directory continue\n");
                               sprintf( pathname, "%s/%s", "/media/bagamuda/BOOT/", ent->d_name );
       				fp = fopen( pathname, "r" );
                                while((ch=fgetc(fp))!=EOF)
                                {
                                        printf("%c",ch);
                                        continue;
                                }
                                if(strcmp(ent->d_name,".")!=0 && strcmp(ent->d_name,"..")!=0)
                                {
                                        //printf("%s\n",ent->d_name);
                                }
                        }
                }
                
}
return;
}
