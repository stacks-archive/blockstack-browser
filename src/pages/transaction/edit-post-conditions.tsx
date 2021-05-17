import React, { Suspense, useEffect } from 'react';
import { Box, Button, Flex, Text, Input } from '@stacks/ui';
import { TxLoading } from '@pages/transaction';
import { PopupContainer } from '@components/popup/container';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  postConditionsStore,
  currentPostConditionStore,
  currentPostConditionIndexStore,
} from '@store/transaction';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/types';
import { AssetSearch } from '@components/asset-search/asset-search';
import { object, string, number } from 'yup';
import {
  makeStandardSTXPostCondition,
  makeStandardFungiblePostCondition,
  PostCondition,
  FungibleConditionCode,
  NonFungibleConditionCode,
  createAssetInfo,
  PostConditionType,
} from '@stacks/transactions';
import { useFormik } from 'formik';
import { getAssetStringParts } from '@stacks/ui-utils';
import BN from 'bn.js';
import { useWallet } from '@common/hooks/use-wallet';
import { Header } from '@components/header';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';

type PostConditionCode = FungibleConditionCode | NonFungibleConditionCode;

export const EditPostConditionsPage: React.FC = () => {
  const doChangeScreen = useDoChangeScreen();
  return (
    <PopupContainer
      header={
        <Header
          title="Add a constraint"
          onClose={() => doChangeScreen(ScreenPaths.TRANSACTION_POPUP)}
        />
      }
    >
      <Suspense fallback={<TxLoading />}>
        <EditPostConditions />
      </Suspense>
    </PopupContainer>
  );
};

interface PostConditionFormState {
  code: PostConditionCode;
  amount: string;
}

export const EditPostConditions: React.FC = () => {
  const setPostConditions = useSetRecoilState(postConditionsStore);
  const postConditions = useRecoilValue(postConditionsStore);
  const currentPostCondition = useRecoilValue(currentPostConditionStore);
  const currentPostConditionIndex = useRecoilValue(currentPostConditionIndexStore);
  const { selectedAsset } = useSelectedAsset();
  const { currentAccountStxAddress } = useWallet();
  const doChangeScreen = useDoChangeScreen();

  useEffect(() => {
    if (selectedAsset?.type === 'nft') {
    }
  }, [selectedAsset]);

  const getCodes = () => {
    const codeNames = Object.values(FungibleConditionCode).filter(
      c => typeof c === 'number'
    ) as FungibleConditionCode[];
    return codeNames.map(code => ({
      code,
      name: FungibleConditionCode[code],
    }));
  };

  const codeOptions = getCodes().map(({ name, code }) => (
    <option key={code} value={code}>
      {name}
    </option>
  ));

  const validationSchema = object().shape({
    amount: string().matches(/^\d+$/, '"Amount" must be a valid integer.'),
    code: number(),
  });

  const getInitialAmount = () => {
    if (!currentPostCondition) {
      return '0';
    }
    if (currentPostCondition.conditionType === PostConditionType.NonFungible) {
      // Not supported yet - needs to be the condition asset ID
      return '0';
    }
    return currentPostCondition.amount.toString(10);
  };

  const initialValues: PostConditionFormState = {
    code: currentPostCondition?.conditionCode || FungibleConditionCode.Equal,
    amount: getInitialAmount(),
  };
  const form = useFormik({
    validationSchema,
    initialValues,
    validateOnChange: true,
    onSubmit: values => {
      let pc: PostCondition;
      if (!selectedAsset) {
        // TODO: error;
        return;
      }
      const address = currentAccountStxAddress || '';
      if (selectedAsset.type === 'ft') {
        const {
          address: contractAddress,
          contractName,
          assetName,
        } = getAssetStringParts(selectedAsset.contractAddress);
        const assetInfo = createAssetInfo(contractAddress, contractName, assetName);
        const code = parseInt(values.code as unknown as string) as FungibleConditionCode;
        pc = makeStandardFungiblePostCondition(address, code, new BN(values.amount, 10), assetInfo);
      } else if (selectedAsset.type === 'stx') {
        const code = parseInt(values.code as unknown as string) as FungibleConditionCode;
        pc = makeStandardSTXPostCondition(address, code, new BN(values.amount, 10));
      } else {
        throw new Error('Unable to add post conditions to NFT transfer at this time.');
      }
      if (currentPostConditionIndex === undefined) {
        setPostConditions([...postConditions, pc]);
      } else {
        setPostConditions(pcs => {
          const _postConditions = [...pcs];
          _postConditions[currentPostConditionIndex] = pc;
          return _postConditions;
        });
      }
      doChangeScreen(ScreenPaths.TRANSACTION_POPUP);
    },
  });
  return (
    <>
      <Box>
        <AssetSearch />
      </Box>
      <Box width="100%" mt="base-loose">
        <Flex>
          <Box gap="10px" width="50%">
            <Text fontSize={1} fontWeight="500" display="block" mb="base">
              Condition
            </Text>
            <select value={form.values.code} name="code" onChange={form.handleChange}>
              {codeOptions}
            </select>
          </Box>
          <Box gap="10px" width="50%">
            <Text fontSize={1} fontWeight="500" display="block">
              Amount
            </Text>
            <Input
              width="100%"
              value={form.values.amount}
              onChange={form.handleChange}
              name="amount"
            />
          </Box>
        </Flex>
      </Box>
      <Box>
        {form.errors.amount && (
          <Text color="red" my="base" fontSize={1}>
            {form.errors.amount}
          </Text>
        )}
      </Box>
      <Box flexGrow={1} />
      <Box width="100%" alignSelf="flex-end" onClick={form.submitForm}>
        <Button width="100%">Save</Button>
      </Box>
    </>
  );
};
