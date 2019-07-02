#include<stdio.h>
union stu
{
	int n;
	char ch[4];
}num;
int main()
{
	printf("enter a number\n");
	/*scanf("%x",&num.n);
	char temp;
	temp=num.ch[0];
	num.ch[0]=num.ch[3];
	num.ch[3]=temp;
	temp=num.ch[1];
	num.ch[1]=num.ch[2];
	num.ch[2]=temp;
	printf("after printing is %x\n",num.n);*/
	int n;
	scanf("%x",&n);
	n=(((n<<8)&0x00ff0000)|((n<<24)&0xff000000)|((n>>8)&0x0000ff00)|((n>>24)&0x000000ff));
	printf("%x\n",n);

}

