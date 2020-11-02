echo "🛠  Installing dependencies."
yarn
echo "🛠  Compiling extension."
yarn lerna run prod:ext
echo "🛠  Packaging Browser Extension"
cd packages/app/dist
zip -r ../../../extension.zip *
echo "✅  Extension packaged as extension.zip"

