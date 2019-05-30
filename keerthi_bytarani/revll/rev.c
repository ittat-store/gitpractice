#include<stdio.h>
#include<stdlib.h>
typedef struct student
{
	int data;
	struct student *next;
}a;
int n,c;
a* createnode();
void traverse(a *head);
a* reverse(a *head);
a* find_middle(a *head);
void break_list1(a *head,a *mid);
a* break_list2(a *mid);
a* merge(a *head,a *head1,a *mid);
int main()
{
	a *head=NULL,*node=NULL,*p=NULL,*mid=NULL,*list1=NULL,*head1=NULL;
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
	printf("linked list is\n");
	traverse(head);
	printf("\n");
	if(n%2!=0 && n>2)
	{
		mid=find_middle(head);
		
		break_list1(head,mid);
		printf("after breaking list1\n");
		traverse(head);
		head=reverse(head);
		printf("\n");
		printf("after reversing list1\n");
		traverse(head);
		printf("\n");

		
		head1=break_list2(mid);
		printf("after reversing list2\n");
		traverse(head1);
		printf("\n");
		head1=reverse(head1);
		printf("after reversing list2\n");
		traverse(head1);
		printf("\n");

		
		head=merge(head,head1,mid);
		printf("after merging\n");
		traverse(head);
		printf("\n");

	}
	else if(n%2==0 && n>2)
	{
		mid=find_middle(head);
		printf("even middle %d\n",mid->data);

		head1=break_list2(mid);
                printf("after breaking and reversing second half\n");
                head1=reverse(head1);
                traverse(head1);
                printf("\n");

		break_list1(head,mid);
		printf("after breaking and reversing first half\n");
		head=reverse(head);
		traverse(head);
		printf("\n");

		printf("after merging\n");
		head=merge(head,head1,0);
		traverse(head);
		printf("\n");

	}
	free(head);
	head=NULL;
}
a* createnode()
{
	a* node=(a *)malloc(sizeof(a));
	printf("enter data to be inserted\n");
	scanf("%d",&node->data);
	node->next=NULL;
	return node;
}
void traverse(a *head)
{
	a *p=head;
	while(p!=NULL)
	{
		printf("%d\t",p->data);
		p=p->next;
	}
}
a* reverse(a *head)
{
	a *n=head,*p=head,*c=head;
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
a* find_middle(a *head)
{
	a *f=head,*s=head;
	while(f->next!=NULL && f!=NULL)
	{
		if(f->next->next==NULL)
		{
		
			break;
		}
	
		f=f->next->next;
		s=s->next;
	}
	printf("middle element %d\n",s->data);
	return s;
}
void break_list1(a *head,a *mid)
{
	a *list1=head;
	while(list1->next!=mid)
		list1=list1->next;
	if(n%2!=0)
	list1->next=NULL;
	else 
		list1->next->next=NULL;
}
a* break_list2(a *mid)
{
	a *head1=mid->next;
	return head1;
}
a* merge(a *head,a *head1,a *mid)
{
	a *p=head;
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







			
