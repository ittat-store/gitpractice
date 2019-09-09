#include<stdio.h>
#include<stdlib.h>
#include<math.h>
#define max1 100000
#define max2 100000
int k=0,top1=-1,top2=-1;
int s1[max1];
int s2[max2];
int n;
void push1(int x)
{
	if(top1==max1-1)
	{
		printf("overflow\n");
	}
	else
	{
		//printf("enter number\n");
		//scanf("%d",&n);
		s1[++top1]=x;
	}
}

int pop1(void)
{
        int d;
	if(top1==-1)
		printf("underflow\n");
        d=s1[top1--];
	printf("poped element is %d\n",d);
        return d;
}

void display1(void)
{
	int i;
	if(top1>0)
	{
		for(i=top1;i>=0;i--)
			printf("element is %d\n",s1[i]);
	}
	else
		printf("stack is empty\n");
}

int empty1()
{
	if(top1<0)
		return 1;
	else
		return 0;
}


void push2(int x)
{
	if(top2==max2-1)
	{
		printf("overflow\n");
	}
	else
	{
		//printf("enter number\n");
		//scanf("%d",&n);
		s2[++top2]=x;
	}
}

int pop2(void)
{
        int d;
	if(top2==-1)
		printf("underflow\n");
        d=s2[top2--];
	printf("poped element is %d\n",d);
        return d;
}

void display2(void)
{
	int i;
	if(top2>0)
	{
		for(i=top2;i>=0;i--)
			printf("element is %d\n",s2[i]);
	}
	else
		printf("stack is empty\n");
}

int empty2()
{
	if(top2<0)
		return 1;
	else
		return 0;
}                     




int main()
{
	int a,c,out,p;
        while(1)
       {
	printf("enter ur choice\n");
	scanf("%d",&c);
	switch(c)
	{
		case 1:printf("push elements\n");
		       scanf("%d",&a);
		       push1(a);
		       break;
		case 2:if(empty2)
		       {
                               //printf("keerthi\n");
			       //while(!empty1)
			      // {
				      printf("keerthi\n");
				       out=pop1();
				       push2(out);
			       //}
		       }
		       else
                             {
			       //printf("keerthi\n");
			       while(!empty2)
				    p=pop2();
                      //printf("keerthi\n");
		      printf("%d\n",p);
                      }

		case 3:printf("stack1 elements are\n");
                       display1();
                       printf("stack2 elements are\n");
                       display1();
                case 4:exit(0);
	}
}
}

