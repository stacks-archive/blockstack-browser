import './setup';
import { getWallet } from './helpers';
import { TransactionVersion } from '@blockstack/stacks-transactions';

const getSigner = async () => {
  const wallet = await getWallet();
  return wallet.getSigner();
};

test('can get a STX address', async () => {
  const signer = await getSigner();
  expect(signer.getSTXAddress(TransactionVersion.Mainnet)).toEqual(
    'SP1GZ804XH4240T4JT2GQ34GG0DMT6B3BQ5NV18PD'
  );
  expect(signer.getSTXAddress(TransactionVersion.Testnet)).toEqual(
    'ST1GZ804XH4240T4JT2GQ34GG0DMT6B3BQ5YQX2WX'
  );
});
