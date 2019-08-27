#include<stdio.h>
#include<stdlib.h>

struct stack
{
        char data;
        struct stack* next;
};
struct stack* push(struct stack* head,char c)
{
        struct stack* nu=malloc(sizeof(struct stack));

        nu->data=c;
        if(head==NULL)
        {

                head=nu;
                nu->next=NULL;
        }
        else
        {
                nu->next=head;
                head=nu;
        }

        return head;
}


char pop(struct stack**head)
{
        char temp_data;
        if((*head)==NULL)
                return 0;
        else
        {
                struct stack* temp=(*head);
                temp_data=(*head)->data;
                (*head)=(*head)->next;
                temp=NULL;

        }

        return temp_data;

}



int main(int argc, char* argv[])
{
        struct stack* head=NULL;
        FILE *fp;
        char ch,ch1;
        int flag=1;

        if(argc<1)
                puts("error");
        fp=fopen(argv[1],"r");

        while((ch=fgetc(fp))!=EOF)
        {
           //             printf("%c \n",ch);

                if(ch=='{'||ch=='('||ch=='[')
                        head=push(head,ch);
                // print_stack(h); 
                if(ch=='}'||ch==')'||ch==']')
                {
                        ch1=pop(&head);
                        //printf("%c ",ch1);
                        if((ch=='}'&&ch1=='{')||(ch==')'&&ch1=='(')||(ch==']'&&ch1=='[')){
                        }
                        else
                        {
                                flag=0;
                                break;
                        }


                }

        }

        if(flag==1&&head==NULL)
                printf("compilation successful");
        else
                printf("compilation failed");


           }



