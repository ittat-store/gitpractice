#include<stdio.h>
#include<stdlib.h>

struct node
{
	int x,y,sum;
	struct node *link;
};




void search(struct node *head)
{
	struct node *temp;
        int count=0;
	if(head==NULL)
	{
		printf("list is empty\n");
	}
	else
	{
	        for(;head!=NULL;head=head->link)
                {
			temp=head->link;
		for(;temp!=NULL;temp=temp->link)
		{
			if(head->sum==temp->sum)
			{
				count++;
				printf("sum=%d pair is %d %d \n",head->sum,head->x,head->y);
				printf("sum=%d pair is %d %d \n",temp->sum,temp->x,temp->y);
				printf(".........\n");
			}
	
        	}
                } 
       }
	if(count==0)
		printf("their is no pair found\n");
       printf("number of pairs are %d\n",count);
}

struct node *create(struct node *head,int a,int b)
{
	struct node *temp=head,*p;
	if(head==NULL)
	{
		temp=malloc(sizeof(struct node));
		temp->x=a;
		temp->y=b;
		temp->sum=a+b;
		temp->link=NULL;
		head=temp;
	}
	else
	{
		while(temp->link!=NULL)
			temp=temp->link;
			p=malloc(sizeof(struct node));
			p->x=a;
			p->y=b;
			p->sum=a+b;
			p->link=NULL;
			temp->link=p;    			
	}
	return head;
}

int main()
{
	struct node *head=NULL;
	int i,j;
	int n;
	printf("enter size of an array\n");
	scanf("%d",&n);
	int a[n];
        printf("enter elements with distinct integers\n");
	for(i=0;i<n;i++)
		scanf("%d",&a[i]);
        printf("\n");
	for(i=0;i<n;i++)
	{
		for(j=i+1;j<n;j++)
		{
			head=create(head,a[i],a[j]);
		}
       }
		search(head);
}
