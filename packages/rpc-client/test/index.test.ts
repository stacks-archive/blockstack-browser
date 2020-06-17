import { fetchAccount } from '../src';

describe('fetchAccount', () => {
  it('works', async () => {
    const account = await fetchAccount(
      'ST2VHM28V9E5QCRD6C73215KAPSBKQGPWTEE5CMQT'
    );
    expect(account.balance.toNumber()).toEqual(10000);
    expect(account.nonce).toEqual(0);
  }, 10000);
});
