#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#define max 100000
#define max1 100000
int k=0,top=-1;
int s[max];
int n;
void push(void)
{
	if(top==max-1)
	{
		printf("overflow\n");
	}
	else
	{
		printf("enter number\n");
		scanf("%d",&n);
		s[++top]=n;
	}
}

void pop(void)
{
	if(top==-1)
		printf("underflow\n");
	printf("poped element is %d\n",s[top--]);
}

void display(void)
{
	int i;
	if(top>0)
	{
		for(i=top;i>=0;i--)
			printf("element is %d\n",s[i]);
	}
	else
		printf("stack is empty\n");
}

int main()
{
	int a;
	while(1)
	{
		printf("1.push ... 2.pop...3.display....\n");
		printf("enter choice\n");
		scanf("%d",&a);
		switch(a)
		{
			case 1:push();
			       break;
			case 2:pop();
			       break;
			case 3:display();
			       break;
			default:printf("exit");
				exit(0);
		}
	}
}
