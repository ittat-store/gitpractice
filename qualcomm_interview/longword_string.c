#include<string.h>
#include<stdio.h>
int main(){
	char s[100],buf[100],temp[100];
	int l, c = 0,i=0,k=0, max = 1;
	gets(s);
	l = strlen(s);
	for(i = 0 ; i < l ; i++){
		if(s[i] != ' '){
			c++;
                  //buf[k]=s[i];
		  //k++;
                  //printf(" k is%d ",k);
		}
		else{
			if(c > max) 
			//{
			max = c;
			//buf[k]='\0';
                        //strcpy(temp,buf);
			//memset(buf,'\0',strlen(buf));
                        //printf("temp is %s\n",temp);
			//k=0;
			//}
			c = 0; 
                        
		}
	}
	if(c > max) 
	max = c;
	//strcpy(temp,buf);
 
	printf("Length: %d and string: %s\n", max,temp);
	return 0;
}
