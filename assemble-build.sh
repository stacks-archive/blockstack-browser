#!/bin/bash

rm -rf blockstack-browser

git clone https://github.com/blockstack/blockstack-browser
cd blockstack-browser

npm i

NODE_ENV=production gulp prod-windows

#cp -r build ../BlockstackBrowser/Resources/build
