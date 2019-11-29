#include<stdio.h>
#include<stdlib.h>
# define max 10
int top=-1,arr[max];

void push()
{
	int n;
	printf("enter the element to be insert\n");
	scanf("%d",&n);
	if(top==max-1)
		printf("overflow\n");
	arr[++top]=n;
}

void pop()
{
	int out;
	if(top==-1)
		printf("underflow\n");
	out=arr[top--];
	printf("poped element is %d\n",out);
}

void display()
{
	int i;
	for(i=top;i>=0;i--)
	{
		printf("element is %d\n",arr[i]);
	}
}


	main()
	{
		while(1)
		{
			int ch;
			printf("Menu is 1.Push 2.Pop 3.display 4.exit\n");
			printf("enter the choice\n");
			scanf("%d",&ch);
			switch(ch)
			{
				case 1: push();
					break;
				case 2: pop();
					break;
				case 3: display();
					break;
				case 4: exit(0);
			}
		}
	}
