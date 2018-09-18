FROM node:10

# Project directory
WORKDIR /src/blockstack-browser

# Copy files into container
COPY . .

# Install dependencies
RUN npm install

# Build production assets
RUN npm run prod-webapp

# Remove node modules
FROM node:10
WORKDIR /src/blockstack-browser

COPY --from=0 /src/blockstack-browser/build /src/blockstack-browser/build
COPY --from=0 /src/blockstack-browser/corsproxy/corsproxy.js /src/blockstack-browser/corsproxy/corsproxy.js
COPY --from=0 /src/blockstack-browser/native/windows/BlockstackBrowser/Resources/blockstackProxy.js /src/blockstack-browser/

# Install cors-proxy
RUN npm install cors-anywhere@0.4.1
RUN echo '#!/bin/bash' >> /usr/bin/corsproxy
RUN echo 'node /src/blockstack-browser/corsproxy/corsproxy.js 0 0 0.0.0.0' >> /usr/bin/corsproxy
RUN chmod +x /usr/bin/corsproxy

# Alias the cors-proxy
RUN ln /usr/bin/corsproxy /usr/bin/blockstack-cors-proxy

# Setup script to run browser
RUN npm install express@4
RUN echo '#!/bin/bash' >> /src/blockstack-browser/blockstack-browser
RUN echo 'node /src/blockstack-browser/blockstackProxy.js 8888 0.0.0.0' >> /src/blockstack-browser/blockstack-browser
RUN chmod +x /src/blockstack-browser/blockstack-browser
RUN ln /src/blockstack-browser/blockstack-browser /usr/bin/blockstack-browser
