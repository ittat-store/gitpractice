#include<stdio.h>
#include<stdlib.h>
typedef struct student
{
	int data;
	struct student *next;
}a;
a *top=NULL;
int main()
{
	a *head=NULL,*node=NULL;
	int i;
	printf("enter your choice 1.push 2.pop 3.exit\n");
	scanf("%d",&i);
	a* createnode(); 
	while(i!=3)
	{
		if(i==1)
		{
			void push(a*head);
			push(head);
		}
		if(i==2)
		{
			void pop(a *head);
			pop(head);
		}
		printf("enter your choice 1.push 2.pop 3.exit\n");
		scanf("%d",&i);
	}
}
a* createnode( )
{
	a* node;
	node=(a*)malloc(sizeof(a));
	node->next=NULL;
	return node;
}
void push(a *head)
{
	a *node;
	node=createnode( );
	printf("enter the no to enter\n");
	scanf("%d",&node->data);
	node->next=top;
	top=node;
}
void pop(a *head)
{
	a *node,*q;
	if(top==NULL)
		printf("stack is empty\n");
	else
	{
		printf("poped element is %d\n",top->data);
		q=top;
		top=top->next;
		free(q);
		q=NULL;
	}
}
