#include<stdio.h>
int multiply(int n, int m) 
{   
    int ans = 0, count = 0; 
    while (m) 
    { 
        // check for set bit and left  
        // shift n, count times 
        if (m % 2 == 1)               
            ans += n << count; 
  
        // increment of place value (count) 
        count++; 
        m /= 2; 
    } 
    return ans; 
} 
  
// Driver code 
int main() 
{ 
    int ret,n , m;
    printf("enter num n and m\n");
    scanf("%d %d",&n,&m); 
    ret=multiply(n, m); 
    printf("mul is %d\n",ret);
    return 0; 
} 
