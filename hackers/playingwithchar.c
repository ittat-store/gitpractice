#include <stdio.h>
#include <string.h>
#include <math.h>
#include <stdlib.h>
#define max 10000
int main() 
{

    /* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
    char ch,s[max],sen[max];  
    scanf("%c",&ch);
    printf("%c\n",ch);
    scanf("%s",s);
    printf("%s\n",s);
scanf("\n");
    scanf("%[^\n]%*c", sen);
//gets(sen);
    printf("%s\n",sen);
    return 0;
}

