import React, { useMemo, useState, useEffect } from 'react';
import { Box, Text, Flex, Input } from '@stacks/ui';
import { useCombobox } from 'downshift';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { getAssetStringParts, toHumanReadableStx, truncateMiddle } from '@stacks/ui-utils';
import { Asset, searchInputStore, selectedAssetStore } from '@store/recoil/asset-search';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { LoadingRectangle } from '../loading-rectangle';
import type { AddressBalanceResponse } from '@blockstack/stacks-blockchain-api-types';
import { AssetResult } from './asset-search-result';
import { SelectedAsset } from './selected-asset';

export const AssetSearchField: React.FC = () => {
  const balancesLoadable = useFetchBalances();
  const selectedAsset = useRecoilValue(selectedAssetStore);
  const setSelectedAsset = useSetRecoilState(selectedAssetStore);
  const [searchInput, setSearchInput] = useRecoilState(searchInputStore);
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
    openMenu,
  } = useCombobox({
    items: searchResults,
    initialIsOpen: true,
    inputValue: searchInput,
    defaultIsOpen: false,
    selectedItem: selectedAsset,
    itemToString: item => {
      return item?.contractAddress || item?.name || '';
    },
    onSelectedItemChange: ({ selectedItem }) => {
      setSelectedAsset(selectedItem || undefined);
    },
  });

  useEffect(() => {
    console.log('updating search results');
    setSearchResults(assets);
  }, [assets]);

  const labelRef = React.useRef(null);
  const comboRef = React.useRef(null);

  const results = searchResults.map((asset, index) => {
    return (
      <AssetResult
        asset={asset}
        index={index}
        key={asset.contractAddress || asset.name}
        highlighted={highlightedIndex === index}
        {...getItemProps({ item: asset, index })}
        onClick={() => {
          setSelectedAsset(asset);
        }}
      />
    );
  });

  return (
    <Flex flexDirection="column" mt="loose" width="100%" position="relative" overflow="visible">
      <Box width="100%">
        <Text
          as="label"
          display="block"
          mb="tight"
          fontSize={1}
          fontWeight="500"
          htmlFor="amount"
          {...getLabelProps({ ref: labelRef })}
        >
          Choose an asset:
        </Text>
      </Box>
      <Box width="100%" {...getComboboxProps({ ref: comboRef })}>
        <Input
          {...getInputProps()}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const { value } = e.currentTarget;
            setSearchInput(value);
            setSearchResults(
              assets.filter(item => item.name.toLowerCase().includes(value.toLowerCase() || ''))
            );
          }}
          width="100%"
          placeholder="Search for an asset"
          onFocus={() => {
            openMenu();
          }}
          autoFocus
        />
      </Box>
      <Flex
        flexDirection="column"
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

export const AssetSearch: React.FC = () => {
  const balancesLoadable = useFetchBalances();
  const selectedAsset = useRecoilValue(selectedAssetStore);

  if (selectedAsset) {
    return <SelectedAsset />;
  }

  if (balancesLoadable.state === 'loading' && !balancesLoadable.value) {
    return (
      <Box my="loose">
        <LoadingRectangle width="80%" height="32px" />
      </Box>
    );
  }

  return <AssetSearchField />;
};
