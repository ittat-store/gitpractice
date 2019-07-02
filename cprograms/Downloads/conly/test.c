#include<stdio.h>
#include<pthread.h>
#include<stdlib.h>
struct node
{
int data;
struct node link;
};

void enqueue()
{
    pthread_t thread_id; 
    printf("Before Thread\n"); 
    pthread_create(&thread_id, NULL, myThreadFun, NULL); 
    pthread_join(thread_id, NULL); 
    printf("After Thread\n");
    
    struct node *p,*start,*temp;
    p=start;
    while(p!=NULL&&p==head)
    {
    temp->data=data;
    temp->link=p->link;
    p->link=temp;
    }
    p=p->link; 
}

void dequeue()
{
    pthread_t thread_id; 
    printf("Before Thread\n"); 
    pthread_create(&thread_id, NULL, myThreadFun, NULL); 
    pthread_join(thread_id, NULL); 
    printf("After Thread\n");
    printf("enter the deque data \n");
    scanf("%d",&data);
 
    while(p->link->data==dequeuedata)
    {
    temp=p->link;
    p->link=temp->link;
    fp=open("dequeue.txt","w+");
    free(temp);
    fwrite(&structnode,sizeof(struct),fp);
    }
    p=p->link;
}


main()
{
int i;
while(1)
{
printf("1.enqueue \n");
printf("2.dequeue \n");
switch(i)
{
case 1:enqueue();
case 2:dequeue();
default :printf("default");
}
}
}
 
/*struct Queue
{
    // Initialize front and rear
    int rear, front;
 
    // Circular Queue
    int size;
    int *arr;
};
 
 
/* Function to create Circular queue */
/*void enQueue(int value)
{
    if ((front == 0 && rear == size-1) ||
            (rear == (front-1)))
    {
        printf("\nQueue is Full");
        return;
    }
 
    else if (front == -1) /* Insert First Element */
   /*{
        front = rear = 0;
        arr[rear] = value;
    }
 
    else if (rear == size-1 && front != 0)
    {
        rear = 0;
        arr[rear] = value;
    }
 
    else
    {
        rear++;
        arr[rear] = value;
    }
}
 
// Function to delete element from Circular Queue
int deQueue()
{
    if (front == -1)
    {
        printf("\nQueue is Empty");
        return INT_MIN;
    }
 
    int data = arr[front];
    arr[front] = -1;
    if (front == rear)
    {
        front = -1;
        rear = -1;
    }
    else if (front == size-1)
        front = 0;
    else
        front++;
 
    return data;
}
 
// Function displaying the elements
// of Circular Queue
void displayQueue()
{
    if (front == -1)
    {
        printf("\nQueue is Empty");
        return;
    }
    printf("\nElements in Circular Queue are: ");
    if (rear >= front)
    {
        for (int i = front; i <= rear; i++)
            printf("%d ",arr[i]);
    }
    else
    {
        for (int i = front; i < size; i++)
            printf("%d ", arr[i]);
 
        for (int i = 0; i <= rear; i++)
            printf("%d ", arr[i]);
    }
}
 
/* Driver of the program */
/*int main()
{
    size=5;
 
    // Inserting elements in Circular Queue
    enQueue(14);
    enQueue(22);
    enQueue(13);
    enQueue(-6);
 
    // Display elements present in Circular Queue
    displayQueue();
 
    // Deleting elements from Circular Queue
    printf("\nDeleted value = %d", deQueue());
    printf("\nDeleted value = %d", deQueue());
 
    displayQueue();
 
    enQueue(9);
    enQueue(20);
    enQueue(5);
 
    displayQueue();
 
    enQueue(20);
    return 0;
}*/


