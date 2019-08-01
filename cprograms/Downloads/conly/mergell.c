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

void dointersection(struct node *head1,struct node *head2,int pos2)
{       int i=1,n,j;
	if((head1==NULL)||(head2==NULL))
		printf("intersection is not possible\n");
	else{
		while((i!=pos)&&(head1->link!=NULL))
		{
			head1=head1->link;
			i++;
		}
		if(i!=pos)
			printf("intersection is not possible\n");
		else
		{
                 for(j=1;j<pos2 && head2->link!=NULL;j++)
                  { 
                        head2=head2->link;
			//while(head2->link!=NULL)
		
                   }		//head2=head2->link;
			head2->link=head1;
		}
	}
}


struct node *intersection(struct node *headA,struct node *headB)
{
	struct node *tempB=NULL;
	tempB=headB;
	while(headA!=NULL)
	{
		while(tempB!=NULL)
		{
			if(tempB==headA)
				return tempB;
			tempB=tempB->link;
		}
		headA=headA->link;
		tempB=headB;
	}
	return headA;
}

void testcases(int addcount1,int addcount2,int pos1,int pos2)
{
	struct node *start=NULL,*start1=NULL,*temp1=NULL;
        addcount=addcount1;	
        start=create(start);
        display(start);
        addcount=addcount2;
	start1=create(start1);
        display(start1);
        pos=pos1;
	dointersection(start,start1,pos2);
        printf("l1 afterintersection \n");
        display(start);
        printf("l2 afterintersection\n");
        display(start1);
        temp1=intersection(start,start1);
        if(temp1)
        printf("node=%d\n",temp1->info);
        else
        printf("lists are not merged\n");
}                                

int main()
{
 	int i=1;
	if(i)
	{
               /* printf("1.intersect at 1st node\n");
		testcases(5,3,1,3);
                printf("2.list1 is empty\n");
		testcases(0,3,1,3);
		printf("pos is greterthan length of list1\n");
		testcases(2,3,3,3);
		printf("list2 is empty\n");
		testcases(3,0,1,0);
		printf("intersect at last node\n");
		testcases(3,2,3,2);*/
		printf("intersect at middle\n");
		testcases(4,2,2,1);
		printf("both lists are empty\n");
		testcases(0,0,1,0);
		printf("position is 0\n");
		testcases(2,3,0,3);
		printf("all zeros\n");
		testcases(0,0,0,0);
		printf("length<length\n");
		testcases(1,5,1,5);
	
	}
}

