#include<stdio.h>

int endianswap(int);

int main()
{
        printf("Swap\n");
        endianswap(500);
        return 0;
}

int endianswap(int a)
{
        union byte4{
        char byte[4];
        int numint;
        float numfloat;
        };

        union byte4 un;
        int i;
        un.numint = a;

        printf("before:\n");
        for (i=0;i<4;i++) {
                printf("un[%d]=%02X\n",i,un.byte[i]);
        }

        char c1 = un.byte[0];
        un.byte[0] = un.byte[3];
        un.byte[3]=c1;
        c1 = un.byte[1];
        un.byte[1] = un.byte[2];
        un.byte[2] = c1;

        printf("after:\n");
        for (i=0;i<4;i++) {
                printf("un[%d]=%02X\n",i,un.byte[i]);
        }
        return un.numint;
}
