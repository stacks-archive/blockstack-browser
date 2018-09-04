#!/bin/bash
set -e

VERSION=$(cat package.json | grep '"version":' | awk '{ print $2 }' | sed -e 's/"//g' | sed -e 's/,//')

cp -r webpack-drop/build native/windows/BlockstackBrowser/Resources

TEMPDIR=$(mktemp -d)
pushd $TEMPDIR
npm i express@4
popd

cp -r "$TEMPDIR/node_modules" native/windows/BlockstackBrowser/Resources/
curl https://nodejs.org/dist/latest-v8.x/win-x86/node.exe --output native/windows/BlockstackBrowser/Resources/node.exe

TEMPDIR=$(mktemp -d)
pushd $TEMPDIR
npm i cors-anywhere@0.4.1
popd

mkdir native/windows/BlockstackBrowser/Resources/cors-proxy
cp corsproxy/corsproxy.js native/windows/BlockstackBrowser/Resources/cors-proxy/
cp -r "$TEMPDIR/node_modules" native/windows/BlockstackBrowser/Resources/cors-proxy/

sed -i -e "s/Version=\"0.0.0.0\"/Version=\"$VERSION\"/" native/windows/BlockstackSetup/Product.wxs
