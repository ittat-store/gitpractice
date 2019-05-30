#include<stdio.h>
#include<stdlib.h>
struct student
{
	int data;
	struct student *next;
};
struct student *add(struct student *head);
void display(struct student *head);
struct student * mergeascending(struct student *head,struct student *head1);
struct student * mergedescending(struct student *head,struct student *head1);
int main()
{
	struct student *head=NULL,*head1=NULL;
	int ch;
	while(1)
	{
		printf("1.add 2.add2 3.display 4.display2 5 mergeascending 6.mergedescending  7.exit\n");
		printf("enter u r choice\n");
		scanf("%d",&ch);
		switch(ch)
		{
			case 1:head=add(head);
			       break;
			case 2:head1=add(head1);
			       break;
			case 3:display(head);
			       break;
			case 4:display(head1);
			       break;
			case 5:head=mergeascending(head,head1);
			       printf("to print merge list choose 3\n");
			       break;
			case 6:head=mergedescending(head,head1);
			       printf("to print merge list choose 3\n");
			       break;
			case 7:exit(0);
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
		printf("list is empty\n");
	else
	{
		while(head!=NULL)
		{
			printf("%d\t",head->data);
			head=head->next;
		}
	}
}

struct student * mergeascending(struct student *head,struct student *head1)
{
	struct student *temp=head,*prev=head,*prev1,*temp1;
	if(((head==NULL) && (head1==NULL)))
	{
		printf("two linked list nodes are not present\n");
		return 0;
	}
	else if(head==NULL)
		return head1;
	else if(head1==NULL)
		return head;

	else
	{
		if(temp->data>head1->data)
		{
			prev=head1;
			head1=head1->next;
			prev->next=temp;
			head=prev;
			temp=prev->next;


		}
//		prev=NULL;
		while(((temp!=NULL) && (head1!=NULL)))
		{
			if(temp->data<head1->data)
			{
				prev=temp;
				temp=temp->next;
			}
			else
			{
				prev1=head1;
				head1=head1->next;
				temp1=prev->next;
				prev->next=prev1;
				prev1->next=temp1;

				temp=prev->next;
			}
		}
		if(temp==NULL)
		{
			if(head1!=NULL)
			{
				prev->next=head1;
			}
		}

	}
	return head;
}
struct student * mergedescending(struct student *head,struct student *head1)
{
	struct student *temp=head,*prev=head,*prev1,*temp1;
	if(((head==NULL) && (head1==NULL)))
	{
		printf("two linked list nodes are not present\n");
		return 0;
	}
	else if(head==NULL)
		return head1;
	else if(head1==NULL)
		return head;

	else
	{
		if(temp->data<head1->data)
		{
			prev=head1;
			head1=head1->next;
			prev->next=temp;
			head=prev;
			temp=prev->next;
		}
	//	prev=NULL;
		while(((temp!=NULL) && (head1!=NULL)))
		{
			if(temp->data>head1->data)
			{
				prev=temp;
				temp=temp->next;
			}
			else
			{
				prev1=head1;
				head1=head1->next;
				temp1=prev->next;
				prev->next=prev1;
				prev1->next=temp1;
				temp=prev->next;
			}
		}
		if(temp==NULL)
		{
			if(head1!=NULL)
			{
				prev->next=head1;
			}
		}

	}
	return head;
}
