#include<stdio.h>
#define r 3
#define c 3
int matrix(int m,int n,int a[r][c])
{
int k=0,l=0,i;
while(k<m && l<n)
{
for(i=0;i<n;++i)
{
printf("%d",a[k][i]);
}
k++;

for(i=k;i<m;++i)
{
printf("%d",a[i][n-1]);
}
n--;

if(k<m)
{
for(i=n-1;i>=1;--i)
{
printf("%d",a[m-1][i]);
}
m--;
}

if(l<n)
{
for(i=m;i>k;--i)
{
printf("%d",a[i][l]);
}
l++;
}
}
}
main()
{
int a[r][c]={{1,2,3},{4,5,6},{7,8,9}};

matrix(r,c,a);

}
