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

echo "Installing latest blockstack..."

pip install --upgrade blockstack

echo "Blockstack virtual environment created."

echo "Build Blockstack virtualenv archive..."

tar -czvf Blockstack/Blockstack/blockstack-venv.tar.gz blockstack-venv
