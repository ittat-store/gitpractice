#include<stdio.h>
#include<stdlib.h>
//void addatend(struct **,char );
//void display(struct  **);
//void newfunc(struct **,int );
struct node
{
	char s;
        struct node *next;
};
//void addatend(struct node **,char );
//void display(struct node **);
//void newfunc(struct node **,int );
int main()
{
        char f[6]={'A','B','C','D','E','C'};
        int n,g,i=0;
	struct node *p=NULL;
        //printf("how many nodes you need\n");
        //scanf("%d",&g);
        printf("enter the characters to insert\n");
        /*
        while(i<g)
        {
        scanf("%c",&f);
        addatend(&p,f);
        i++;
        }
        */
        addatend(&p,f[0]);
        addatend(&p,f[1]);
        addatend(&p,f[2]);
        addatend(&p,f[3]);
        addatend(&p,f[4]);
        addatend(&p,f[5]);
        display(&p);
        printf("enter the nth element\n");
        scanf("%d",&n);
        
        newfunc(&p,n);
        
}
void addatend(struct node **q,char c)
{
	struct node *temp=NULL;
        temp=(struct node *)malloc(sizeof(struct node));
        if(*q==NULL)
        {
              printf("no linked list exists this is the first node \n");
              *q=temp;
              temp->next=NULL;
              temp->s=c; 
        }
        else
	{
              struct node *ptr=NULL;
              ptr=*q;
              while(ptr->next!=NULL)
              {
                     ptr=ptr->next;
              }
              ptr->next=temp;
              temp->s=c;
              temp->next=NULL;
	}


}
void display(struct node **q)
{
	struct node *temp=NULL;
        temp=*q;
        while(temp!=NULL)
        {
              printf("%c\n",temp->s);
              temp=temp->next;
        }
}
void newfunc(struct node **q,int b)
{
	struct node *ptr=NULL;
        int u=1;
        ptr=*q;
        while(ptr->next!=NULL)
        {
              u++;
              ptr=ptr->next;
              if(b==u)
              {
                 break;
              }
        }
        display(&ptr);

}

