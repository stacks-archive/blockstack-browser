FROM ubuntu:bionic

# Project directory
WORKDIR /src/blockstack-browser

# Update apt and install wget
RUN apt-get update && apt-get install -y wget curl apt-utils git gnupg

# Install node
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update && apt-get install -y nodejs

# Install cors-proxy
RUN npm install -g cors-anywhere
RUN echo '#!/bin/bash' >> /usr/bin/corsproxy
RUN echo 'node /src/blockstack-browser/corsproxy/corsproxy.js 0 0 0.0.0.0' >> /usr/bin/corsproxy
RUN chmod +x /usr/bin/corsproxy

# Alias the cors-proxy
RUN ln /usr/bin/corsproxy /usr/bin/blockstack-cors-proxy

RUN apt-get install -y build-essential
RUN apt-get install -y libpng-dev

# Copy files into container
COPY . .

# Install dependencies
RUN npm install

# Build production assets
RUN npm run build

# Setup script to run browser
RUN echo '#!/bin/bash' >> /src/blockstack-browser/blockstack-browser
RUN echo 'node /src/blockstack-browser/native/blockstackProxy.js 8888 /src/blockstack-browser/dist 0.0.0.0' >> /src/blockstack-browser/blockstack-browser
RUN chmod +x /src/blockstack-browser/blockstack-browser
RUN ln /src/blockstack-browser/blockstack-browser /usr/bin/blockstack-browser
