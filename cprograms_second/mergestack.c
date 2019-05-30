#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#define max2 100000
#define max1 100000
int top1=-1,top2=-1;
int s1[max1],s2[max2];
int n1,n2;
void push1(void)
{
	if(top1==max1-1)
	{
		printf("overflow\n");
	}
	else
	{
		printf("enter number\n");
		scanf("%d",&n1);
		s1[++top1]=n1;
	}
}

void pop1(void)
{
	if(top1==-1)
		printf("underflow\n");
	printf("poped element is %d\n",s1[top1--]);
}

void display1(void)
{
	int i;
	if(top1>0)
	{
		for(i=top1;i>=0;i--)
			printf("element is %d\n",s1[i]);
	}
	else
		printf("stack is empty\n");
}


void push2(void)
{
	if(top2==max2-1)
	{
		printf("overflow\n");
	}
	else
	{
		printf("enter number\n");
		scanf("%d",&n2);
		s2[++top2]=n2;
	}
}

void pop2(void)
{
	if(top2==-1)
		printf("underflow\n");
	printf("poped element is %d\n",s2[top2--]);
}

void display2(void)
{   
	int i;
	if(top2>0)
	{
		for(i=top2;i>=0;i--)
			printf("element is %d\n",s2[i]);
	}
	else
		printf("stack is empty\n");
}

int cnt=0;

void arrayreverse(int a[])
{
	int i,j,temp;
	for(i=0,j=cnt-1;i<j;i++,j--)
	{
		temp=a[i];
		a[i]=a[j];
		a[j]=temp;
	}
	for(i=0;i<cnt;i++)
		printf("%d ",a[i]);
	printf("\n");

	for(i=0;i<cnt;i++)
	{

		if(top2==max2-1)
		{
			printf("overflow\n");
		}
		else
		{
			//printf("enter number\n");
			//scanf("%d",&n2);
			s2[++top2]=a[i];
		}
	}
}

void merge(void)
{
	int a[100];
	int i;
	if(top1==-1)
		printf("underflow\n");
	while(top1>=0)
	{
		printf("poped element is %d\n",s1[top1]);
		a[cnt++]=s1[top1--];
	}
	for(i=0;i<cnt;i++)
		printf("%d ",a[i]);
	printf("\n");
	arrayreverse(a);
}

int main()
{
	int a,ret=1;
	while(1)
	{
		printf("for stack1 1.push ... 2.pop...3.display....\n for stack two 4.push....5.pop....6.display\n");
		printf("enter choice\n");
		scanf("%d",&a);
		switch(a)
		{
			case 1:push1();
			       break;
			case 2:pop1();
			       break;
			case 3:display1();
			       break;
			case 4:push2();
			       break;
			case 5:pop2();
			       break;
			case 6:display2();
			       break;
			case 7:merge();
			       break;
			default:printf("exit");
				exit(-1);
		}
	}
	return 0;
}

