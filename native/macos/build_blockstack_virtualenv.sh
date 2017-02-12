#!/bin/bash

# Script build the blockstack virtualenv distributed with
# the macOS app


# make working directory the same as location of script
cd "$(dirname "$0")"

echo "Removing any existing virtualenv dir..."

rm -Rfv blockstack-venv

echo "Creating a new virtualenv..."

virtualenv -p /usr/bin/python2.7 blockstack-venv

echo "Activating virtualenv..."

source blockstack-venv/bin/activate

echo "Installing latest virtualchain..."

pip install git+https://github.com/blockstack/virtualchain.git@rc-0.14.1

echo "Installing latest blockstack-profiles..."

pip install git+https://github.com/blockstack/blockstack-profiles-py.git@rc-0.14.1

echo "Installing latest blockstack-zones..."

pip install git+https://github.com/blockstack/dns-zone-file-py.git@rc-0.14.1

echo "Installing latest blockstack..."

pip install git+https://github.com/blockstack/blockstack-core.git@rc-0.14.1b

echo "Blockstack virtual environment created."

echo "Build Blockstack virtualenv archive..."

tar -czvf Blockstack/Blockstack/blockstack-venv.tar.gz blockstack-venv
