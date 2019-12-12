#include<stdio.h>
int main()
{
	int m,n,i,j,x,y;
	printf("enter rows & columns:");
	scanf("%d%d",&m,&n);
	int maze[m][n];
	printf("enter the maze values:");
	for(i=0;i<m;i++)
	{
		for(j=0;j<n;j++)
			scanf("%d",&maze[i][j]);
	}
	printf("enter x,y values:");
	scanf("%d%d",&x,&y);
	int cnt=0;
	for(i=0;i<x;i++)
	{
		for(j=0;j<y;j++)
		{
			if(maze[i][j]==1)
				continue;
			else if(maze[i][j]==2|1)
				cnt++;

		}
	}		
	cnt++;
	printf("\n%d\n",cnt);
}
