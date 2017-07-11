#!/bin/bash

# Script build the blockstack virtualenv distributed with
# the macOS app


## make working directory the same as location of script
#cd "$(dirname "$0")"

# Make build script exit if any command returns error code.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/"

echo "Script is running in $SCRIPT_DIR"

cd /tmp

echo "Removing any existing virtualenv dir..."

rm -Rfv blockstack-venv

echo "Creating a new virtualenv..."

virtualenv -p /usr/bin/python2.7 blockstack-venv

echo "Activating virtualenv..."

source blockstack-venv/bin/activate

echo "Install cryptography, making sure we get the universal binary"
pip install cryptography --only-binary cryptography

echo "Build statically-linked scrypt..."
PYSCRYPT_NO_LINK_FLAGS="1" LDFLAGS="/usr/local/opt/openssl/lib/libcrypto.a /usr/local/opt/openssl/lib/libssl.a" CFLAGS="-I/usr/local/opt/openssl/include" pip install git+https://github.com/larrysalibra/py-scrypt --no-use-wheel

echo "Installing latest virtualchain..."

pip install --upgrade git+https://github.com/blockstack/virtualchain.git@c2f42e3a03d3d49d6e7d6fc7f5828a319b7a58e4

echo "Installing lastest jsontokens-py"

pip install --upgrade git+https://github.com/blockstack/jsontokens-py.git@0a6134820ee6929e7f00c62b331f5439d38b6b17

echo "Installing latest blockstack-profiles..."

pip install --upgrade git+https://github.com/blockstack/blockstack-profiles-py.git@103783798df78cf0f007801e79ec6298f00b2817

echo "Installing latest blockstack-zones..."

pip install --upgrade git+https://github.com/blockstack/zone-file-py.git@00d801b8c1d2d5024eec80dd6531ab8441742127

echo "Installing latest blockstack..."

pip install --upgrade git+https://github.com/blockstack/blockstack-core.git@a70e71dc2f26eb2232b48f918f202fc8f9c3e9de

echo "Blockstack virtual environment created."

echo "Making Blockstack virtual environment relocatable..."

cd /tmp/

virtualenv --relocatable blockstack-venv

echo "Build Blockstack virtualenv archive..."

tar -czvf $SCRIPT_DIR/Blockstack/Blockstack/blockstack-venv.tar.gz blockstack-venv
