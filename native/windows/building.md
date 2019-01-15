# Overview

# Building on Windows

Run `npm run win32`.

# Using shell script

The shell script `assemble-build.sh` will gather all the components necessary into the
`Resources/` directory before the installer will build correctly.

Once that is complete, you can build the Visual Studio 2017 Solution
BlockstackBrowser.sln This will output an unsigned `.msi` -- if you
wish to do code-signing, you will need to then explicitly sign the
installer.

Far and away, the easiest way to build the project is to use Visual Studio Team Services --
there's an included build definition in this directory `vsts-build-definition.json`. Note,
you should use a VS2017 agent (e.g., Hosted VS2017), and you will have to connect the build
definition to the repository you want to build from (and the branch you want to build from).

# Code signing from a Unix CLI

You need `osslsigncode` installed for this to work, but with your certs and signing key,
you can run:

```
osslsigncode -certs "X509/IntermediateCA.crt" -certs "X509/ssl_certificate.crt" -key sign.key \
-n "Blockstack Browser" -i "https://blockstack.org"  -t "http://timestamp.verisign.com/scripts/timstamp.dll" \
-in BlockstackSetup.msi -out blockstack-browser-signed.msi
```
