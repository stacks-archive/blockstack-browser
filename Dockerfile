FROM ubuntu:xenial

# Project directory
WORKDIR /src/blockstack-browser

# Update apt and install wget
RUN apt-get update && apt-get install -y wget curl apt-utils git

# Install node
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get update && apt-get install -y nodejs

# Install cors-proxy
RUN npm install -g corsproxy

# Alias the cors-proxy
RUN ln /usr/bin/corsproxy /usr/bin/blockstack-cors-proxy

# Copy files into container
COPY . .

# Install dependencies
RUN npm install

# Build production assets
RUN /src/blockstack-browser/node_modules/.bin/gulp prod

# Setup script to run browser
RUN echo '#!/bin/bash' >> /src/blockstack-browser/blockstack-browser
RUN echo 'node /src/blockstack-browser/native/blockstackProxy.js 8888 /src/blockstack-browser/build' >> /src/blockstack-browser/blockstack-browser
RUN chmod +x /src/blockstack-browser/blockstack-browser
RUN ln /src/blockstack-browser/blockstack-browser /usr/bin/blockstack-browser
