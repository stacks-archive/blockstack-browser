import { Client, Provider, ProviderRegistry, Result, ResultInterface } from '@blockstack/clarity';

function unwrapOkResult(input: ResultInterface<string, unknown>): string {
  const { result } = input;
  if (!result) {
    throw new Error('Unable to parse result');
  }
  const match = /^\(ok\s0x(\w+)\)$/.exec(result);
  // const res = match[1];
  if (!match) {
    throw new Error('Unable to parse result');
  }
  return Buffer.from(match[1], 'hex').toString();
}

describe('hello world contract test suite', () => {
  let helloWorldClient: Client;
  let provider: Provider;

  const addresses = [
    'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7',
    'S02J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKPVKG2CE',
    'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR',
  ];
  // const alice = addresses[0];
  const [alice, bob] = addresses;

  beforeEach(async () => {
    provider = await ProviderRegistry.createProvider();
    helloWorldClient = new Client(
      'SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.stream',
      'stream',
      provider
    );
  });

  it('should have a valid syntax', async () => {
    await expect(helloWorldClient.checkContract()).resolves.not.toThrow();
  });

  describe('deploying an instance of the contract', () => {
    beforeEach(async () => {
      await helloWorldClient.deployContract();
    });
    it('should hello world', async () => {
      const query = helloWorldClient.createQuery({
        method: {
          name: 'say-hi',
          args: [],
        },
      });
      const receipt = await helloWorldClient.submitQuery(query);
      const result = unwrapOkResult(receipt);
      expect(result).toEqual('hello world');
    });

    it('should create a stream', async () => {
      const tx = helloWorldClient.createTransaction({
        method: {
          name: 'make-stream',
          args: [`'${bob}`],
        },
      });
      await tx.sign(alice);
      const receipt = await helloWorldClient.submitTransaction(tx);
      const result = Result.unwrap(receipt);
      expect(result).toBeTruthy();
      const query = helloWorldClient.createQuery({
        method: {
          name: 'get-stream',
          args: ['u1'],
        },
      });
      const queryReceipt = await helloWorldClient.submitQuery(query);
      const queryResult = Result.unwrap(queryReceipt);
      // console.log(queryResult);
      expect(queryResult).toEqual(
        `(ok (tuple (recipient '${bob}) (sender '${alice}) (start-block u2)))`
      );
    });
  });

  afterAll(async () => {
    await provider.close();
  });
});
