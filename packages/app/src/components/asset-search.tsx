import React, { useMemo, useState, useEffect } from 'react';
import { Box, Text, Flex, Input, BoxProps, ChevronIcon } from '@stacks/ui';
import { AssetAvatar } from '@components/stx-avatar';
import { useCombobox } from 'downshift';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { getAssetStringParts, toHumanReadableStx, truncateMiddle } from '@stacks/ui-utils';
import { AssetRow } from '@components/popup/asset-row';
import { Asset, selectedAssetStore } from '@store/recoil/asset-search';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { LoadingRectangle } from './loading-rectangle';
import type { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { microStxToStx } from '@common/stacks-utils';
import BigNumber from 'bignumber.js';

interface AssetResultProps extends BoxProps {
  asset: Asset;
  highlighted: boolean;
  index: number;
}

export const AssetResult: React.FC<AssetResultProps> = props => {
  const { asset, highlighted, ...otherProps } = props;

  return (
    <AssetRow
      key={`${asset.contractAddress}.${asset.type}`}
      name={asset.name}
      subtitle={asset.subtitle}
      friendlyName={asset.name}
      value={asset.balance}
      backgroundColor={highlighted ? 'ink.150' : 'white'}
      {...otherProps}
      p="base-tight"
      mb="0"
    />
  );
};

const SelectedAsset: React.FC<{ setInput: (input: string) => void }> = ({ setInput }) => {
  const balancesLoadable = useFetchBalances();
  const selectedAsset = useRecoilValue(selectedAssetStore);
  const setSelectedAsset = useSetRecoilState(selectedAssetStore);

  const balance = useMemo<string | undefined>(() => {
    const balances = balancesLoadable.value;
    if (!selectedAsset || !balances) return;
    if (selectedAsset.type === 'stx') {
      const stx = microStxToStx(balances.stx.balance);
      return stx.decimalPlaces(6).toFormat();
    } else {
      const token = Object.keys(balances.fungible_tokens).find(contract => {
        return contract.startsWith(selectedAsset.contractAddress);
      });
      if (token) {
        const balanceBN = new BigNumber(balances.fungible_tokens[token].balance);
        return balanceBN.toFormat();
      }
    }
    return;
  }, [selectedAsset, balancesLoadable]);

  if (!selectedAsset) {
    return null;
  }
  const { name } = selectedAsset;
  return (
    <Flex dir="column" mt="loose">
      <Box>
        <Text display="block" fontSize={1} fontWeight="500" mb="tight">
          Token
        </Text>
      </Box>
      <Box
        width="100%"
        px="base"
        py="base-tight"
        borderRadius="8px"
        borderColor="rgb(229, 229, 236)"
        borderWidth="1px"
        onClick={() => {
          setInput('');
          setSelectedAsset(undefined);
        }}
      >
        <Flex flexWrap="wrap" flexDirection="row">
          <Box width="24px" mr="base">
            <AssetAvatar
              useStx={name === 'Stacks Token'}
              gradientString={name}
              mr="tight"
              size="24px"
            >
              {name[0]}
            </AssetAvatar>
          </Box>
          <Box flexGrow={1}>
            <Text display="block" fontWeight="400" fontSize={2} color="ink.1000">
              {name}
            </Text>
          </Box>
          <Box px="base">
            {balance ? (
              <Text fontSize={2} color="ink.600">
                {balance}
              </Text>
            ) : (
              <LoadingRectangle height="16px" width="60px" />
            )}
          </Box>
          <Box textAlign="right" height="24px">
            <ChevronIcon
              size="24px"
              direction="down"
              cursor="pointer"
              opacity="70%"
              onClick={() => {
                setInput('');
                setSelectedAsset(undefined);
              }}
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export const AssetSearch: React.FC = () => {
  const balancesLoadable = useFetchBalances();
  const selectedAsset = useRecoilValue(selectedAssetStore);
  const setSelectedAsset = useSetRecoilState(selectedAssetStore);
  const balancesJSON = JSON.stringify(balancesLoadable.value);
  const [searchResults, setSearchResults] = useState<Asset[]>([]);

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

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    setInputValue,
    openMenu,
  } = useCombobox({
    items: searchResults,
    initialIsOpen: true,
    defaultIsOpen: true,
    selectedItem: selectedAsset,
    initialHighlightedIndex: 0,
    defaultHighlightedIndex: 0,
    itemToString: item => {
      return item?.name || '';
    },
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedAsset(selectedItem || undefined);
    },
    onInputValueChange: ({ inputValue }) => {
      setSearchResults(
        assets.filter(item => item.name.toLowerCase().includes(inputValue?.toLowerCase() || ''))
      );
    },
  });

  useEffect(() => {
    setSearchResults(assets);
  }, [assets]);

  const results = searchResults.map((asset, index) => {
    return (
      <AssetResult
        asset={asset}
        index={index}
        key={asset.name}
        highlighted={highlightedIndex === index}
        {...getItemProps({ item: asset, index })}
        onClick={() => {
          setSelectedAsset(asset);
        }}
      />
    );
  });

  if (selectedAsset) {
    return <SelectedAsset setInput={setInputValue} />;
  }

  if (balancesLoadable.state === 'loading') {
    return (
      <Box my="loose">
        <LoadingRectangle width="80%" height="32px" />
      </Box>
    );
  }

  return (
    <Flex dir="column" mt="loose" width="100%" position="relative" overflow="visible">
      <Box width="100%">
        <Text
          as="label"
          display="block"
          mb="tight"
          fontSize={1}
          fontWeight="500"
          htmlFor="amount"
          {...getLabelProps()}
        >
          Choose an asset:
        </Text>
      </Box>
      <Box width="100%" {...getComboboxProps()}>
        <Input
          {...getInputProps()}
          width="100%"
          placeholder="Search for an asset"
          onFocus={() => {
            openMenu();
          }}
          autoFocus
        />
      </Box>
      <Flex
        dir="column"
        {...getMenuProps()}
        boxShadow="0px 8px 16px rgba(27, 39, 51, 0.08);"
        borderRadius="6px"
        position="absolute"
        width="100%"
        top="77px"
        maxHeight="220px"
        border={isOpen ? '1px solid #E1E3E8' : 'none'}
        zIndex={1000}
        overflow="auto"
      >
        {isOpen ? results : null}
      </Flex>
    </Flex>
  );
};
