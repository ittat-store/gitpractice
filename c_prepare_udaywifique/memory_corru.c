#include <string.h>
#include <stdio.h>
int main(argc, argv)
    int argc;
    char *argv[];
{
    int i;
    char str[16];
    str[0] = '\0';
    for(i=0; i<argc; i++) {
        strcat(str, argv[i]);
        if(i < (argc-1)) strcat(str, " ");
    }
    printf("You entered: %s\n", str);
    return (0);
}
