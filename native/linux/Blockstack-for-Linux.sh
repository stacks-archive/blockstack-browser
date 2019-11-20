#!/bin/bash

# This script provides a simple interface for folks to use the docker install

TAG=v0.37.0-beta.6
if [ "$BLOCKSTACK_TAG" ]; then
   TAG="$BLOCKSTACK_TAG"
fi

browserimage=quay.io/blockstack/blockstack-browser:$TAG

if [ "$BROWSER_IMAGE" ]; then
    browserimage="$BROWSER_IMAGE"
fi


# Default to setting blockstack to debug mode
if [ "$BLOCKSTACK_DEBUG" != "0" ]; then
    BLOCKSTACK_DEBUG=1
fi

# Local Blockstack directory
homedir=$HOME/.blockstack
# Name of Blockstack Browser container
browsercontainer=blockstack-browser
# Local temporary directory
tmpdir=/tmp/.blockstack_tmp
if [ ! -e $tmpdir ]; then
   mkdir -p $tmpdir
fi
# set password blank so we know when to prompt
password=0

if [ "$WIN_HYPERV" == '1' ]; then
    prefix='winpty'
else
    prefix=''
fi

build () {
  echo "Building blockstack docker image. This might take a minute..."
  docker build -t $browserimage .
}

start-containers () {
  # Check for the blockstack-browser-* containers are running or stopped.
  if [ "$(docker ps -q -f name=$browsercontainer)" ]; then
    echo "Blockstack browser is already running -- restarting it."
    stop
  elif [ ! "$(docker ps -q -f name=$browsercontainer)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=$browsercontainer)" ]; then
      # cleanup old containers if they are still around
      echo "removing old browser containers..."
      docker rm $(docker ps -aq -f status=exited -f name=$browsercontainer)
    fi

    # If there are no existing blockstack-browser-* containers, run them
    docker run -d --name $browsercontainer-static -p 127.0.0.1:8888:8888 $browserimage blockstack-browser
    docker run -d --name $browsercontainer-cors  -e CORSPROXY_HOST="0.0.0.0" -p 127.0.0.1:1337:1337 $browserimage blockstack-cors-proxy

    if [[ $(uname) == 'Linux' ]]; then
      # let's register the protocol handler if it isn't already registered:
      create-linux-protocol-handler
      xdg-open "http://localhost:8888/#coreAPIPassword=$password"
    elif [[ $(uname) == 'Darwin' ]]; then
      open "http://localhost:8888/#coreAPIPassword=$password"
    elif [[ $(uname) == 'Windows' || $(uname) == 'MINGW64_NT-10.0' ]]; then
      start "http://localhost:8888/#coreAPIPassword=$password"
    fi
  fi
}

stop () {
  bc=$(docker ps -a -f name=$browsercontainer -q)
  if [ ! -z "$bc" ]; then
    echo "stopping the running blockstack-browser containers"
    docker stop $bc
    docker rm $bc
  fi
}

commands () {
  cat <<-EOF

blockstack docker launcher commands:
  install-protocol-handler -> install a protocol handler for blockstack:// links
  remove-protocol-handler -> uninstall the protocol handler for blockstack:// links
  pull  -> fetch docker containers from quay
  start -> start the blockstack browser server
  stop  -> stop the blockstack browser server

To get started, use

 $  ./Blockstack-for-Linux.sh pull
 $  ./Blockstack-for-Linux.sh install-protocol-handler
 $  ./Blockstack-for-Linux.sh start

This *requires* Docker to run.

To remove the protocol handler (the only thing 'installed' when you run this launcher):

 $  ./Blockstack-for-Linux.sh remove-protocol-handler

And this will start the environment for running the Blockstack Browser

Note: the Docker containers mount your /home/<user>/.blockstack directory

EOF
}

pull () {
    docker pull ${browserimage}
}

version () {
    echo "Blockstack launcher tagged @ '$TAG'"
}

delete-linux-protocol-handler () {
    HANDLER="blockstack.desktop"
    HANDLER_SCRIPT="blockstack-protocol-handler"
    rm -f "$HOME/.local/share/applications/$HANDLER_SCRIPT"
    rm -f "$HOME/.local/share/applications/$HANDLER"
}

create-linux-protocol-handler () {
    HANDLER="blockstack.desktop"
    HANDLER_SCRIPT="blockstack-protocol-handler"
    echo "Registering protocol handler"
    if [ ! -e "$HOME/.local/share/applications/" ]; then
        mkdir -p "$HOME/.local/share/applications/"
    fi
    cat - > "$HOME/.local/share/applications/$HANDLER_SCRIPT" <<EOF
#!/bin/bash
AUTH=\$(echo "\$1" | sed s#/##g | sed s/blockstack:// | sed 's/ //g')
xdg-open "http://localhost:8888/auth?authRequest=\${AUTH}"
EOF
    chmod +x "$HOME/.local/share/applications/$HANDLER_SCRIPT"

    cat - > "$HOME/.local/share/applications/$HANDLER" <<EOF
[Desktop Entry]
Type=Application
Terminal=false
Exec=$HOME/.local/share/applications/$HANDLER_SCRIPT %u
Name=Blockstack-Browser
MimeType=x-scheme-handler/blockstack;
EOF
    chmod +x "$HOME/.local/share/applications/$HANDLER"
    xdg-mime default "$HANDLER" x-scheme-handler/blockstack
}

case $1 in
  install-protocol-handler)
    create-linux-protocol-handler
    ;;
  remove-protocol-handler)
    delete-linux-protocol-handler
    ;;
  stop)
    stop
    ;;
  start)
    start-containers $2
    ;;
  pull)
    pull
    ;;
  version)
    version
    ;;
  *)
    commands
    ;;
esac
