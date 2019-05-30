#include<stdio.h>
#include<stdlib.h>
struct student *add(struct student *head);
void display(struct student *head);
struct student *merge(struct student *head,struct student *head1,int,int);
struct student *findmerge(struct student *head,struct student *head1);
struct student
{
	int data;
	struct student *next;
};
struct student *head=NULL,*head1=NULL,*d;
int count=0,n1,n2;
int  pass=0,fail=0;
void create()
{

	int i;
	printf("enter the n and m");
	scanf("%d %d",&n1,&n2);
	for(i=0;i<n1;i++)
	{
		head=add(head);
	}


	for(i=0;i<n2;i++)
	{
		head1=add(head1);
	}
}

int main()
{
	struct student *p=NULL;

	printf("1.merge at first 2.merge at last 3.merge at middle 4.first list is not there 5.second list is not there 6.both lists are not present  7.both heads are pointing to single list\n");
	//test case 1
	create();


	display(head);

	display(head1);

	d=merge(head,head1,0,1);//merging list at second list at starting position

	display(d);
	p=findmerge(head,d);
	printf("%d\n",p->data);
	if(count==1)
		pass++;
	else
		fail++;
	free(head);
	free(head1);
	//free(p);
	head=NULL;
	head1=NULL;
	//	p=NULL;
	//test case 2
	create();



	display(head);

	display(head1);


	d=merge(head,head1,0,2);//merging first list at end of second list
	display(d);
	p=findmerge(head,head1);
	printf("%d\n",p->data);
	if(count==n2+1)
		pass++;
	else
		fail++;

	free(head);
	free(head1);
	//	free(p);
	//	p=NULL;
	head=NULL;
	head1=NULL;
	//test case 3
	create();
	display(head);
	display(head1);
	head1=merge(head,head1,0,3);//merging first list at middle of second list
	display(head1);
	p=findmerge(head,head1);
	printf("%d\n",p->data);

	if((count==n2/2)||(count==n2/2+1))
		pass++;
	else
		fail++;
	free(head);
	free(head1);
	head=NULL;
	head1=NULL;
	//test case 4
	create();
	display(head);
	display(head1);
	head1=merge(head,head1,0,1);//testing if first list is empty
	if(head1==NULL)
		pass++;
	else
		fail++;
	free(head);
	free(head1);
	head=NULL;
	head1=NULL;

	//test case 5
	create();
	display(head);
	display(head1);
	head1=merge(head,head1,0,1);//testing if second list is empty
	if(head1==NULL)
		pass++;
	else
		fail++;
	free(head);
	free(head1);
	head=NULL;
	head1=NULL;

	//test case 6
	create();
	display(head);
	display(head1);
	head1=merge(head,head1,0,1);//testing if both lists are empty
	if(head1==NULL)
		pass++;
	else
		fail++;
	free(head);
	free(head1);
	head=NULL;
	head1=NULL;
	//test case 7
	create();
	display(head);
	display(head1);
	head1=merge(head1,head1,0,1);//tesing if both points to same list
	/*	if(head1==head)
		pass++;
		else
		fail++;*/
	free(head);
	free(head1);
	head=NULL;
	head1=NULL;
	//test case 8
	create();
	display(head);
	display(head1);
	head1=merge(head,head,n1+1,1);//testing if merging value is more than the max length of first list

	printf("pass=%d fail=%d",pass,fail);


}
//  linked list
struct student *add(struct student *head)
{
	struct student *t,*p;
	int data;
	t=p=head;
	if(t==NULL)
	{
		t=malloc(sizeof(struct student));
		printf("enter the datain first ll");
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
		printf("enter the data in first ll");
		scanf("%d",&data);
		p->data=data;
		t->next=p;
		p->next=NULL;
	}
	return head;
}


void display(struct student *head)
{
	if(head==NULL)
		printf("list is empty");
	else
	{
		while(head->next!=NULL)
		{
			printf("%d\t",head->data);
			head=head->next;
		}
		printf("%d\t",head->data);
		printf("\n");
	}
}


struct student *merge(struct student *head,struct student *head1,int m,int n)
{
	int i;
	struct student *temp,*q,*p,*s,*u;
	p=temp=head1;
	if(m>n1)
	{
		while(head!=NULL)
		{
			head=head->next;
			i++;
		}
		if(m>i)
			pass++;
		return head;
	}
	if((head==NULL)&&(head1==NULL))
	{
		printf("two lists are empty\n");
		return head;
	}

	else if((head==NULL))
	{
		printf("linked list one is empty\n");
		return head;
	}
	else if(head1==NULL)
	{
		printf("linked list two is empty\n");
		return head1;
	}
	else if((head==NULL)&&(head1==NULL))
	{
		printf("two lists are empty\n");
		return head;
	}
	else if((head==head1))
	{
		printf("both are pointing to same linked list");
		pass++;
		return head;
	}
	else{
		if(n==1)
		{
			for(i=0;(i<=m-1)&&(head!=NULL);i++,head=head->next);
			q=head;
			temp=q;
			while(temp->next!=NULL)
				temp=temp->next;

			temp->next=p;
			return q;
		}

		if(n==2)
		{
			for(i=0;(i<=m-1)&&(head!=NULL);i++,head=head->next);
			p=head;
			while(temp->next!=NULL)
				temp=temp->next;
			temp->next=p;
			return head1;
		}
		if(n==3)
		{
			for(i=0;(i<=m-1)&&(head!=NULL);i++,head=head->next);
			u=head;

			while((temp!=NULL)&&(p->next!=NULL))
			{
				q=temp;
				temp=temp->next;
				s=temp;
				p=p->next->next;
				if(p==NULL)
					break;
			}
			q->next=u;
			while(q->next!=NULL)
				q=q->next;
			q->next=s;
			return head1;
		}
	}
}
struct student *findmerge(struct student *head,struct student *head1)
{
	struct student *p=head1;
	int i=0;
	if(head==NULL)
		printf("1 st linked list is empty so no common merge point\n");

	else
	{

		while(head!=NULL)
		{
			count=0;
			while(p!=NULL)
			{
				if(p==head)
				{ i=1;
					count++;
					//printf("%p\n",p);
					//printf("%p\n",head);
					return p;
					break;
				}
				else
				{
					count++;
					p=p->next;
				}
			}
			if(i==1)
				break;
			p=head1;
			head=head->next;
		}

	}
	return 0;
}
