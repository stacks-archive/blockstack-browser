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

pip install --upgrade git+https://github.com/blockstack/virtualchain.git@e9e650d1f6343d357a47366f22cc6161a743c7dc

echo "Installing latest blockstack-profiles..."

pip install --upgrade git+https://github.com/blockstack/blockstack-profiles-py.git@103783798df78cf0f007801e79ec6298f00b2817

echo "Installing latest blockstack-zones..."

pip install --upgrade git+https://github.com/blockstack/zone-file-py.git@73739618b51d4c8b85966887fae4ca22cba87e10

echo "Installing latest blockstack..."

pip install --upgrade git+https://github.com/blockstack/blockstack-core.git@6cdf12bd529c00f9e829f2d9bca8b4fceba32d16

echo "Blockstack virtual environment created."

echo "Making Blockstack virtual environment relocatable..."

cd /tmp/

virtualenv --relocatable blockstack-venv

echo "Build Blockstack virtualenv archive..."

tar -czvf $SCRIPT_DIR/Blockstack/Blockstack/blockstack-venv.tar.gz blockstack-venv
