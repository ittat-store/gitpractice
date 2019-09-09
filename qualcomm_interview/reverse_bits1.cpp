#include <iostream>
#include <bitset>
using namespace std;

// Integer size in C
#define INT_SIZE 32

// Function to reverse bits of a given integer
int reverseBits(int n)
{
	int pos = INT_SIZE - 1;	// maintains shift
	
	// store reversed bits of n. Initially all bits are set to 0
	int reverse = 0;

	// do till all bits are processed
	while (pos >= 0 && n)
	{
		// if current bit is 1, then set corresponding bit in result
		if (n & 1)
			reverse = reverse | (1 << pos);
		
		n >>= 1;	// drop current bit (divide by 2)
		pos--;		// decrement shift by 1
	}
	
	return reverse;
}

// Reverse Bits of a given Integer
int main()
{
	int n = -100;

	cout << n << " in binary is " << bitset<32>(n) << endl;
	cout << "On reversing bits " << bitset<32>(reverseBits(n));

	return 0;
}
