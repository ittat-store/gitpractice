#include<stdio.h>
#include<stdlib.h>
struct node
{
	int info;
	struct node *link;
};
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


struct node  *call(struct node *start)
{
        int data,i=1;
        printf("enter addcount\n");
        scanf("%d",&addcount);
        printf("element to be insert\n");
        scanf("%d",&data);
        start=add(start,data);
        while(i<=(addcount-1))
        {
                printf("element to be insert\n");
                scanf("%d",&data);
                start=addatend(start,data);
                i++;
        }
        display(start);
        printf("\n");
   return start; 
}

struct node *search(struct node *start,int joinposi)
{
int pos;
struct node *p=NULL;
p=start;
pos=1;
while(p->link!=NULL && pos<joinposi)
{
p=p->link;
pos++;
}
printf("data is nd pos is %d,%d\n",p->info,pos);
return p;
}

struct node *merge(struct node *start1,struct node *joinadd)
{
struct node *head2=start1;
while(head2->link!=NULL)
head2=head2->link;
head2->link=joinadd;
return start1;
}

struct node *intersection(struct node *headA,struct node *headB)
{
 struct node *tempB=NULL;
    tempB=headB;
   while(headA->link!=NULL)
       {
       while(tempB->link!=NULL)
           {
           if(tempB==headA)
           {
            // printf("intersection data is %d\n",headA->info);
               return tempB;
           }
           tempB=tempB->link;
       }
       headA=headA->link;
       tempB=headB;
   }
   //printf("intersection data is %d\n",headA->info);
  return headA;
}



int main()
{
	int data,i=1,joinposi;
	struct node *start=NULL,*start1=NULL;
        struct node *updatelink=NULL,*section=NULL,*joinadd=NULL;
	start=call(start);
        start1=call(start1);
        printf("enter position of l1 to join l2\n");
        scanf("%d",&joinposi);
        joinadd=search(start,joinposi);
        printf("joinadd %p\n",joinadd->link);
        updatelink=merge(start1,joinadd);
        display(updatelink);
        printf("\n");
        display(start);
        printf("\n");
        display(start1);
        printf("\n");
        section=intersection(start,updatelink);
        printf("intersection data is %d\n",section->info);
    
}

