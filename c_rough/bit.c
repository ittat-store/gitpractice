#include<stdio.h>
struct st
{
unsigned int  a:10;
unsigned  int b:7;
unsigned  :17;
};
main()
{
printf("%d\n",sizeof(struct st));
printf("size of int %d\n",sizeof(int));
}
