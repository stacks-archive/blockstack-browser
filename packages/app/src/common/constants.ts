import { Subdomains } from '@stacks/keychain';

export const gaiaUrl = 'https://hub.blockstack.org';

export let Subdomain: Subdomains = Subdomains.BLOCKSTACK;

if (document?.location.origin.includes('localhost')) {
  Subdomain = Subdomains.TEST;
}

export const transition = 'all .2s cubic-bezier(.215,.61,.355,1)';
