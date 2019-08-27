#include<stdio.h>
#include<string.h>
#include<ctype.h>

#define false 0
#define true 1

char *rev(char *A){			//Function to reverse the string
	int i,j;
	for(i=0,j=strlen(A)-1;i<j;i++,j--){
		char t;
		t=A[i];
		A[i]=A[j];
		A[j]=t;
	}	
	A[strlen(A)]='\0';
	return A;
}

char *dupElimination(char *A){	// Funtion to eliminate the duplicate characters
								// using hashing.
	int j=0,i,k;
	int status[52];			// Array for performing hashing.
	memset(status,false,sizeof(status));
	
	for(i=0;A[i]!='\0';i++){
		 k=isupper(A[i])?A[i]-71:A[i]-65;	
			if(status[k]!=true){
				A[j]=A[i];
				status[k]=true;
				++j;
			}
	}
	A[j]='\0';
	return A;	
}



/*char *dupElimination(char *A)
{	// Funtion to eliminate the duplicate characters
								
	int  var=0,len=0,i=0;
	//memset(status,false,sizeof(status));
	
	for(i=0;A[i]!='\0';i++)
	{
		int k=isupper(A[i])?A[i]-65:A[i]-97;	
			if((var & (1<<k))==0)
			{
				A[len]=A[i];
				var = var|(1<<k);
				len++;
			}
	}
	A[len]='\0';
	return A;	
}
*/

void main(){
	char str[50];
	
	printf("Enter a string to reversal : ");
	scanf("%s",str);	
	
	printf("The string after duplicate elimination is : %s\n",dupElimination(str));
	printf("The reversed string is : %s\n",rev(str));
}
