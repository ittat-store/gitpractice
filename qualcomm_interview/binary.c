/* (2) Write a program to binary to Decimal in single linked list */

#include<stdio.h>
#include<stdlib.h>


struct student
{
	int roll;
	struct student *next;
};

typedef struct student ST;
void add_end(ST **);
void binary_dec(ST **);
int main()
{
	int count = 0,num;
	ST *hptr = 0;
	char ch;
	do{
		add_end(&hptr);
		printf("if you want to add another node : y/n\n");
		scanf(" %c",&ch);
		count++;
	}while((ch == 'y') || (ch == 'Y'));
	binary_dec(&hptr);
	return 0;
}

void add_end(ST **ptr)
{
	ST *temp;
	temp = (ST*)malloc(sizeof(ST));
	printf("enter the node\n");
	scanf("%d",&temp->roll);

	if(*ptr == NULL)
	{
		temp->next = *ptr;
		*ptr = temp;
	}
	else
	{
		ST *temp1 = *ptr;
		while(temp1->next != NULL)
			temp1 = temp1->next;
		temp->next = temp1->next;
		temp1->next = temp;
	}
}

void binary_dec(ST **ptr)
{
	int dec = 0;
	ST *temp = *ptr;
	while(temp != NULL)
	{
		dec = (dec<<1) + temp->roll;
		temp = temp->next;
	}
	printf("dec = %d\n",dec);
}



