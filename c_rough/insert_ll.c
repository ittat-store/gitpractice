#include<stdio.h>
#include<stdlib.h>

struct node 
{
	int data;
	struct node *link;
};

struct node *addend(struct node *head)
{
	struct node *temp,*p=NULL;
	int ele;
	temp=(struct node *)malloc(sizeof(struct node));
	printf("enter data\n");
	scanf("%d",&ele);
	temp->data=ele;
	temp->link=NULL;
	p=head;
	while(p->link!=NULL)
		p=p->link;
	p->link=temp;
	return head;
}

void display(struct node *head)
{
	struct node *p;
	printf("head is in display %d\n",head);
	if(head==NULL)
		printf("list is empty\n");
	p=head;
	while(p!=NULL)
	{
		printf("%d \n",p->data);
		p=p->link;
	}
}


struct node  *addfront(struct node *head)
{

	struct node *temp,*p=NULL;
	int ele;
	temp=(struct node *)malloc(sizeof(struct node));
	printf("enter data\n");
	scanf("%d",&ele);
	temp->data=ele;
	temp->link=NULL;
	head=temp;
	return head;

}

struct node *create(struct node *head)
{
	int n,i;

	head=addfront(head);
	printf("head is %d\n",head);
	printf("enter n\n");
	scanf("%d",&n);
	for(i=2;i<=n;i++)
		head=addend(head);
	printf("head is %d\n",head);
	return head;
}


void delete()
{
}

void atposition()
{
}

main()
{
	while(1)
	{
		int a;
		struct node *head=NULL;
		printf("1.create 2.atposition 3.delete 4.display\n");
		printf("enter choice \n");
		scanf("%d",&a);
		switch(a)
		{
			case 1: head=create(head);
				printf("head is in case %d\n",head);
				break;
			case 4: printf("head before %d \n",head);
				display(head);
			        printf("head is in case display %d\n",head);
			        break;
		}
	}
}
