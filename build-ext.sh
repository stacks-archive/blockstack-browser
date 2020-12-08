#!/bin/sh
echo "🛠  Installing dependencies."
yarn
echo "🛠  Building internal packages."
yarn lerna run build --scope @stacks/connect-ui
echo "🛠  Compiling extension."
cd packages/app && yarn lerna run prod:ext
echo "🛠  Packaging Browser Extension"
cd dist
TS=$(date +%Y)$(date +%m)010000
find -print | while read file; do
    touch -t $TS "$file"
done
zip -Xro /extension.zip *
echo "✅  Extension packaged as extension.zip"
