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
void sort_by_area(triangle* tr, int n) 
{
    int a[n],t1,t2,t3,i,j,k;
      for (i = 0; i < n - 1; i++)
      {
        // Last i elements are already in place
        for (j = 0; j < n - i - 1; j++)
        {
            int s=0;
          for (k = j; k <=j+1; k++) {
            double p = (tr[k].a + tr[k].b + tr[k].c) / 2.0;
            // printf("%d ",p);
            a[s++] = (p * (p - tr[k].a) * (p - tr[k].b) * (p - tr[k].c));
            // printf("%d ",s);
          }

          if (a[0] > a[1])
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
    //for(i=0;i<n;i++)
    //printf("%d ",s[i]);
    //printf("\n");
}
int main()
{
	int n,i;
	scanf("%d", &n);
	triangle *tr = malloc(n * sizeof(triangle));
	for (i = 0; i < n; i++) {
		scanf("%d%d%d", &tr[i].a, &tr[i].b, &tr[i].c);
	}
	sort_by_area(tr, n);
	for (i = 0; i < n; i++) {
		printf("%d %d %d\n", tr[i].a, tr[i].b, tr[i].c);
	}
	return 0;
}
