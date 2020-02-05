#include<stdio.h>
struct st
{
	char a;
	int b;
	struct sc
	{
		int c;
	}
};
main()
{
	struct st y;
	printf("%d\n",sizeof(y));
	printf("%d\n",sizeof(int));
	printf("%d\n",sizeof(char));
}
