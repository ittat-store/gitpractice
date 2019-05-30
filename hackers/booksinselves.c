#include <stdio.h>
#include <stdlib.h>

/*
 * This stores the total number of books in each shelf.
 */
int* total_number_of_books;

/*
 * This stores the total number of pages in each book of each shelf.
 * The rows represent the shelves and the columns represent the books.
 */
int** total_number_of_pages;

int main()
{
	int total_number_of_shelves,i,j,count=1;
	scanf("%d", &total_number_of_shelves);

	int total_number_of_queries;
	scanf("%d", &total_number_of_queries);
/*	int **arr = (int **)malloc(total_number_of_shelves * sizeof(int *));
	for (i=0; i<total_number_of_shelves; i++)
		arr[i] = (int *)malloc(1100 * sizeof(int));

	for(i=0;i<total_number_of_shelves;i++)
	{
		for(j=0;j<1100;j++)
			arr[i][j]=0;
	}*/
	total_number_of_pages=(int **)malloc(sizeof(int *)*total_number_of_shelves);
	//for (i=0; i<total_number_of_shelves; i++)
	//	total_number_of_pages[i] = (int *)malloc(1100 * sizeof(long int));
	total_number_of_books=(int *)malloc(sizeof(int)*total_number_of_shelves);
	for(i=0;i<total_number_of_shelves;i++)
		total_number_of_books[i]=0;


	while (total_number_of_queries--) {
		int type_of_query;
		scanf("%d", &type_of_query);

		if (type_of_query == 1) {
			/*
			 * Process the query of first type here.
			 */
			int x, y;
			scanf("%d %d", &x, &y);
	
	/*		for(i=0;i<total_number_of_shelves;i++)
			{
				if(x==i)
				{
					for(j=0;arr[i][j]!=0;j++);
					arr[i][j]=y;
					total_number_of_pages[i][j]=y;
					total_number_of_books[i]=total_number_of_books[i]+count;
					break;
				}
			}*/
            total_number_of_books[x]++;
            total_number_of_pages[x] = (int *)realloc(total_number_of_pages[x],                                                 total_number_of_books[x] * sizeof(int));
            total_number_of_pages[x][total_number_of_books[x] - 1] = y;

		} else if (type_of_query == 2) {
			int x, y;
			scanf("%d %d", &x, &y);
			printf("%d\n", *(*(total_number_of_pages + x) + y));
		} else {
			int x;
			scanf("%d", &x);
			printf("%d\n", *(total_number_of_books + x));
		}
	}

	if (total_number_of_books) {
		free(total_number_of_books);
	}

/*	for (int i = 0; i < total_number_of_shelves; i++) {
		if (*(total_number_of_pages + i)) {
			free(*(total_number_of_pages + i));
		}
	}*/

	if (total_number_of_pages) {
		free(total_number_of_pages);
	}

	return 0;
}
