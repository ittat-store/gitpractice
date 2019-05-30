#include <stdio.h>
#include <stdlib.h>
#include <math.h>

struct triangle
{
	int a;
	int b;
	int c;
};

typedef struct triangle triangle;
void sort_by_area(triangle* tr, int n) {
	/**
	* Sort an array a of the length n
	*/
    
    int a[n],t1,t2,t3;

    for(int i=0;i<n-1;i++)
    {
        for(int j=0;j<n-i-1;j++)
        {
            int s=0;
            for(int k=j;k<=j+1;k++)
            {
            int p=(tr[k].a+tr[k].b+tr[k].c)/2;
        a[s++]=sqrt(p*(p-tr[k].a)*(p-tr[k].b)*(p-tr[k].c));
            }
            if(a[0]>a[1])
            {
                t1=tr[j].a;
                t2=tr[j].b;
                t3=tr[j].c;
                tr[j].a=tr[j+1].a;
                tr[j].b=tr[j+1].b;
                tr[j].c=tr[j+1].c;
                tr[j+1].a=t1;
                tr[j+1].b=t2;
                tr[j+1].c=t3;
            }
        }
    }
    
}

int main()
{
	int n;
	scanf("%d", &n);
	triangle *tr = malloc(n * sizeof(triangle));
	for (int i = 0; i < n; i++) {
		scanf("%d%d%d", &tr[i].a, &tr[i].b, &tr[i].c);
	}
	sort_by_area(tr, n);
	for (int i = 0; i < n; i++) {
		printf("%d %d %d\n", tr[i].a, tr[i].b, tr[i].c);
	}
	return 0;
}
