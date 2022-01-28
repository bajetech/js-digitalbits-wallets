# js-digitalbits-wallets

> A library to make it easier to write wallets that interact with the DigitalBits blockchain.

<p align="center">
  <a href="https://www.npmjs.com/package/@bajetech/js-digitalbits-wallets">
    <img alt="npm (scoped)" src="https://img.shields.io/npm/v/@bajetech/js-digitalbits-wallets?style=for-the-badge">
  </a>
  <a href="https://nodejs.org">
    <img alt="Node.js" src="https://img.shields.io/badge/node->=14-yellowgreen?style=for-the-badge&labelColor=000000">
  </a>
  <a href="https://github.com/bajetech/js-digitalbits-wallets/actions/workflows/pipeline.yml">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/bajetech/js-digitalbits-wallets/js-digitalbits-wallets%20CI?label=GitHub%20Actions&logo=github&style=for-the-badge">
  </a>
</p>

This library provides straightforward APIs for handling the following tasks:

- Fetching and formatting data from the DigitalBits blockchain network
- Encrypting and storing secret keys

Some things the library will try to do well:

- Useful type definitions
- Consistent, descriptive names
- Provide one obvious, streamlined way of accomplishing each task

This is not an attempt to replace `xdb-digitalbits-sdk`, it's meant to provide a better
API in some areas (data-fetching) and new functionality in others
(key management).

## Fetching and formatting data

Our library's goal is to provide typed, consistently-named DigitalBits data through
a consistent, predictable API.

Note that our goal was to name data properties to be _internally consistent_ and
intuitive, _not_ to be perfectly consistent with Frontier's responses. In some
cases (particularly around offer / trade history), properties were renamed for
clarity.

```js
import {
  getTokenIdentifier,
  getBalanceIdentifier,
  DataProvider,
} from "@bajetech/digitalbits-wallet-sdk";

// You'll use your DataProvider instance to ask for data from DigitalBits.
const dataProvider = new DataProvider({
  serverUrl: "https://frontier.livenet.digitalbits.io",
  accountOrKey: "<<Insert public key>>",
});

// Some class functions will fetch data directly.
const offers = await dataProvider.fetchOpenOffers({
  limit: 20,
  order: "desc",
});

// Others will watch the network for changes and invoke callback when it happens.
dataProvider.watchAccountDetails({
  onMessage: accountDetails => {
    console.log("Latest account details: ", accountDetails);
  },
  onError: err => {
    console.log("error: ", err);
  },
});
```

## Encrypting and storing secret keys

Our KeyManager class allows you to securely encrypt keys client-side so you're
never sending sensitive information (the user's key or password) over the wire
in a raw state.

```js
import {
  KeyManager,
  KeyManagerPlugins,
  KeyType,
} from "@bajetech/digitalbits-wallet-sdk";

// To instantiate a keyManager instance, pass it an object that conforms to
// the KeyStore interface.
const keyManager = new KeyManager({
  // The library comes with a sample KeyStore that stores keys in memory.
  keyStore: new KeyManagerPlugins.MemoryKeyStore(),
});

// Then, you need to register an encrypter to handle encrypting / decrypting keys.
// The library comes with two samples. (Don't use the Identity Encrypter in prod!)
keyManager.registerEncrypter(KeyManagerPlugins.ScryptEncrypter);

// If you're writing a production wallet, you'll probably want to write your own
// KeyStore and/or Encrypter. Make sure they conform to the `KeyStore` and
// `Encrypter` interfaces defined in these docs. You can use the `PluginTesting`
// functions to make sure that your plugins meet spec!

this.state.keyManager
  .storeKey({
    // The KeyManager takes keys that conform to our Key interface.
    key: {
      type: KeyType.plaintextKey,
      publicKey: "<<Insert public key>>",
      privateKey: "<<Insert private key>>",
    },

    password: "hunter2",
    encrypterName: KeyManagerPlugins.ScryptEncrypter.name,
  })
  .then(keyMetadata => {
    console.log("Successfully encrypted and stored key: ", keyMetadata);
  })
  .catch(e => {
    console.log("Error saving key: ", e.toString());
  });
```
