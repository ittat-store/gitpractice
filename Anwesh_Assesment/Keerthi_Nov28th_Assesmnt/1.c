#include<stdio.h>
typedef struct node
{
	int data;
	struct node *left,*right;
}node;
int max=0;
typedef node *tree;
tree find(tree ,int );
int findh(tree );
int main()
{
	tree root,temp,p,c;
	int x,i,n,h;
	scanf("%d%d",&n,&x);
	root=(tree)malloc(sizeof(node));
	root->data=x;
	root->left=NULL;
	root->right=NULL;
	temp=root;
	for(i=0;i<n-1;i++)
	{
		scanf("%d",&x);
		insert(temp,x);
	}
	h=findh(root);
	printf("%d\n",h+1);

}
int findh(tree temp)
{
	int x,y;
	if(temp==NULL)
	{
		return -1;
	}
	else
	{

		x=findh(temp->left);
		y=findh(temp->right);
		if(x>y)
			return x+1;
		else
			return y+1;
	}


}
void inorder(tree temp)
{
	if(temp==NULL)
		return;
	else
	{
		inorder(temp->left);
		printf("%d ",temp->data);
		inorder(temp->right);
	}
}
void insert(temp,x)
{
	tree p,q;
	p=find(temp,x);
	if(p==NULL)
	{
		q=(tree)malloc(sizeof(node));
		q->data=x;
		q->left=NULL;
		q->right=NULL;
	}
	else
	{
		if(p->data<x)
		{
			q=(tree)malloc(sizeof(node));
			p->right=q;
			q->data=x;
			q->left=NULL;
			q->right=NULL;

		}
		else if(p->data>=x)
		{
			q=(tree)malloc(sizeof(node));
			p->left=q;
			q->data=x;
			q->left=NULL;
			q->right=NULL;
		}


	}

}
tree find(tree temp,int x)
{
	if(temp==NULL)
		return temp;
	else
	{
		if(temp->data<x)
		{
			if(temp->right==NULL)
				return temp;
			else
				return find(temp->right,x);
		}
		else
		{
			if(temp->left==NULL)
				return temp;
			else
				return find(temp->left,x);
		}

	}
}
