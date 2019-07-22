#include<stdio.h>

int main()
{
int total=0;
char *p="parpar";
while ( strstr(p,"par") != NULL ) 
   {
printf("%s", p); // to know the content of p
p++;
total++;
   }
printf("%i", total);
getch(); // pause
}
