#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include<stdlib.h>
  int countwords(char *str) 
  {
    while (*str != '\0') 
    {
      while (isspace(*str))
        str++;
      if (*str == '\0')
        return 0;
      while (!isspace(*str) && *str != 0) 
      {
        putchar(*str);
        str++;
      }
      printf("\n");
    }
    return 0;
  }

  int main() 
  {
    int i = 0;
    char *str = malloc(1024 * sizeof(char));
    //printf("enter string\n");
    gets(str);
    countwords(str);
  }


