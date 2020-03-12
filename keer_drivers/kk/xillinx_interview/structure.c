#include<stdio.h>

struct st{ 
    short s[5];
    union { 
         float y; 
         long z; 
    }u; 
} t;

int main()
{
struct st s1;
printf("%d\n",sizeof(s1));
return 0;
}
