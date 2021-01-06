import './setup';
import { getWallet } from './helpers';
import { TransactionVersion } from '@blockstack/stacks-transactions';

const getSigner = async () => {
  const wallet = await getWallet();
  return wallet.identities[0].getSigner();
};

test('can get a STX address', async () => {
  const signer = await getSigner();
  expect(signer.getSTXAddress(TransactionVersion.Mainnet)).toEqual(
    'SP3WTH31TWVYDD1YGYKSZK8XFJ3Z1Z5JMGK9M86SK'
  );
  expect(signer.getSTXAddress(TransactionVersion.Testnet)).toEqual(
    'ST3WTH31TWVYDD1YGYKSZK8XFJ3Z1Z5JMGGRF4558'
  );
});
