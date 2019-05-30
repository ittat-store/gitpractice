#include<stdio.h>
#include<stdlib.h>
struct st
{
	char ch;
	int count;
	struct st *next;
};
struct st *create(struct st *head,char ch);
void display(struct st *head);
void incre(struct st *head,char ch,int c);
void counting(struct st *head);
int main(int argc,char **argv)
{
	FILE *fp;
	char ch;
	int i=0,j,k,o=0,m=0;
	struct st *head=NULL;
	fp=fopen(argv[1],"r");
	(void)fseek(fp,0,SEEK_END);
	int r=ftell(fp);
	char *buf=malloc(r*sizeof(char));
	char *buf1=malloc(r*sizeof(char));
	rewind(fp);
	while( (ch=fgetc(fp))!=EOF)
	{
		buf[i++]=ch;
	}
	for(k=0,j=i-1;j>=0;j--,k++)
	{
		buf1[k]=buf[j];
	}
	fclose(fp);
	i=0;
	while(i<6)
	{
		if(i==0)
		{
			head=create(head,'{');
			i++;
		}
		else if(i==1)
		{
			head=create(head,'}');
			i++;
		}
		else if(i==2)
		{
			head=create(head,'(');
			i++;
		}
		else if(i==3)
		{
			head=create(head,')');
			i++;
		}
		else if(i==4)
		{
			head=create(head,'[');
			i++;
		}
		else if(i==5)
		{
			head=create(head,']');
			i++;
		}
	}
	//display(head);
	fp=fopen(argv[1],"r");
	j=0,k=1;
	int s=1,c=0,d=0;
	while((ch=fgetc(fp))!=EOF)
	{
		if(ch=='{')
		{
			incre(head,'{',1);
			for(i=j;i<=r/2;i++,j++)
			{
				if(buf1[i]=='}')
				{
					incre(head,'}',1);
					j++;
					break;
				}
			}
		}
		else if(ch=='[')
		{
o++;
			incre(head,'[',1);
			for(i=k;i<=r;i++,k++)
			{
				if(buf1[i]==']')
				{
m=0;
while(i<o)
{
 if(buf1[i++]==')' ||buf1[i++]=='}')
                                                                m++;
                                                        if(buf1[i++]!='(' ||buf1[i++]!='{');
                                                }
                                                if(buf1[--i]=='('|| buf1[--i]=='{')
                                                        break;
                                                else if(buf1[--i]=='('||buf1[--i]=='{' &&d!=0)
                                                {
                                                        incre(head,']',1);
                                                        break;
                                                }
                                                else

					incre(head,']',1);
					k++;
					break;
				}
			}
		}

		else if(ch=='(')
		{
			c++;
			incre(head,'(',1);
			for(i=s;i<=r;i++,s++)
			{
				if(buf1[i]==')')
					d=0;			{
						while(i<c)
						{
							if(buf1[i++]==']' ||buf1[i++]=='}')
								d++;
							if(buf1[i++]!='[' ||buf1[i++]!='{');
						}
						if(buf1[--i]=='['|| buf1[--i]=='{')
							break;
						else if(buf1[--i]=='['||buf1[--i] &&d!=0)
						{
							incre(head,')',1);
							break;
						}
						else
							incre(head,')',1);
						s++;
						break;
					}
			}
		}
	}
	display(head);
	counting(head);
}
struct st *create(struct st *head,char ch)
{
	struct st *t,*p;
	t=head;
	if(t==NULL)
	{
		t=malloc(sizeof(struct st));
		t->count=0;
		t->ch=ch;
		t->next=NULL;
		head=t;
	}
	else
	{
		while(t->next!=NULL)
			t=t->next;
		p=malloc(sizeof(struct st));
		p->count=0;
		p->ch=ch;
		p->next=NULL;
		t->next=p;
	}

	return head;
}

void display(struct st *head)
{
	if(head==NULL)
		printf("list is empty");
	else
	{
		while(head!=NULL)
		{
			printf("%c ",head->ch);
			printf("%d",head->count);
			head=head->next;
		}
	}
}
void incre(struct st *head,char ch,int c)
{
	if(head==NULL)
		printf("list is empty");
	else
	{
		while(head!=NULL)
		{
			if(head->ch==ch)
			{
				head->count+=c;
				head=head->next;
			}
			else if(head->ch==ch)
			{
				head->count+=c;
				head=head->next;
			}
			else if(head->ch==ch)
			{
				head->count+=c;
				head=head->next;
			}
			else if(head->ch==ch)
			{
				head->count+=c;
				head=head->next;
			}
			else if(head->ch==ch)
			{
				head->count+=c;
				head=head->next;
			}
			else if(head->ch==ch)
			{
				head->count+=c;
				head=head->next;
			}
			else
				head=head->next;
		}
	}
}
void counting(struct st *head)
{
	if((head->count==head->next->count) && (head->next->next->count==head->next->next->next->count) && (head->next->next->next->next->count==head->next->next->next->next->next->count))
		printf("compilation sucessfull");
	else
		printf("compilation failed");
}
