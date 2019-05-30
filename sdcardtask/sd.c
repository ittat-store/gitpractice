#include <stdio.h>
#include <stdlib.h>
#include <mntent.h>
#include<string.h>
#include<unistd.h>
#include<sys/types.h>
#include<fcntl.h>
#include<sys/stat.h>
#include<dirent.h>
int main(void)
{
	struct mntent *ent;
	FILE *aFile;
	DIR *dir;
	struct dirent *dnt;
	char *file,ch;
	FILE *fp;
	char pathname[1024];

	aFile = setmntent("/proc/mounts", "r");
	if (aFile == NULL) {
		perror("setmntent");
		exit(1);
	}

	while (NULL != (ent = getmntent(aFile))) {
		if(strcmp(ent->mnt_fsname,"/dev/sdb1")==0)
		{
			printf("%s \n", ent->mnt_fsname);
			printf("%s \n", ent->mnt_dir);
			break;
		}
	}
	sprintf(pathname,"%s",ent->mnt_dir);
	if((dir=opendir(pathname))!=NULL)
	{
		printf("directory opened sucessfully\n\n");
		while((dnt=readdir(dir))!=NULL)
		{
			if(dnt->d_type!=DT_DIR)
			{
				printf("file name=%s\n",dnt->d_name);
				printf("not a directory continue\n");
				printf("it is a file\n");
				sprintf( pathname, "%s/%s",ent->mnt_dir, dnt->d_name );
				fp = fopen( pathname, "r" );
				while((ch=fgetc(fp))!=EOF)
				{
					printf("%c",ch);
					continue;
				}
				if(strcmp(dnt->d_name,".")!=0 && strcmp(dnt->d_name,"..")!=0)
				{
					//printf("%s\n",ent->d_name);
				}
			}
			printf("\n");
			printf("\n");
			printf("\n");

		}

	}

}


