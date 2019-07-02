#include<stdio.h>
#include<stdlib.h>
struct student
{
	int data;
	struct student *next;
	struct student *prev;
};
struct student *add(struct student *head);
void display(struct student *head);
struct student *doublelist(struct student *head);
void goback(struct student *head);
void gofront(struct student *head);
int main()
{
	struct student *head=NULL;
	int ch;
	while(1)
	{
		printf("1.add 2.display 3.double 4.goback 5.gofront 6.exit");
		printf("enter u r choice");
		scanf("%d",&ch);
		switch(ch)
		{
			case 1:head=add(head);
			       break;
			case 2:display(head);
			       break;
			case 3:head=doublelist(head);
			       display(head);
                               break;
			case 4:goback(head);
			       break;
			case 5:gofront(head);
			       break;
			case 6:exit(0);
			       break;
		}
	}
}
struct student *add(struct student *head)
{
	struct student *t,*p;
	int data;
	t=head;
	if(t==NULL)
	{
		t=malloc(sizeof(struct student));
		printf("enter the data");
		scanf("%d",&data);
		t->data=data;
		t->next=NULL;
		head=t;
	}
	else

	{
		while(t->next!=NULL)
			t=t->next;
		p=malloc(sizeof(struct student));
		printf("enter the data");
		scanf("%d",&data);
		p->data=data;
		p->next=NULL;
		t->next=p;
	}

	return head;
}


void display(struct student *head)
{
	if(head==NULL)
		printf("list is empty");
	else
	{
		while(head!=NULL)
		{
			printf("%d\t",head->data);
			head=head->next;
		}
	}
}

struct student *doublelist(struct student *head)
{
	struct student *t,*q,*p=0,*s;
	t=q=head;
	while(t!=NULL)
	{
		s=t;
		t->prev=p;
		p=t;
		t=t->next;
	}
	q->prev=s;
	return head;
}
void goback(struct student *head)
{
	struct student *t,*p;
	t=p=head;
	t=t->prev;
	while(t!=p)
	{
		printf("%d\n",t->data);
		t=t->prev;
	}
	printf("%d\n",t->data);
}
void gofront(struct student *head)
{
	struct student *t;
	t=head;
	while(t!=NULL)
	{
		printf("%d\n",t->data);
		t=t->next;
	}
}
