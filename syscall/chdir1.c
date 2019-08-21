#include <unistd.h> 
#include <stdio.h> 
  
// Main Method 
int main() { 
  
  // changing the current  
  // working directory(cwd) 
  // to /usr 
  if (chdir("/usr") != 0)  
    perror("chdir() to /usr failed"); 
  
  // changing the cwd to /tmp 
  if (chdir("/tmp") != 0)  
    perror("chdir() to /temp failed"); 
  
  // there is no /error  
  // directory in my pc 
  if (chdir("/error") != 0)  
  
    // so chdir will return -1  
    perror("chdir() to /error failed");   
  
  return 0; 
} 

