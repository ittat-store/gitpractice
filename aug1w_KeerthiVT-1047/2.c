#include<stdio.h>
main()
{
	char cal[12][12]={"january","february","march","april","may","june","july","august","september","october","november","december"};
        char (*arr)[12];
        int i;
        arr=&cal;
        for(i=0;i<12;i++)
        printf("%c\t",arr[i][1]);
}
