import { useContext, useState, useEffect } from 'react';
import { AppContext } from '@common/context';
import { getRPCClient } from './utils';
import { useSTXAddress } from './use-stx-address';

export const useFaucet = () => {
  const stxAddress = useSTXAddress();
  const state = useContext(AppContext);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [txId, setTxId] = useState('');
  const [error, setError] = useState('');
  const client = getRPCClient();

  interface FaucetResponse {
    txId?: string;
    success: boolean;
  }

  const submit = async (stxAddress: string) => {
    setWaiting(true);
    const waitForBalance = async (currentBalance: number, attempts: number) => {
      const { balance } = await client.fetchAccount(stxAddress);
      if (attempts > 18) {
        setError(
          "It looks like your transaction still isn't confirmed after a few minutes. Something may have gone wrong."
        );
        setWaiting(false);
      }
      if (balance.toNumber() > currentBalance) {
        setWaiting(false);
        setBalance(balance.toNumber());
        return;
      }
      setTimeout(() => {
        waitForBalance(currentBalance, attempts + 1);
      }, 10000);
    };
    try {
      const url = `${client.url}/sidecar/v1/debug/faucet?address=${stxAddress}`;
      const res = await fetch(url, {
        method: 'POST',
      });
      const data: FaucetResponse = await res.json();
      console.log(data);
      if (data.txId) {
        setTxId(data.txId);
        const { balance } = await client.fetchAccount(stxAddress);
        await waitForBalance(balance.toNumber(), 0);
      } else {
        setError('Something went wrong when requesting the faucet.');
      }
    } catch (e) {
      setError('Something went wrong when requesting the faucet.');
      setLoading(false);
      console.error(e.message);
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      if (stxAddress) {
        setLoading(true);
        try {
          const { balance } = await client.fetchAccount(stxAddress);
          setBalance(balance.toNumber());
          if (balance.toNumber() === 0) {
            void submit(stxAddress);
          }
        } catch (error) {
          setError('We were unable to connect to the Stacks Blockchain');
        }

        setLoading(false);
      }
    };
    void getBalance();
  }, [state.userData]);

  return {
    balance,
    loading,
    waiting,
    error,
    txId,
  };
};
