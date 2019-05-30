/*#include<stdio.h>
#include<stdlib.h>
int main()
{
volatile int a=5;
a=10;
printf("%d\n",a);

volatile const b=20;
//b=25;
printf("%d\n",b);
return 0;
}*/

#include <stdio.h> 
  
/*int main(void) 
{ 
    const int local = 10; 
    int *ptr = (int*) &local; 
  
    printf("Initial value of local : %d \n", local); 
  
    *ptr = 100; 
  
    printf("Modified value of local: %d \n", local); 
  
    return 0; 
} */

int main(void) 
{ 
    const volatile int local = 10; 
    int *ptr = (int*) &local; 
  
    printf("Initial value of local : %d \n", local); 
  
    *ptr = 100; 
  
    printf("Modified value of local: %d \n", local); 
  
    return 0; 
} 
