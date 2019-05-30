obj-m:=chardrivr.o


all:
	make -C /lib/modules/$(shell uname -r)/build M=$(shell pwd) modules
	gcc readwrite.c -o application
clean:
	rm -rf *.o *.ko *.mod.c *.mod.o *.order *.symvers application

