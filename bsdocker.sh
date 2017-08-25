#!/bin/bash

# This script provides a simple interface for folks to use the docker install

image=quay.io/blockstack/blockstack-browser:latest
# Local Blockstack directory
homedir=$HOME/.blockstack
# Blockstack Directory inside container
containerdir=/root/.blockstack
# Name of Blockstack API container
containername=blockstack-api

build () {
  echo "Building blockstack docker image. This might take a minute..."
  docker build -t $image .
}

setup () {
  echo "nothing here yet..."
}

start () {
  echo "nothing here yet..."
}

stop () {
  echo "nothing here yet..."
}

enter () {
  echo "nothing here yet..."
}

logs () {
  echo "nothing here yet..."
}

push () {
  echo "pushing build container up to quay.io..."
  docker push $image
}

commands () {
  cat <<-EOF
bsdocker commands:
  start -> start the blockstack browser server
  stop -> stop the blockstack browser server
  setup -> run the setup for blockstack browser
  logs -> access the logs from the blockstack browser server
  enter -> exec into the running docker container
EOF
}

case $1 in
  setup)
    setup $2
    ;;
  stop)
    stop
    ;;
  logs)
    logs
    ;;
  build)
    build 
    ;;
  enter)
    enter 
    ;;
  start)
    start $2
    ;;
  push)
    push
    ;;
  *)
    commands
    ;;
esac
