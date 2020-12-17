import { readFile as readFileFn } from 'fs';
import { promisify } from 'util';
import { RPCClient } from '@stacks/rpc-client';
import {
  getAddressFromPrivateKey,
  TransactionVersion,
  makeContractDeploy,
  StacksTestnet,
} from '@blockstack/stacks-transactions';
import * as BN from 'bn.js';
import * as dotenv from 'dotenv';
dotenv.config();

const readFile = promisify(readFileFn);

interface Contract {
  name: string;
  file?: string;
}

const contracts: Contract[] = [
  {
    name: 'connect-token',
    file: 'token',
  },
  {
    name: 'counter',
  },
  {
    name: 'faker',
  },
  {
    name: 'status-2',
    file: 'status',
  },
];

const rpcClient = new RPCClient(process.env.API_SERVER || 'http://localhost:3999');
const privateKey = process.env.CONTRACT_PRIVATE_KEY;
if (!privateKey) {
  console.error('Provide a private key with `process.env.CONTRACT_PRIVATE_KEY`');
  process.exit(1);
}
const address = getAddressFromPrivateKey(privateKey, TransactionVersion.Testnet);

const network = new StacksTestnet();
network.coreApiUrl = rpcClient.url;

const run = async () => {
  const account = await rpcClient.fetchAccount(address);
  console.log(`Account balance: ${account.balance.toString()} mSTX`);
  console.log(`Account nonce: ${account.nonce}`);

  const txResults: string[] = [];
  let index = 0;
  for (const contract of contracts) {
    let exists: boolean;
    const contractId = `${address}.${contract.name}`;
    try {
      await rpcClient.fetchContractInterface({
        contractAddress: address,
        contractName: contract.name,
      });
      exists = true;
    } catch (error) {
      // console.error(error);
      exists = false;
    }
    if (exists) {
      console.log(`Contract ${contractId} already exists.`);
      continue;
    }

    console.log(`Deploying ${contractId}`);

    const source = await readFile(`./contracts/${contract.file || contract.name}.clar`);
    const tx = await makeContractDeploy({
      contractName: contract.name,
      codeBody: source.toString('utf8'),
      senderKey: privateKey,
      nonce: new BN(account.nonce + index, 10),
      network,
    });

    const result = await rpcClient.broadcastTX(tx.serialize());
    if (result.ok) {
      index += 1;
      txResults.push((await result.text()).replace(/"/g, ''));
    } else {
      const errorMsg = await result.text();
      throw new Error(errorMsg);
    }
  }

  if (txResults.length > 0) console.log('Broadcasted transactions:');
  txResults.forEach(txId => {
    console.log(`${rpcClient.url}/extended/v1/tx/0x${txId}`);
  });
};

run()
  .then(() => {
    console.log('Finished successfully.');
    process.exit();
  })
  .catch(error => {
    console.error('Error while running:');
    console.error(error);
    process.exit(1);
  });
