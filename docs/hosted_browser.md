### The Blockstack Browser

Hosted version of the application:
https://browser.blockstack.org

The Blockstack Browser is an application which allows a user to create and manage an identity, 
used to authenticate and provide user-controlled storage to decentralized web applications. This is a
gateway to a new decentralized internet.

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
