#!/bin/bash
set -e

VERSION=$(cat package.json | grep '"version":' | awk '{ print $2 }' | sed -e 's/"//g' | sed -e 's/,//')

echo "Building Version $VERSION"

docker pull quay.io/blockstack/blockstack-browser:v$VERSION
docker run -i --name browser-data quay.io/blockstack/blockstack-browser:v$VERSION /bin/true
docker cp browser-data:/src/blockstack-browser/build build

echo "Dockerfile copied!"
