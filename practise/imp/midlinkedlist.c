#include<stdio.h>
#include<stdlib.h>
typedef struct student
{
	int data;
	struct student *next;
}st;
int n;
st* createnode();
void display(st *head);
st* reverse(st *head);
st* find_middle(st *head);
void break_list1(st *head,st *mid);
st* break_list2(st *mid);
st* merge(st *head,st *head1,st *mid);
st* createnode()
{
	st* node=(st *)malloc(sizeof(st));
	printf("enter data to be inserted\n");
	scanf("%d",&node->data);
	node->next=NULL;
	return node;
}
void display(st *head)
{
	st *p=head;
	while(p!=NULL)
	{
		printf("%d\t",p->data);
		p=p->next;
	}
}
st* reverse(st *head)
{
	st *n=head,*p=head,*c=head;
	if(head->next!=NULL)
	{
		c=c->next;
		if(c->next!=NULL)
		{
			n=c->next;
			while(c!=NULL)
			{
				c->next=p;
				p=c;
				c=n;
				if(n!=NULL)
					n=n->next;
			}
			head->next=NULL;
			head=p;
		}
		else 
		{
			c->next=p;
			head=c;
			p->next=NULL;
		}
	}
	return head;
}
st* find_middle(st *head)
{
	st *f=head,*s=head;
	while(f->next!=NULL && f!=NULL)
	{
		if(f->next->next==NULL)
			break;
		f=f->next->next;
		s=s->next;
	}
	printf("middle element %d\n",s->data);
	return s;
}
void break_list1(st *head,st *mid)
{
	st *list1=head;
	while(list1->next!=mid)
		list1=list1->next;
	if(n%2!=0)
		list1->next=NULL;
	else
		list1->next->next=NULL;
}
st* break_list2(st *mid)
{
	st *head1=mid->next;
	return head1;
}
st* merge(st *head,st *head1,st *mid)
{
	st *p=head;
	while(p->next!=NULL)
		p=p->next;
	if(mid!=0)
	{
		p->next=mid;
		mid->next=head1;
	}
	else if(mid==0)
	{
		p->next=head1;
	}
	return head;
}


int main()
{
	st *head=NULL,*node=NULL,*p=NULL,*mid=NULL,*list1=NULL,*head1=NULL;
	int i,m;
	printf("enter number of elements to be inserted\n");
	scanf("%d",&n);
	for(i=0;i<n;i++)
	{
		node=createnode();
		if(head==NULL)
		  {
		  head=node;
		  p=node;
		  }
		  else
		  {
		  p->next=node;
		  p=p->next;
		  }
	}
	printf("\n");
	if(n%2!=0)
	{
		mid=find_middle(head);

		break_list1(head,mid);
		head=reverse(head);
		printf("\n");
		printf("after reversing list1\n");
		display(head);
		printf("\n");
		head1=break_list2(mid);

		head1=reverse(head1);
		printf("after reversing list2\n");
		display(head1);
		printf("\n");


		head=merge(head,head1,mid);
		printf("after merging\n");
		display(head);
		printf("\n");

	}
	else if(n%2==0)
	{
		mid=find_middle(head);
		printf("even middle %d\n",mid->data);

		head1=break_list2(mid);
		printf("after breaking and reversing second half\n");
		head1=reverse(head1);
		display(head1);
		printf("\n");

		break_list1(head,mid);
		printf("after breaking and reversing first half\n");
		head=reverse(head);
		display(head);
		printf("\n");

		printf("after merging\n");
		head=merge(head,head1,0);
		display(head);
		printf("\n");

	}
	free(head);
	head=NULL;
}






