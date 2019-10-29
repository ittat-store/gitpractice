import string
alpha = string.ascii_lowercase

n = int(input())
L = []

for i in range(n):
        s = "-".join(alpha[i:n])
        L.append(s[::-1]+s[1:])

width = len(L[0])

for i in range(n-1, 0, -1):
        print(L[i].center(width, "-"))

for i in range(n):
        print(L[i].center(width, "-"))
