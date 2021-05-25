---
title: Publish Firefox Extension
---
1. Add "Version notes" with the same content as found in [the CHANGELOG.md file](https://github.com/blockstack/stacks-wallet-web/blob/main/CHANGELOG.md) for the release.
2. Add the following for "Notes for Reviewers": 
    Please use this command to build the extension with Docker:
    ```
        docker build -f Dockerfile -t stacks-wallet-web . \
        && docker run -d --name stacks-wallet-web stacks-wallet-web \
        && docker cp stacks-wallet-web:stacks-wallet-chromium.zip . \
        && docker rm -f stacks-wallet-web
    ``` 
    You can test the extension by selecting "Get started" on https://boom.money.
3. Download [the ZIP file](https://github.com/blockstack/stacks-wallet-web/archive/refs/heads/main.zip) of the repository main branch and upload to "Source code".
4. Submit by clicking "Save changes".

