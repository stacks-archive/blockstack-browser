FROM debian:buster-slim as builder
LABEL maintainer="ux@blockstack.com"

COPY . .
RUN apt-get update -y && apt-get install -y build-essential python3 nodejs zip curl \
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg |  apt-key add - \
  && sh -c 'echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list' \
  && apt-get update -y && apt-get install -y yarn \
  && ./build-ext.sh /stacks-wallet-chromium.zip


FROM alpine:latest
COPY --from=builder /stacks-wallet-chromium.zip .

# Wait for extension.zip to be copied into local
CMD sleep 30
