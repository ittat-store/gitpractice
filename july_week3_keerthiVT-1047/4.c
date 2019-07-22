#include<stdio.h>
enum week {MONDAY=4,TUESDAY,WENDESDAY,THURDAY,FRIDAY,SATURDAY,SUNDAY}

main()
{
enum week day;
int i;
day=MONDAY;
for(i=day;i<=SUNDAY;i++)
printf("%d ",i);
}
