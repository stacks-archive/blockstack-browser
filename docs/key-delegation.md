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

---

Key delegation object and app key bundle objects are included in the profile JSON
object.
