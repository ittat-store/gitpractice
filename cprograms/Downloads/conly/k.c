#include<stdio.h>
#define P printf("%d\n", 1^~0);
#define M(P) int main()\
	{\
		 P\
	return 0;\
	}
M(P);
