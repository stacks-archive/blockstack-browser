#!/bin/bash

# Script build the blockstack virtualenv distributed with
# the macOS app


## make working directory the same as location of script
#cd "$(dirname "$0")"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/"

echo "Script is running in $SCRIPT_DIR"

cd /tmp

echo "Removing any existing virtualenv dir..."

rm -Rfv blockstack-venv

echo "Creating a new virtualenv..."

virtualenv -p /usr/bin/python2.7 blockstack-venv

echo "Downloading gmp..."

curl -O https://gmplib.org/download/gmp/gmp-6.1.2.tar.bz2

bunzip2 gmp-6.1.2.tar.bz2

tar -xf gmp-6.1.2.tar

echo "Building gmp..."

cd gmp-6.1.2

./configure --prefix=/tmp/blockstack-venv

make

make install

cd ..

echo "Activating virtualenv..."

source blockstack-venv/bin/activate

echo "Installing fastecdsa..."

CFLAGS="-I/tmp/blockstack-venv/include" LDFLAGS="-L/tmp/blockstack-venv/lib" pip install fastecdsa --no-cache-dir

echo "Installing latest virtualchain..."

pip install git+https://github.com/blockstack/virtualchain.git@rc-0.14.1

echo "Installing latest blockstack-profiles..."

pip install git+https://github.com/blockstack/blockstack-profiles-py.git@rc-0.14.1

echo "Installing latest blockstack-zones..."

pip install git+https://github.com/blockstack/dns-zone-file-py.git@rc-0.14.1

echo "Installing latest blockstack..."

pip install git+https://github.com/blockstack/blockstack-core.git@rc-0.14.1b

echo "Blockstack virtual environment created."

echo "Making Blockstack virtual environment relocatable..."

virtualenv --relocatable blockstack-venv

echo "Build Blockstack virtualenv archive..."

tar -czvf $SCRIPT_DIR/Blockstack/Blockstack/blockstack-venv.tar.gz blockstack-venv
