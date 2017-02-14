#!/bin/bash

# This script calls blockstack in a specified virtualenv.
# The first argument is the path to the virtualenv (without trailing /)
# The remaining arguments are passed to blockstack.
#
# Usage: bash blockstack-wrapper-mac.sh <virtualenv-path> <blockstack arguments>

echo "Activating virtual environment at $1"

source "$1/bin/activate"

blockstack="$1/bin/blockstack"

echo "Making sure $blockstack is executable"

chmod +x "$blockstack"

echo "Running blockstack ${@:2}"
blockstack "${@:2}"

echo "Deactivating virtualenv"

deactivate
