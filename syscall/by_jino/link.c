#include <unistd.h>

int main(){
	char *path1 = "/home/thomajin/jino/sys_calls/chdir.c";
	char *path2 = "/home/thomajin/jino/sys_calls/chdir_new.c";
	int   status;

	status = link (path1, path2);
	unlink("chdir_new.c");
	return 0;
}

