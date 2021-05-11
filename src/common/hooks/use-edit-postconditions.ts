import { useSetRecoilState } from 'recoil';
import { currentPostConditionIndexStore, postConditionsStore } from '@store/transaction';
import { Asset, selectedAssetStore } from '@store/asset-search';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { useCallback } from 'react';
import { addressToString, PostCondition, PostConditionType } from '@stacks/transactions';
import { toHumanReadableStx, truncateMiddle } from '@stacks/ui-utils';
import { ScreenPaths } from '@store/types';

function useEditPostcondition({ pc, index }: { pc: PostCondition; index: number }) {
  const setCurrentPostConditionIndex = useSetRecoilState(currentPostConditionIndexStore);
  const setSelectedAsset = useSetRecoilState(selectedAssetStore);
  const balancesLoadable = useFetchBalances();
  const doChangeScreen = useDoChangeScreen();
  const balancesJSON = JSON.stringify(balancesLoadable.value);
  return useCallback(() => {
    setCurrentPostConditionIndex(index);
    let asset: Asset | undefined = undefined;
    const balances = JSON.parse(balancesJSON);
    if (pc.conditionType === PostConditionType.STX) {
      asset = {
        name: 'Stacks Token',
        contractAddress: '',
        balance: toHumanReadableStx(balances?.stx.balance || '0'),
        subtitle: '',
        type: 'stx',
      };
    } else if (pc.conditionType === PostConditionType.NonFungible) {
      const { assetInfo } = pc;
      const address = `${addressToString(assetInfo.address)}.${assetInfo.contractName}::${
        assetInfo.assetName.content
      }`;
      const balance = balances?.fungible_tokens[address]?.balance || '0';
      asset = {
        type: 'ft',
        subtitle: `${truncateMiddle(addressToString(assetInfo.address))}.${assetInfo.contractName}`,
        contractAddress: address,
        name: assetInfo.assetName.content,
        balance,
      };
    }
    setSelectedAsset(asset);
    doChangeScreen(ScreenPaths.EDIT_POST_CONDITIONS);
  }, [balancesJSON, setCurrentPostConditionIndex, doChangeScreen, index, pc, setSelectedAsset]);
}

export function usePostconditionActions(pc: PostCondition, index: number) {
  const setPostConditions = useSetRecoilState(postConditionsStore);
  const editPostCondition = useEditPostcondition({ pc, index });

  const removePostCondition = useCallback(() => {
    setPostConditions(pcs => {
      const _postConditions = [...pcs];
      _postConditions.splice(index, 1);
      return _postConditions;
    });
  }, [index, setPostConditions]);
  return {
    editPostCondition,
    removePostCondition,
  };
}
