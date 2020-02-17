import { Subdomains } from '@blockstack/keychain';

export const gaiaUrl = 'https://hub.blockstack.org';

export let Subdomain: Subdomains = Subdomains.BLOCKSTACK;

if (NODE_ENV === 'development') {
  Subdomain = Subdomains.TEST;
}
