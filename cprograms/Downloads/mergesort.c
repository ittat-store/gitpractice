#include<stdio.h>
#include<stdlib.h>
struct node
{
	int info;
	struct node *link;
};
int addcount,pos;       

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

struct node *create(struct node *head)
{
	struct node *ltemp=NULL,*p=NULL;
	while(addcount)
	{
		ltemp=(struct node *)malloc(sizeof(struct node));
		printf("enter data\n");
		scanf("%d",&(ltemp->info));
		ltemp->link=NULL;
		if(head==NULL)
		{
			head=ltemp;
			p=head;
		}
		else
		{
			p->link=ltemp;
			p=p->link;			
		}
		addcount--;
	}
	return head;
}


struct node *mergesort(struct node *start1,struct node *start2)
{
	struct node *p=start1,*q=start2,*temp1=NULL,*temp=NULL;
	if(p==NULL)
		return q;
	if(q==NULL)
		return p;
	if(p&&q)
	{
		if((p->info)<=(q->info))
		{ 
			temp=p;
			p=p->link;
		
		}
		else
		{
			temp=q;
			q=q->link;
		
		}
	}
	while(p&&q)
	{
		if(p->info<=q->info)
		{
			temp->link=p;
			temp=p;
			p=temp->link;
		}
		else
		{
			temp->link=q;
			temp=q;
			q=temp->link;
		}
	}
	if(p==NULL)
		temp->link=q;
	if(q==NULL)
		temp  ->link=p;
	return temp;
}






int main()
{
	struct node *start1=NULL,*start2=NULL,*merge=NULL;
	int addcount1,addcount2;
	printf("enter addcount1\n");
	scanf("%d",&addcount1);	
	addcount=addcount1;
	start1=create(start1);
	display(start1);
	printf("\n");
	printf("enter addcount2\n");
	scanf("%d",&addcount2);
	addcount=addcount2;
	start2=create(start2);
	display(start2);
	printf("\n");
	merge=mergesort(start1,start2);
	display(merge);
	return 0;
}

    
