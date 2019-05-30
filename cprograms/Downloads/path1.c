#include<stdio.h>
#include<stdlib.h>
#include<string.h>
struct node
{
int data;
struct node *next;
};
int length,pos,data1;
struct node *addatend(struct node *first)
{
struct node  *temp=NULL,*p=NULL;
	while(length)
	{
		temp=(struct node *)malloc(sizeof(struct node ));
		printf("enter data\n");
		scanf("%d",&(temp->data));
		temp->next=NULL;
		if(first==NULL)
		{
			first=temp;
			p=first;
		}
		else
		{
			p->next=temp;
			p=p->next;			
		}
		length--;
	}
	return first;
}
void display(struct node *first)
{
        struct node *p;
        if(first==NULL)
        {
                printf("empty all\n");
        }
        p=first;
        while(p!=NULL)
        {
                printf("%d",p->data);
                p=p->next;
        }
}

struct node *finding(struct node *head1,struct node *head2)
{
struct node *p=head2;
int n=0;
	while(head1!=NULL)
	{
		while(p!=NULL)
		{
			if(head1==p)
				{	n=1;
					printf("%p\n",p);
					printf("%p\n",head1);
					printf("%d\n",p->data);
					break;
				}
			else
				{
					p=p->next;
				}
			if(n==1)
				break;
		}
		p=head2;
		head1=head1->next;
	}
return head1;
}
void merge(struct node *head1,struct node *head2)
{

	int i=1;
	if((head1==NULL)||(head2==NULL))
		printf("merge not posssible\n");

	
	else
	{
		while((i!=pos)&&head1->next!=NULL)
		{
		head1=head1->next;
		i++;
		}
		if(i!=pos)
			printf("merge is not possible\n");
		else
		{
			while(head2->next!=NULL)
				head2=head2->next;
			head2->next=head1;
		}
	}
}
void test(int lenth1,int lenth2,int posn)
{ 
	struct node  *head1=NULL,*head2=NULL,*temp1=NULL;
	length=lenth1;
	printf("1st link\n");
	head1=addatend(head1);
	printf("2nd link\n");

	length=lenth2;
	head2=addatend(head2);
	pos=posn;
	merge(head1,head2);
	printf("list1 afterintersection elements\n");
	display(head1);
	printf("\n");
	printf("list2 afterintersection elements\n");
	display(head2);
	printf("\n");
	temp1=finding(head1,head2);
}
int main()
{
 int data1,i=1,nodes,m,l=0;
       	if(i)
	{
			printf("1 case:-1link:5 elements,2link:3elements,posn:2\n");
			test(5,3,2);
		 	printf("2 case:-1link:5elements,2link:3 elements,posn:1\n");
			test(5,3,1);
			 printf("3 case:-1link:5elements,2link:3 elements,posn:5\n");
			test(5,3,5);    
		 	printf("4 case:-1link:0 elements,2link:3 elements,posn:1\n");
			test(0,3,1);
	    
			 printf("5  case:-1link:2elements,2link:3elements,posn:3\n");
			test(2,3,3);
			  printf("6 case:-1link:3elements,2link:0elements,posn:1\n");
		
			test(3,0,1);
			 printf("7 case:-1link:2elements,2link:3 elemets,posn:0\n");
		
			test(2,3,0);
			 printf("8 case:-1link:0lements,2link:0elements,posn:o\n");

			test(0,0,0);
			
		
	}
}
 
