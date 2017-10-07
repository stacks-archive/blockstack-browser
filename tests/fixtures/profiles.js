export const NameLookups = {
  'guylepage.id': {"status": "registered", "zonefile": "$ORIGIN guylepage.id\n$TTL 3600\n_http._tcp URI 10 1 \"https://blockstack.s3.amazonaws.com/guylepage.id\"\n", "expire_block": 489247, "blockchain": "bitcoin", "last_txid": "fcfe71c50dca65ecc0595ccbcf73b1f697dcd9e0a46c1bfd10be407d0ce51ac8", "address": "18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6", "zonefile_hash": "566656c98b1e577a5dad952632e8cf44ed67bd9c"}}

export const TokenFileLookups = {
  'guylepage.id': [
  {
    "decodedToken": {
      "header": {
        "alg": "ES256K",
        "typ": "JWT"
      },
      "payload": {
        "issuedAt": "2016-07-05T17:23:49.927217",
        "claim": {
          "website": [
            {
              "url": "http://blockstack.com/team",
              "@type": "WebSite"
            }
          ],
          "account": [
            {
              "identifier": "guylepage3",
              "proofType": "http",
              "@type": "Account",
              "service": "twitter",
              "proofUrl": "https://twitter.com/guylepage3/status/750437834532777984"
            },
            {
              "proofType": "http",
              "identifier": "g3lepage",
              "@type": "Account",
              "service": "facebook",
              "proofUrl": "https://www.facebook.com/g3lepage/posts/10154179855498760"
            },
            {
              "identifier": "guylepage3",
              "proofUrl": "https://gist.github.com/guylepage3/48777a21a70d322b0fa4c1fcc53f4477",
              "proofType": "http",
              "service": "github",
              "@type": "Account"
            }
          ],
          "name": "Guy Lepage",
          "image": [
            {
              "contentUrl": "https://s3.amazonaws.com/kd4/guylepage",
              "@type": "ImageObject",
              "name": "avatar"
            },
            {
              "contentUrl": "https://s3.amazonaws.com/dx3/guylepage",
              "@type": "ImageObject",
              "name": "cover"
            }
          ],
          "accounts": [
            {
              "identifier": "guylepage3",
              "proofType": "http",
              "service": "twitter",
              "@type": "Account"
            },
            {
              "identifier": "g3lepage",
              "proofType": "http",
              "service": "facebook",
              "@type": "Account"
            },
            {
              "identifier": "guylepage3",
              "proofType": "http",
              "service": "github",
              "@type": "Account"
            },
            {
              "contentUrl": "https://s3.amazonaws.com/pk9/guylepage",
              "identifier": "1CADC0B8A5020356D985782CF09793B9F9C6DAD1",
              "role": "key",
              "@type": "Account",
              "service": "pgp"
            }
          ],
          "address": {
            "addressLocality": "New York, NY",
            "@type": "PostalAddress"
          },
          "@type": "Person",
          "description": "@blockstackorg developer. 1st hire, Design Partner @blockstacklabs (YC/USV backed) entrepreneur, blockchain, creative, marketing, surf, triathlon, ironman"
        },
        "expiresAt": "2017-07-05T17:23:49.927217",
        "subject": {
          "publicKey": "02fbb1b5d6d912811f54b90ca5188fbf34f1a9359b654c1380892c9cc700d8bf9d"
        },
        "issuer": {
          "publicKey": "02fbb1b5d6d912811f54b90ca5188fbf34f1a9359b654c1380892c9cc700d8bf9d"
        }
      },
      "signature": "5mlEv1cVqcO9OCsiNLkeSF2UYqRsWnRaLayzsTZ-JSK7m3LK8fwQU5exD9bMnGKiy1ebyZVF7CV4tNonv47jSA"
    },
    "token": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJpc3N1ZWRBdCI6IjIwMTYtMDctMDVUMTc6MjM6NDkuOTI3MjE3IiwiY2xhaW0iOnsid2Vic2l0ZSI6W3sidXJsIjoiaHR0cDovL2Jsb2Nrc3RhY2suY29tL3RlYW0iLCJAdHlwZSI6IldlYlNpdGUifV0sImFjY291bnQiOlt7InNlcnZpY2UiOiJ0d2l0dGVyIiwicHJvb2ZUeXBlIjoiaHR0cCIsIkB0eXBlIjoiQWNjb3VudCIsImlkZW50aWZpZXIiOiJndXlsZXBhZ2UzIiwicHJvb2ZVcmwiOiJodHRwczovL3R3aXR0ZXIuY29tL2d1eWxlcGFnZTMvc3RhdHVzLzc1MDQzNzgzNDUzMjc3Nzk4NCJ9LHsiQHR5cGUiOiJBY2NvdW50IiwiaWRlbnRpZmllciI6ImczbGVwYWdlIiwicHJvb2ZVcmwiOiJodHRwczovL3d3dy5mYWNlYm9vay5jb20vcGx1Z2lucy9wb3N0LnBocD9ocmVmPWh0dHBzJTNBJTJGJTJGd3d3LmZhY2Vib29rLmNvbSUyRmczbGVwYWdlJTJGcG9zdHMlMkYxMDE1NDE3OTg1NTQ5ODc2MCIsInNlcnZpY2UiOiJmYWNlYm9vayIsInByb29mVHlwZSI6Imh0dHAifSx7ImlkZW50aWZpZXIiOiJndXlsZXBhZ2UzIiwicHJvb2ZUeXBlIjoiaHR0cCIsIkB0eXBlIjoiQWNjb3VudCIsInNlcnZpY2UiOiJnaXRodWIiLCJwcm9vZlVybCI6Imh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2d1eWxlcGFnZTMvNDg3NzdhMjFhNzBkMzIyYjBmYTRjMWZjYzUzZjQ0NzcifV0sIm5hbWUiOiJHdXkgTGVwYWdlIiwiaW1hZ2UiOlt7ImNvbnRlbnRVcmwiOiJodHRwczovL3MzLmFtYXpvbmF3cy5jb20va2Q0L2d1eWxlcGFnZSIsIkB0eXBlIjoiSW1hZ2VPYmplY3QiLCJuYW1lIjoiYXZhdGFyIn0seyJjb250ZW50VXJsIjoiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2R4My9ndXlsZXBhZ2UiLCJAdHlwZSI6IkltYWdlT2JqZWN0IiwibmFtZSI6ImNvdmVyIn1dLCJhY2NvdW50cyI6W3siaWRlbnRpZmllciI6Imd1eWxlcGFnZTMiLCJwcm9vZlR5cGUiOiJodHRwIiwic2VydmljZSI6InR3aXR0ZXIiLCJAdHlwZSI6IkFjY291bnQifSx7ImlkZW50aWZpZXIiOiJnM2xlcGFnZSIsInByb29mVHlwZSI6Imh0dHAiLCJzZXJ2aWNlIjoiZmFjZWJvb2siLCJAdHlwZSI6IkFjY291bnQifSx7ImlkZW50aWZpZXIiOiJndXlsZXBhZ2UzIiwicHJvb2ZUeXBlIjoiaHR0cCIsInNlcnZpY2UiOiJnaXRodWIiLCJAdHlwZSI6IkFjY291bnQifSx7ImNvbnRlbnRVcmwiOiJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vcGs5L2d1eWxlcGFnZSIsImlkZW50aWZpZXIiOiIxQ0FEQzBCOEE1MDIwMzU2RDk4NTc4MkNGMDk3OTNCOUY5QzZEQUQxIiwicm9sZSI6ImtleSIsIkB0eXBlIjoiQWNjb3VudCIsInNlcnZpY2UiOiJwZ3AifV0sImFkZHJlc3MiOnsiYWRkcmVzc0xvY2FsaXR5IjoiTmV3IFlvcmssIE5ZIiwiQHR5cGUiOiJQb3N0YWxBZGRyZXNzIn0sIkB0eXBlIjoiUGVyc29uIiwiZGVzY3JpcHRpb24iOiJAYmxvY2tzdGFja29yZyBkZXZlbG9wZXIuIDFzdCBoaXJlLCBEZXNpZ24gUGFydG5lciBAYmxvY2tzdGFja2xhYnMgKFlDL1VTViBiYWNrZWQpIGVudHJlcHJlbmV1ciwgYmxvY2tjaGFpbiwgY3JlYXRpdmUsIG1hcmtldGluZywgc3VyZiwgdHJpYXRobG9uLCBpcm9ubWFuIn0sImV4cGlyZXNBdCI6IjIwMTctMDctMDVUMTc6MjM6NDkuOTI3MjE3IiwiaXNzdWVyIjp7InB1YmxpY0tleSI6IjAyZmJiMWI1ZDZkOTEyODExZjU0YjkwY2E1MTg4ZmJmMzRmMWE5MzU5YjY1NGMxMzgwODkyYzljYzcwMGQ4YmY5ZCJ9LCJzdWJqZWN0Ijp7InB1YmxpY0tleSI6IjAyZmJiMWI1ZDZkOTEyODExZjU0YjkwY2E1MTg4ZmJmMzRmMWE5MzU5YjY1NGMxMzgwODkyYzljYzcwMGQ4YmY5ZCJ9fQ.5mlEv1cVqcO9OCsiNLkeSF2UYqRsWnRaLayzsTZ-JSK7m3LK8fwQU5exD9bMnGKiy1ebyZVF7CV4tNonv47jSA",
    "parentPublicKey": "02fbb1b5d6d912811f54b90ca5188fbf34f1a9359b654c1380892c9cc700d8bf9d",
    "encrypted": false
  }
]
}
