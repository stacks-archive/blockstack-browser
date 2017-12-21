#!/bin/bash

rm -rf blockstack-browser

VERSION=0.21.5

git clone https://github.com/blockstack/blockstack-browser
cd blockstack-browser
git checkout "v$VERSION"

npm i

NODE_ENV=production gulp prod-windows

cp -r build ../BlockstackBrowser/Resources/build

sed -i -e "s/Version=\"0.0.0.0\"/Version=\"$VERSION\"/" ../BlockstackSetup/Product.wxs
