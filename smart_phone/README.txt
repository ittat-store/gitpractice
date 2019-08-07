================================================================
Software Release: SKATE-212_Android_BSP_LA.BR.1.2.9-04110-8x09.0-1_NT_VER_1.0
Codeaurora Base release TAG: LA.BR.1.2.9-04110-8x09.0-1
Android Version : Android Nougat 7.1.2
Date : December 08 2017
================================================================
Index
1. Introduction
2. Scope
3. Directory structure
4. How to use this release
5. Programming binaries
6. Known Issues

1. Introduction
	This release is intended for use on SKATE-212 based on Qualcomm Snapdragon 212 processor (TM).
	This release uses the standard Codeaurora.org source code as open source development environment.

2. Scope
	The scope of this document is as release quick starter, assuming prior knowledge of android source build process.

3. Directory structure 

SKATE-212_Android_BSP_LA.BR.1.2.9-04110-8x09.0-1_NT_VER_1.0
├── Bootloader_SKATE-212_LA.BR.1.2.9-04110-8x09.0-1_Ver_1.0.tar.gz--------------------Prebuilt binaries of bootloader
├── Documents.tar.gz------------------------------------------------------------------SKATE-212 documents
├── Prebuilt_Binaries_SKATE-212_LA.BR.1.2.9-04110-8x09.0-1_Ver_1.0.tar.gz-------------Prebuilt binaries of android images
├── Proprietary_SKATE-212_LA.BR.1.2.9-04110-8x09.0-1_Ver_1.0.tar.gz-------------------Qualcomm proprietary libraries
├── README.txt------------------------------------------------------------------------This document
├── skate-212_build_ver1.0.sh----------------------------------------------------------------Main build script
└── Source_Patch_SKATE-212_LA.BR.1.2.9-04110-8x09.0-1_Ver_1.0.tar.gz------------------SKATE-212 source patches


4. How to use this release

	4.1 Setup the Android build environment for Android Source code build.
		HOST PC Requirement :-
			--CPU with 4 or more core
			--RAM 4 to 8 GB recommended
			--Ubuntu 16.04 or later with 64 bit OS

	4.2 Copy Source Package to build/work directory. 
		Note: Before proceeding make sure your internet connection is fine to download code from Code Aurora, and you have necessary hard-disk space.
		For complete compilation minimum 70GB free space recommended.

	4.2 Use following commands to compile the source code
=================================================================================================================
user@buildmachine$ cd SKATE-212_Android_BSP_LA.BR.1.2.9-04110-8x09.0-1_NT_VER_1.0
user@buildmachine$ chmod 777 skate-212_build.sh
user@buildmachine$ sh skate-212_build_ver1.0.sh
=================================================================================================================

	The script downloads the source code from codeaurora.org and starts the build process.

	4.3 If download and compilation fails script will report error, otherwise you will get the compiled binaries under
		SKATE-212_Android_BSP_NT_VER_1.0/out/target/product/msm8909/
		   |-- boot.img--------------------------------Linux Kernel + Ramdisk boot image
		   |-- cache.img-------------------------------Android Cache partition ext4 image
		   |-- persist.img-----------------------------Android persist partition ext4 image
		   |-- recovery.img----------------------------Recovery image
		   |-- system.img------------------------------Android System partition ext4 image
		   |-- userdata.img----------------------------Android data partition ext4 image

To program these images to the target,
Boot board into fastboot mode - Refer SKATE-SD212_BM_1.0.pdf for more details.
Connect micro USB cable to target, flash the images to the SKATE-212 board using below commands

		cd <$BUILDROOT>/out/host/linux-x86/bin
	
		fastboot flash aboot <path to emmc_appsboot.mbn>
		fastboot flash boot <path to boot.img>
		fastboot flash system <path to system.img>
		fastboot flash userdata <path to userdata.img>
		fastboot flash persist <path to persist.img>
		fastboot flash recovery <path to recovery.img>

And reboot the device.
=================================================================================================================

Manual build commands
This should be done after skate-212_build_ver1.0.sh script is completed and source build is completed or interrupted during build.
=================================================================================================================
user@buildmachine$ cd SKATE-212_Android_BSP_LA.BR.1.2.9-04110-8x09.0-1_NT_VER_1.0/SKATE-212_Android_BSP_NT_VER_1.0/
user@buildmachine$ source build/envsetup.sh
user@buildmachine$ lunch msm8909-userdebug
user@buildmachine$ make -j8
=================================================================================================================

5. Setting up adb for devices

	5.1 Setting up ADB in Linux

	Please follow below steps:
-	Install the android tools and libudev from apt-get on Linux machine.
	$ sudo apt-get install android-tools-adb android-tools-adbd android-tools-fastboot android-tools-fsutils udev libudev1

-	Now create a file inside directory on Ubuntu machine
	$ sudo vi /etc/udev/rules.d/50-android.rules

-	And paste the below lines inside it for fastboot and adb tools.
#########################################################################################
#Sooner low-level bootloader
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", ATTR{idProduct}=="d00d",MODE="0664", GROUP="plugdev"
SUBSYSTEM=="usb", ATTR{idVendor}=="2717", ATTR{idProduct}=="ff68",MODE="0664", GROUP="plugdev"

# adb composite interface device 9091
SUBSYSTEM=="usb", ATTR{idVendor}=="05C6", ATTR{idProduct}=="9091", MODE="0664", GROUP="plugdev"

# adb composite interface device 0169
SUBSYSTEM=="usb", ATTR{idVendor}=="0FCE", ATTR{idProduct}=="0169", MODE="0664", GROUP="plugdev"

# adb composite interface device 9025
SUBSYSTEM=="usb", ATTR{idVendor}=="05C6", ATTR{idProduct}=="9025", MODE="0664", GROUP="plugdev"
#########################################################################################

-	Save the file in vi using “Esc :wq”. Now restart udev service to take effect.
	$ sudo service udev restart

-	To verify that the device drivers are installed properly, we can use adb for checking.
	Boot your SKATE-212 board (Android should be there in SKATE-212 board).
	Connect Micro USB cable to board and PC.
	Open a shell terminal on the PC and run the following command:
	$ adb devices

-	You will see the following message displayed if the above process is successful:
	List of devices attached (Example)
	1234567DEF device

6. Known Issues / Recommended operation

	a) On board speaker will not be working in this HDMI enabled release.

	b) In HDMI mode, 'Back' and 'Recent Apps' button will not be displayed in the Home Screen.

	c) In HDMI mode, camera application will be opened in potrait mode defaultly.
