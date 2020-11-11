FROM nikolaik/python-nodejs:python3.9-nodejs14 as build
LABEL maintainer="ux@blockstack.com"

COPY . .

RUN apt-get update && \
    apt-get install -y zip make && \
    ./build-ext.sh

FROM alpine:latest
COPY --from=build extension.zip .

CMD sleep 60
