 #include <sys/stat.h>
 #include <fcntl.h>

void main(){
	
	int fd=chmod("test.txt", S_IRUSR | S_IWUSR | S_IXUSR );
}

