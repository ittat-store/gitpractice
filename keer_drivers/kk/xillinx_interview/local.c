#include<stdio.h>

void f() 
{ 
   static int i;
   
   ++i; 
   printf("%d", i); 
}

main()
{ 
   f(); 
   f(); 
   f(); 
}
