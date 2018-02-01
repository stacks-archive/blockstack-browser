#!/bin/bash

VERSION=0.21.6

if [ "$1" != "" ]; then
    VERSION=$1
fi

rm -rf blockstack-browser

git clone https://github.com/blockstack/blockstack-browser
cd blockstack-browser
git checkout "v$VERSION"

npm i

NODE_ENV=production gulp prod-windows

cp -r build ../BlockstackBrowser/Resources/build

sed -i -e "s/Version=\"0.0.0.0\"/Version=\"$VERSION\"/" ../BlockstackSetup/Product.wxs
