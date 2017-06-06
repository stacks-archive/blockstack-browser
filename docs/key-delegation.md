# Blockstack key delegation

## Key delegation object

```JSON
{
  "version": 1.0,
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

This JSON object MUST be signed by a quorum n of the m keys that make up the multi-sig
address that owns name1.id.

* `app` is the public key of the key that signs the app
* `enc` is the public key of the data encryption key
* `sign`: is the public key of the signature key (used to sign the profile)
---

## App key bundle object

One per name per device.

```JSON
{
  "version": 1.0,
  "apps": {
    "blog.app": "...",
    "todo.app": "..."
  }
}
```
This JSON object MUST be signed by the `sign` key of the corresponding device
in the key delegation bundle.
---

## Blockstack Token File

These are packaged in the token file along with the profile.

```JSON
{
  "version": "3.0",
  "profile": <profile-jwt>,
  "keys": {
    "delegation": <key-bundle-jwt>,
    "apps": {
      "laptop": <app-key-bundle-jwt>,
      "phone": <app-key-bundle-jwt>
      }
    }
  }
}
```

The entire token file is signed by 1 of the `sign` keys in the key delegation bundle.
