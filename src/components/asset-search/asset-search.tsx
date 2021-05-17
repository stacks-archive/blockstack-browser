import React, { useState, useEffect } from 'react';
import { Box, Text, Flex, Input } from '@stacks/ui';
import { useCombobox } from 'downshift';
import { searchInputStore } from '@store/asset-search';
import { useRecoilState } from 'recoil';
import { LoadingRectangle } from '../loading-rectangle';
import { AssetResult } from './asset-search-result';
import { SelectedAsset } from './selected-asset';
import { useAssets } from '@common/hooks/use-assets';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';
import { AssetWithMeta } from '@store/tokens';

export const AssetSearchField: React.FC<{ autoFocus?: boolean }> = ({ autoFocus, ...rest }) => {
  const assets = useAssets();

  const { selectedAsset, handleUpdateSelectedAsset } = useSelectedAsset();

  const [searchInput, setSearchInput] = useRecoilState(searchInputStore);
  const [searchResults, setSearchResults] = useState<AssetWithMeta[]>(assets.value || []);

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
      handleUpdateSelectedAsset(selectedItem || undefined);
    },
  });

  useEffect(() => {
    assets.value && setSearchResults(assets.value);
  }, [assets, searchResults]);

  const labelRef = React.useRef(null);
  const comboRef = React.useRef(null);

  if (assets.isLoading) return null;
  const results = searchResults.map((asset, index) => {
    return (
      <AssetResult
        asset={asset}
        index={index}
        key={asset.contractAddress || asset.name}
        highlighted={highlightedIndex === index}
        {...getItemProps({ item: asset, index })}
        onClick={() => {
          handleUpdateSelectedAsset(asset);
        }}
      />
    );
  });

  return (
    <Flex flexDirection="column" width="100%" position="relative" overflow="visible" {...rest}>
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
          Choose an asset
        </Text>
      </Box>
      <Box width="100%" {...getComboboxProps({ ref: comboRef })}>
        <Input
          {...getInputProps()}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const { value } = e.currentTarget;
            setSearchInput(value);
            assets.value &&
              setSearchResults(
                assets.value.filter(item =>
                  item.name.toLowerCase().includes(value.toLowerCase() || '')
                )
              );
          }}
          width="100%"
          placeholder="Search for an asset"
          onFocus={() => {
            openMenu();
          }}
          autoFocus={autoFocus}
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

export const AssetSearch: React.FC<{ autoFocus?: boolean }> = ({ autoFocus, ...rest }) => {
  const { selectedAsset, handleUpdateSelectedAsset } = useSelectedAsset();
  const assets = useAssets();

  useEffect(() => {
    if (assets.value && assets.value.length === 1 && !selectedAsset) {
      handleUpdateSelectedAsset(assets.value[0]);
    }
  }, [handleUpdateSelectedAsset, assets, selectedAsset]);

  if (assets.value && selectedAsset) {
    return <SelectedAsset hideArrow={assets?.value.length === 1} {...rest} />;
  }

  if (assets.isLoading) {
    return (
      <Box {...rest}>
        <LoadingRectangle width="80%" height="32px" />
      </Box>
    );
  }

  return <AssetSearchField autoFocus={autoFocus} {...rest} />;
};
