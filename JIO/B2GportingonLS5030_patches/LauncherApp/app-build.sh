yarn build
BUILD_PATH="/home/nitin/Documents/JIO/JPP/Code/Launcher_Build/launcher-build"
rm -r $BUILD_PATH/dist $BUILD_PATH/manifest.webapp $BUILD_PATH/index.html
cp -r dist $BUILD_PATH 
cp manifest.webapp $BUILD_PATH
cp index.html $BUILD_PATH
