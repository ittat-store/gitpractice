#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#define max 100000
#define max1 100000
int level=0,k=0,rear=-1,front=-1;
int q[max];

void enque(int num)
{
	if(rear==max-1)
          {
		printf("overflow\n");
          }
	else
            {
		if(front==-1)
                   {
			front=0;
                   }
	rear++;
	q[rear]=num;
        //printf("enque %d\n",q[rear]);
            }
}

int deque()
{
	if(front==-1||front>rear)
              {
		printf("underflow\n");
	      }
              else
               {
                //printf("deque %d\n",q[front]);
		return q[front++];
                
               }
}




int checkzero(int num)
{
	if(num==0)
		return level;
	else
		return 0;
}

int  *findfactor(int n)
{
	int i,j,fact,n1;
        static int a[max1];
	for(i=1;i<=sqrt(n);i++)
	{
		if(n%i==0)
			j=n/i;
		fact=i*j;
		if(fact==n)
		{
			if(i==1||j==1)
			{
				n1=n-1;
				a[k]=n1;
				k++;
			}
			else
			{
				a[k]=j;
				k++;
			}
		}

	}
	return a;
}

int function()
{
	int *p,down,out,m,i,r;
	out=deque();
        //printf("out is %d\n",out);
	if(out=="\n")
	{
		level++;
               // printf("level is %d\n",level);
		enque("\n");
                //printf("out loop%d\n",out);
	}
        //front++;
	else
            {
		down=checkzero(out);
			if(down==0)
			{
				p=findfactor(out);
					m=k;
				k=0;
				for(i=0;i<m;i++)
				{       
                                        r=*(p+i);
                                        //printf("factors are%d\n",r);
					enque(r);
				}
	            	}
                         else
                              return down;
            }
	function();
}





main()
{
	int num,lev;
	printf("enter the number greter than zero\n");
	scanf("%d",&num);
	enque(num);
	enque("\n");
	lev=function();
	printf("level is %d\n",lev);
}
