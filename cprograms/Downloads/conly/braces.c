#include<stdio.h>
#include<stdlib.h>

struct node
{
        char ch;
        struct node* next;
};
int tp;
struct node* push(struct node* h,char c)
{
        struct node* nu=malloc(sizeof(struct node));

        nu->ch=c;
        if(h==NULL)
        {

                h=nu;
                nu->next=NULL;
        }
        else
        {
                nu->next=h;
                h=nu;
        }

        return h;
}


void print_stack(struct node* h)
{
        while(h)
        {
                printf("%c ->",h->ch);
                h=h->next;
        }

}

char pop(struct node**h)
{
        char temp_ch;
        if((*h)==NULL)
                return 0;
        else
        {
                struct node* temp=(*h);
                temp_ch=(*h)->ch;
                (*h)=(*h)->next;
                temp=NULL;

        }

        return temp_ch;

}



int main(int argc, char* argv[])
{
        struct node* h=NULL;
        FILE *fp;
        char ch,ch1;
        int flag=1;

        if(argc<1)
                puts("<aZZut><file name>");
        fp=fopen(argv[1],"r");

        while((ch=fgetc(fp))!=EOF)
        {
           //             printf("%c \n",ch);

                if(ch=='{'||ch=='('||ch=='[')
                        h=push(h,ch);
                // print_stack(h); 
                if(ch=='}'||ch==')'||ch==']')
                {
                        ch1=pop(&h);
                        printf("%c ",ch1);
                        if((ch=='}'&&ch1=='{')||(ch==')'&&ch1=='(')||(ch==']'&&ch1=='[')){
                        }
                        else
                        {
                                flag=0;
                                break;
                        }


                }

        }

        if(flag==1&&h==NULL)
                printf("compilation successful");
        else
                printf("compilation failed");


           }



