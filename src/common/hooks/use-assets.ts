import { useFetchBalances } from '@common/hooks/use-account-info';
import { Asset } from '@store/recoil/asset-search';
import { useMemo } from 'react';
import { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { getAssetStringParts, toHumanReadableStx, truncateMiddle } from '@stacks/ui-utils';

export const useAssets = () => {
  const balancesLoadable = useFetchBalances();
  const balancesJSON = JSON.stringify(balancesLoadable.value);

  const assets: Asset[] = useMemo(() => {
    if (!balancesJSON) return [];
    const balances: AddressBalanceResponse = JSON.parse(balancesJSON);
    const _assets: Asset[] = [];
    if (!balances) return _assets;
    _assets.push({
      type: 'stx',
      contractAddress: '',
      balance: toHumanReadableStx(balances.stx.balance),
      subtitle: 'STX',
      name: 'Stacks Token',
    });
    Object.keys(balances.fungible_tokens).forEach(key => {
      const { balance } = balances.fungible_tokens[key];
      const { address, contractName, assetName } = getAssetStringParts(key);
      _assets.push({
        type: 'ft',
        subtitle: `${truncateMiddle(address)}.${contractName}`,
        contractAddress: key,
        name: assetName,
        balance: balance,
      });
    });
    return _assets;
  }, [balancesJSON]);

  return assets;
};
