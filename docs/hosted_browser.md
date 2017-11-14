### The Blockstack Browser

* Hosted version of the Blockstack application:
* https://browser.blockstack.org

The Blockstack Browser is an application which allows a user to create and manage a 
decentralized Blockstack identity. This identity is used to authenticate and provide
user-controlled storage to decentralized web applications.

The Blockstack Browser is a gateway to a new decentralized internet.

The user instantiates a private keychain, backed up with a 12-word phrase, and stored in the user's web
browser's localstorage encrypted with a user-provided password. This keychain is a master keychain for
generating identity addresses which can own Blockstack names (a decentralized naming protocol implemented
on top of a virtual blockchain -- see github.com/blockstack/virtualchain). Names in this system are indexed
by the Blockstack core (see github.com/blockstack/blockstack-core)

The Browser supports registering Blockstack names via communication with a local blockstack-core node. Our
macOS app sets up this system automatically for users. For Windows users and our hosted version of the Browser,
however, we do not currently have support for communicating directly with a local node. However, on these
platforms, you _can_ still construct a private keychain, which can be used to create profiles associated with
identity addresses. These addresses can even have names sent to them, e.g., from Onename (https://www.onename.com)
or another user via the Blockstack core cli (try `$ blockstack transfer foo.id`)

### Authentication with Applications

One of the core features of the Blockstack Browser is authenticating with applications using a decentralized
identifier. Users control their own addresses, and validate their login through a cryptographic signature.
In fact, the Blockstack token voucher registration process uses this system (for a detailed walkthrough
of this, see https://www.larrysalibra.com/blog/blockstack-token-sale-voucher-registration-walkthrough/).
In order to associate the cryptographic identities of the Blockstack Browser with (potentially!) real
people, the app supports adding "social proofs" -- a tweet from some account that asserts that the account
is controlled by the same person as the address. For example:

https://twitter.com/AaronBlankstein/status/918927256738811904

Applications can also use this to associate a given login with an account somewhere else.

### Application Keychains

One of the really cool things about Blockstack as a user (and developer of applications) is that
users are onboarded with a hierarchical keychain. The master backup phrase backs-up _all_ of their
identity addresses. But in addition, each application that a user signs into also receives a unique
key, derived from the user's master key. For people familiar with Bitcoin's hierarchical derivation
wallets, this is not so surprising. However, it enables rapid development of many different kinds
of applications in the cryptocurrency space (for example, a simple application wallet for a currency
of your choice -- Larry Salibra demo'ed a three line receive wallet for Ethereum at the ETC summit: 
https://twitter.com/larrysalibra/status/929660024988753921)

### Authenticating with Storage Providers

Our user experience currently requires that a user connect to our default storage provider. We host
that storage service, however the system (called Gaia) can be deployed by anyone (see the `hub` directory in
github.com/blockstack/gaia). This system allows authorized _writes_ to a connected storage backend, and then
returns a public URL for servicing reads. By separating the logic for these two paths, we can employ standard
improvements to the read path (e.g., CDNs), while supporting our own protocol for the write path. The storage
system allows users to write to paths they own -- for example, my Blockstack profile is stored at:

```
https://gaia.blockstack.org/hub/15GAGiT2j2F1EzZrvjk3B8vBCfwVEzQaZx/0/profile.json
```

And my browser can write to this path by signing its request with the public key associated with that
address (for more details on how an ECDSA public key can become an address, check out: https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses)
