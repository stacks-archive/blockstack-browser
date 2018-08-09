#!/bin/bash
set -e

BUILD_DIR="$(mktemp -d)"

if [ -z "$REPO_DIR" ]; then
   REPO_DIR="."
fi

pushd "${REPO_DIR}"

VERSION="$(cat package.json | grep '"version":' | awk '{ print $2 }' | sed -e 's/"//g' | sed -e 's/,//')"

echo "Building version $VERSION"

mkdir -p "${BUILD_DIR}"

LIB_PATH=/usr/local/lib/blockstack-browser
HANDLERPATH="${BUILD_DIR}/usr/share/applications"
OUTPATH="${BUILD_DIR}${LIB_PATH}"
BINPATH="${BUILD_DIR}/usr/local/bin"

DISTPATH="native/linux/dist"

mkdir -p "${OUTPATH}"
mkdir -p "${BINPATH}"
mkdir -p "${HANDLERPATH}"
mkdir -p "${DISTPATH}"

DISTFILE="${DISTPATH}/blockstack-browser_${VERSION}_all.deb"

npm install
NODE_ENV="production ./node_modules/.bin/gulp prod-webapp"

echo "Building ${DISTFILE}"

echo "Copying gulped build"
cp -r ./build "${OUTPATH}"
mv "${OUTPATH}/build" "${OUTPATH}/browser"

cp native/blockstackProxy.js "${OUTPATH}"

MAKE_CORS=0

if [ $MAKE_CORS = "1" ]; then
    echo "Install the CORS Proxy"
    mkdir -p $OUTPATH/corsproxy/node_modules
    npm install corsproxy-https --prefix $OUTPATH/corsproxy
    chmod -R 0755 $OUTPATH/corsproxy
fi

echo "Make run scripts"

cat - > $BINPATH/blockstack-browser <<EOF
#!/bin/bash
nodejs "$LIB_PATH/blockstackProxy.js" 8888 "$LIB_PATH/browser"
EOF

cat - > $BINPATH/blockstack-protocol-handler <<EOF
#!/bin/bash
AUTH=\$(echo "\$1" | sed s#/##g | sed s/blockstack:// | sed 's/ //g')
xdg-open "http://localhost:8888/auth?authRequest=\${AUTH}"
EOF


if [ $MAKE_CORS = "1" ]; then
    cat - > $BINPATH/blockstack-cors-proxy <<EOF
#!/bin/bash
"$LIB_PATH/corsproxy/node_modules/.bin/corsproxy"
EOF
    chmod 0555 $BINPATH/blockstack-cors-proxy
fi

cat - > $HANDLERPATH/blockstack.desktop <<EOF
[Desktop Entry]
Type=Application
Terminal=false
Exec=blockstack-protocol-handler %u
Name=Blockstack-Browser
MimeType=x-scheme-handler/blockstack;
EOF

chmod 0555 $HANDLERPATH/blockstack.desktop
chmod 0555 $BINPATH/blockstack-browser
chmod 0555 $BINPATH/blockstack-protocol-handler

ARCH="all"
NAME="blockstack-browser"
LICENSE="MPL-2.0"
DESCRIPTION="The Blockstack Browser"
MAINTAINER="Aaron Blankstein (aaron@blockstack.com)"
VENDOR="Blockstack PBC"
URL="https://github.com/blockstack/blockstack-browser.git"

fpm --force -s dir -t deb -a "$ARCH" -v "$VERSION" -n "$NAME" \
    -d 'nodejs >= 6.0.0' -C $BUILD_DIR --license "$LICENSE" --vendor "$VENDOR" --maintainer "$MAINTAINER" \
    --url "$URL" --description "$DESCRIPTION" -p "$DISTFILE" $(ls "$BUILD_DIR")

popd

echo "SUCCESS: Built browser paths"
 
