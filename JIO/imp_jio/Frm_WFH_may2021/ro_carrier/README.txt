Working on F320B ro.carrier CLM issue

here ro.carrier= Unknown coming instead of Jio
so change makefiles in build directory and see patch 

Folow below links for undersatnding ...

https://www.programmersought.com/article/95471613102/

..................................
Theory  :::

>> getprop ro.carrier view the machine's CID number

>> A CID (carrier ID) is a bit simplified a bit of information that tells you
for what country/region/carrier/network your phone is made/intended for.
And where it gets updates from. Sometimes a certain CID tells you what model ID the phone got as well

>> In some of our examples, certain API calls require the device's salesCode (Previously called carrierCode in Knox E-FOTA v1) and Samsung serialNumber.

>> Setting this value from unknown to wifi-only can fix some stand by issues.

ro.carrier=unknown
.......................................................
