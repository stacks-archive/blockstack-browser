FROM node:10

# Project directory
WORKDIR /src/blockstack-browser

# Install cors-proxy
RUN npm install -g cors-anywhere
RUN echo '#!/bin/bash' >> /usr/bin/corsproxy
RUN echo 'node /src/blockstack-browser/corsproxy/corsproxy.js 0 0 0.0.0.0' >> /usr/bin/corsproxy
RUN chmod +x /usr/bin/corsproxy

# Alias the cors-proxy
RUN ln /usr/bin/corsproxy /usr/bin/blockstack-cors-proxy

#RUN apt-get install -y build-essential
#RUN apt-get install -y libpng-dev 

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
COPY --from=0 /src/blockstack-browser/native/blockstackProxy.js /src/blockstack-browser/native/blockstackProxy.js

# Install cors-proxy
RUN npm install cors-anywhere
RUN echo '#!/bin/bash' >> /usr/bin/corsproxy
RUN echo 'node /src/blockstack-browser/corsproxy/corsproxy.js 0 0 0.0.0.0' >> /usr/bin/corsproxy
RUN chmod +x /usr/bin/corsproxy

# Alias the cors-proxy
RUN ln /usr/bin/corsproxy /usr/bin/blockstack-cors-proxy

# Setup script to run browser
RUN npm install express
RUN echo '#!/bin/bash' >> /src/blockstack-browser/blockstack-browser
RUN echo 'node /src/blockstack-browser/native/blockstackProxy.js 8888 /src/blockstack-browser/build 0.0.0.0' >> /src/blockstack-browser/blockstack-browser
RUN chmod +x /src/blockstack-browser/blockstack-browser
RUN ln /src/blockstack-browser/blockstack-browser /usr/bin/blockstack-browser
