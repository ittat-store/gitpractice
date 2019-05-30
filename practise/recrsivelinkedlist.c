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
struct student *recursivelist(struct student *head);


int main()
{
	struct student *head=NULL;
	int ch;
	while(1)
	{
		printf("1.add 2.display 3.recursivelist");
		printf("enter u r choice");
		scanf("%d",&ch);
		switch(ch)
		{
			case 1:head=add(head);
			       break;
			case 2:display(head);
			       break;
			case 3:head=recursivelist(head);
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

struct student *recursivelist(struct student *head)
{
if(head->next==NULL)
return head;
recursivelist(head->next);
}
