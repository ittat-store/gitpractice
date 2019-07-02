#include<stdio.h>
#include<stdlib.h>
struct node
{
	int info;
	struct node *link;
};
int even=0;
int odd=0;
int addcount;

void display(struct node *start)
{
	struct node *p;
	if(start==NULL)
	{
		printf("empty ll\n");
	}
	p=start;
	while(p!=NULL)
	{
		printf("%d",p->info);
		p=p->link;
	}
}


struct node *reverse(struct node *start)
{
	struct node *ptr,*prev,*next;
	prev=NULL;
	ptr=start;
	while(ptr!=NULL)
	{
		next=ptr->link;
		ptr->link=prev;
		prev=ptr;
		ptr=next;
	}
	start=prev;
	return start;
}

struct node *middle(struct node *start)
{
struct node *f=start,*s=start;
while(f->link!=NULL && f!=NULL)
	{
		if(f->link->link==NULL)
			break;
		f=f->link->link;
		s=s->link;
	}
	printf("middle element %d\n",s->info);
	return s;
}

struct node *add(struct node *start,int data)
{
	struct node *temp;
	temp=(struct node *)malloc(sizeof(struct node));
	temp->info=data;
	temp->link=start;
	start=temp;
	return start;
}

struct node *addatend(struct node *start,int data)
{
	struct node *p,*temp;
	temp=(struct node*)malloc(sizeof(struct node));
	temp->info=data;
	p=start;
	while(p->link!=NULL)
		p=p->link;
	p->link=temp;
	temp->link=NULL;
	return start;
}


void break1(struct node *start,struct node *mid)
{
	struct node *list1=start;
	while(list1->link!=mid)
		list1=list1->link;
	if(addcount%2!=0)
	list1->link=NULL;
	else
		list1->link->link=NULL;
}
struct node *break2(struct node *mid)
{
	struct node *head1=mid->link;
	return head1;
}
struct node * merge(struct node *start,struct node *head1,struct node *mid)
{
	struct node *p=start;
	while(p->link!=NULL)
		p=p->link;
	if(mid!=0)
	{
		p->link=mid;
		mid->link=head1;
	}
	else if(mid==0)
	{
		p->link=head1;
	}
	return start;
}





int main()
{
	int data,i=1;
	struct node *start=NULL,*mid=NULL,*list1=NULL,*head1=NULL;
	//int addcount;
	printf("enter addcount\n");
	scanf("%d",&addcount);
	printf("element to be insert\n");
	scanf("%d",&data);
	start=add(start,data);
	//display(start);
	while(i<=(addcount-1))
	{
		printf("element to be insert\n");
		scanf("%d",&data);
		start=addatend(start,data);
		i++;
	}
	display(start);
        if(addcount%2!=0 && addcount>1)
	{
		mid=middle(start);
		
		break1(start,mid);
		printf("after breaking list1\n");
		display(start);
		start=reverse(start);
		printf("\n");
		printf("after reversing list1\n");
		display(start);
		printf("\n");

		
		head1=break2(mid);
		printf("after reversing list2\n");
		display(head1);
		printf("\n");
		head1=reverse(head1);
		printf("after reversing list2\n");
		display(head1);
		printf("\n");

		
		start=merge(start,head1,mid);
		printf("after merging\n");
		display(start);
		printf("\n");

	}
	else if(addcount%2==0 && addcount>1)
	{
		mid=middle(start);
		printf("even middle %d\n",mid->info);

		head1=break2(mid);
                printf("after breaking and reversing second half\n");
                head1=reverse(head1);
                display(head1);
                printf("\n");

		break1(start,mid);
		printf("after breaking and reversing first half\n");
		start=reverse(start);
		display(start);
		printf("\n");

		printf("after merging\n");
		start=merge(start,head1,0);
		display(start);
		printf("\n");

	}
	free(start);
	start=NULL;
}        
