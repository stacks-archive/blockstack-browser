FROM ubuntu:xenial

# Update apt and install wget
RUN apt-get update && apt-get install -y wget curl apt-utils

# Add blockstack apt repo
RUN wget -qO - https://raw.githubusercontent.com/blockstack/packaging/master/repo-key.pub | apt-key add -
RUN echo 'deb http://packages.blockstack.com/repositories/ubuntu/ xenial main' > /etc/apt/sources.list.d/blockstack.list

# Install node
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -

# Install blockstack-browser
RUN apt-get update && apt-get install -y blockstack-browser



