#include<stdio.h>

struct integer
{
unsigned int d:4;
unsigned int m:4;
};


main()
{
struct integer in ={7,2};
printf("%d , %d \n",in.d,in.m);
}
