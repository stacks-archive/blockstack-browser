#!/bin/bash

VERSION=$(cat package.json | grep '"version":' | awk '{ print $2 }' | sed -e 's/"//g' | sed -e 's/,//')

echo "Building Version $VERSION"

npm i

NODE_ENV=production gulp prod-windows

cp -r build native/windows/BlockstackBrowser/Resources/build

sed -i -e "s/Version=\"0.0.0.0\"/Version=\"$VERSION\"/" native/windows/BlockstackSetup/Product.wxs
