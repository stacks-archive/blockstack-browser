# Blockstack key delegation

## Key delegation object

Schema:
```Python
KEY_DELEGATION_SCHEMA = {
    'type': 'object',
    'properties': {
        'version': {
            'type': 'string',
            'pattern': '^1\.0$',
        },
        'name': {
            'type': 'string',
            'pattern': OP_NAME_PATTERN,
        },
        'devices': {
            'type': 'object',
            'patternProperties': {
                '^.+$': {
                    'type': 'object',
                    'properties': {
                        'app': {
                            'type': 'string',
                            'pattern': OP_PUBKEY_PATTERN,
                        },
                        'enc': {
                            'type': 'string',
                            'pattern': OP_PUBKEY_PATTERN,
                        },
                        'sign': {
                            'type': 'string',
                            'pattern': OP_PUBKEY_PATTERN,
                        },
                        'index': {
                            'type': 'integer',
                            'minimum': 0,
                            'maximum': 2**31 - 1,
                        },
                    },
                    'required': [
                        'app',
                        'enc',
                        'sign',
                        'index',
                    ],
                    'additionalProperties': False,
                },
            },
        },
    },
    'required': [
        'version',
        'name',
        'devices',
    ],
    'additionalProperties': False,
}
```

Example:
```JSON
{
  "version": "1.0",
    "name": "name1.id",
    "devices": {
        "phone": {
          "app": "...",
          "enc": "...",
          "sign": "...",
          "index": 0        
        },
        "laptop": {
          ...
        },
        "tablet": {
          ...
        }
    }
}
```

Authentication:

* Signed by m-of-n of the on-chain (or Atlas-hosted) keys that own the `name`.
* Verified by m-of-n of the on-chain (or Atlas-hosted) public keys or public key hashes that own the `name`

Field description:
* `name`: The on-chain name or subdomain
* `devices`:
   * `/.+/`: a device name.  Must be unique in the bundle.
      * `app` is the public key of the key that signs the app
      * `enc` is the public key of the data encryption key
      * `sign`: is the public key of the signature key (used to sign the profile)
      * `index`: is index of the owner private key on given device.  Meant for
        consumption by clients who will generate future name private keys.
---

## App key bundle object

One per name per device.

Schema:
```Python
APP_KEY_BUNDLE_SCHEMA = {
    'type': 'object',
    'properties': {
        'version': {
            'type': 'string',
            'pattern': '^1\.0$',
        },
        'apps': {
            'type': 'object',
            'patternProperties': {
                OP_APP_NAME_PATTERN: {
                    'type': 'string',
                    'pattern': OP_PUBKEY_PATTERN,
                },
            },
        },
    },
    'required': [
        'version',
        'apps'
    ],
    'additionalProperties': False,
}
```

Example:

```JSON
{
  "version": "1.0",
  "apps": {
    "blog.app": "...",
    "todo.app": "..."
  }
}
```

Authentication:

* Signed by _one of_ the name owner's device-specific `sign` keys from the key
  delegatin bundle above.  This is
  required in order to allow the name owner to sign up for an app from any
  device.
* Verified by _any of_ the name owner's `sign` public keys from the key
  delegation bundle above.

Fields:

* apps
   * `/app name/`: This is the application name.
       * If it ends in `.1`, then the name string prior to `.1` is a DNS name.
       * If it ends in `.x`, then the name string prior to `.x` is a blockchain
         ID (base-40)

---

## Blockstack Token File

These are packaged in the token file along with the profile.

Schema:

```Python
BLOCKSTACK_TOKEN_FILE_SCHEMA = {
    'type': 'object',
    'properties': {
        'version': {
            'type': 'string',
            'pattern': '^3\.0$',
        },
        'profile': {
            'type': 'string',
            'pattern': '.+', 
        },
        'keys': {
            'type': 'object',
            'properties': {
                'name': {
                    'type': 'array',
                    'items': {
                        'type': 'string',
                        'pattern': OP_PUBKEY_PATTERN,
                    },
                },
                'delegation': {
                    'type': 'string', 
                    'pattern': '.+',
                },
                'apps': {
                    'type': 'object',
                    'patternProperties': {
                        '.+': {                 # device ID
                            'type': 'string',
                            'pattern': '.+',
                        },
                    },
                },
            },
            'required': [
                'name',
                'delegation',
                'apps',
            ],
            'additionalProperties': False,
        },
        'writes': {
            'type': 'integer',
            'minimum': 0,
        },
        'timestamp': {
            'type': 'integer',
            'minimum': 0,
        },
    },
    'required': [
        'version',
        'profile',
        'keys',
        'writes',
        'timestamp',
    ],
    'additionalProperties': False,
}
```

Example:

```JSON
{
  "version": "3.0",
  "profile": "<profile-jwt>",
  "keys": {
    "name": [ "pubkey1", "pubkey2", ... ],
    "delegation": "<key-bundle-jwt>",
    "apps": {
      "laptop": "<app-key-bundle-jwt>",
      "phone": "<app-key-bundle-jwt>"
      }
    }
  },
  "writes": 24,
  "timestamp": 1499121510
}
```

Authentication:

* Signed by _one of_ the name owner's device-specific `sign` keys in the
  delegation bundle.  Specifically, the key belonging to the device listed
  at  `/apps/:deviceName` must sign the `/apps/:deviceName` JWT.
* Verified by _any of_ the name owner's device-specific `sign` public keys or
  public key hashes in the verification bundle.

Fields:

* `profile`:  This is a urlsafe-base64-encoded JWT string.
* `keys`
   * `delegation`:  This is the key delegation bundle, encoded as a
     serialized JWT string (e.g. the output of `JSON.stringify()`)
   * `apps`:  This is an object whose properties are application names (ending
     in either `.1` or `.x`), and whose values are serialized JWT strings
     (e.g. the output of `JSON.stringify()`).
* 'writes': this is the number of times this token file has been updated. It
should increase monotonically.
* 'timestamp': this is the UNIX timestamp at which this token file was created

The serialized JWTs will either be stringify'ed JSON strings (for
multi-signature JWTs) or compact-serialized JWTs (for single-signature JWTs)

