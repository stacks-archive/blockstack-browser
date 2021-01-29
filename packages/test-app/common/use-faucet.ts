import { useContext, useState, useEffect } from 'react';
import { AppContext } from '@common/context';
import { getRPCClient } from './utils';
import { useSTXAddress } from './use-stx-address';

export const useFaucet = () => {
  const stxAddress = useSTXAddress();
  const state = useContext(AppContext);
  const [txId, setTxId] = useState('');
  const client = getRPCClient();

  interface FaucetResponse {
    txId?: string;
    success: boolean;
  }

  const submit = async (stxAddress: string) => {
    const waitForBalance = async (currentBalance: number, attempts: number) => {
      const { balance } = await client.fetchAccount(stxAddress);
      if (attempts > 18) {
      }
      if (balance.toNumber() > currentBalance) {
        return;
      }
      setTimeout(() => {
        void waitForBalance(currentBalance, attempts + 1);
      }, 10000);
    };
    try {
      console.log('Submitting faucet request.');
      const url = `${client.url}/extended/v1/debug/faucet?address=${stxAddress}`;
      const res = await fetch(url, {
        method: 'POST',
      });
      const data: FaucetResponse = await res.json();
      console.log(data);
      if (data.txId) {
        setTxId(data.txId);
        const { balance } = await client.fetchAccount(stxAddress);
        await waitForBalance(balance.toNumber(), 0);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      if (stxAddress) {
        try {
          const { balance } = await client.fetchAccount(stxAddress);
          if (balance.toNumber() === 0) {
            void submit(stxAddress);
          }
        } catch (error) {
          console.error('Unable to connect to Stacks Blockchain');
        }
      }
    };
    void getBalance();
  }, [state.userData]);

  return {
    txId,
  };
};
