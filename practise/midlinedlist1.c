#include<stdio.h>
#include<stdlib.h>
struct student
{
	int data;
	struct student *next;
};
struct student *add(struct student *head);
void display(struct student *head);
struct student *reverse(struct student *head);
int main()
{
	struct student *head=NULL;
	int ch;
	while(1)
	{
		printf("1.add 2.display 3.reverse");
		printf("enter u r choice");
		scanf("%d",&ch);
		switch(ch)
		{
			case 1:head=add(head);
			       break;
			case 2:display(head);
			       break;
			case 3:head=reverse(head);
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
			printf("%d",head->data);
			head=head->next;
		}
	}
}

struct student *reverse(struct student *head)
{
	struct student *t,*q,*n=0,*p=0,*c,*s;
	t=q=head;
	while((t)&&(q->next)!=NULL)
	{
		t=t->next;
		q=q->next->next;
		if(q==NULL)
			break;
	}
		printf("%d\n",t->data);
	s=q;
	p=t;
	t=q=head;
	while((t)&&(q->next)!=NULL)
	{
		q=q->next->next;
		//if(q==NULL)
		//break;
		c=t;
		n=t->next;
		t->next=p;
		p=t;
		t=n;
		if(q==NULL)
			break;
	}
	head=c;
	q=t->next;
	printf("%d",q->data);

	t->next=s;
	p=0;
	//q=q->next;
	//printf("%d",q->data);
	while(q!=NULL)
	{
		n=q->next;
		q->next=p;
		p=q;
		q=n;
	}
	return head;

}


