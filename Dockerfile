FROM nikolaik/python-nodejs:python3.9-nodejs14 as build
LABEL maintainer="ux@blockstack.com"

COPY . .

# Build browser extensions
RUN apt-get update && \
    apt-get install -y zip make && \
    ./build-ext.sh

FROM alpine:latest
COPY --from=build extension.zip .

# Wait for extension.zip to be copied into local
CMD sleep 60
