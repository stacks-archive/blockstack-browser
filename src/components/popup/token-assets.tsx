import React, { memo } from 'react';
import { Box, Stack, StackProps, Circle, color, Button, useClipboard } from '@stacks/ui';
import { AssetRow } from '../asset-row';
import { useFungibleTokenState, useStxTokenState } from '@common/hooks/use-assets';
import { Caption } from '@components/typography';
import { SpaceBetween } from '@components/space-between';
import { CollectibleAssets } from '@components/popup/collectible-assets';
import { useAccountBalances } from '@common/hooks/use-account-balances';
import { NoAssetsEmptyIllustration } from '@components/vector/no-assets';
import { useCurrentAccount } from '@common/hooks/use-current-account';

const LoadingAssetRowItem = memo((props: StackProps) => (
  <SpaceBetween {...props}>
    <Stack spacing="base" isInline>
      <Circle size="36px" bg={color('bg-4')} />
      <Stack>
        <Box height="14px" width="125px" bg={color('bg-4')} />
        <Box height="10px" width="64px" bg={color('bg-4')} />
      </Stack>
    </Stack>
    <Box height="16px" width="32px" bg={color('bg-4')} />
  </SpaceBetween>
));

function FungibleAssets(props: StackProps) {
  const fungibleTokens = useFungibleTokenState();
  const balances = useAccountBalances();
  if (!balances) return null;

  const fungibleTokensLoading = !fungibleTokens.value && fungibleTokens.state === 'loading';

  const ftCount = Object.keys(balances.fungible_tokens);
  const noTokens = ftCount.length === 0;

  if (noTokens) return null;
  return (
    <Stack spacing="loose" {...props}>
      {fungibleTokensLoading
        ? ftCount.map(item => <LoadingAssetRowItem key={item} />)
        : fungibleTokens?.value?.map(asset => <AssetRow key={asset.name} asset={asset} />)}
    </Stack>
  );
}

function NoAssets(props: StackProps) {
  const { stxAddress } = useCurrentAccount();
  const { onCopy, hasCopied } = useClipboard(stxAddress || '');
  return (
    <Stack
      py="extra-loose"
      spacing="extra-loose"
      justifyContent="center"
      alignItems="center"
      {...props}
    >
      <NoAssetsEmptyIllustration maxWidth="120px" />
      <Caption maxWidth="23ch" textAlign="center">
        Get started by sending some STX to your wallet.
      </Caption>
      <Button
        bg="#EEF2FB"
        _hover={{ bg: '#E5EBFA' }}
        color={color('brand')}
        borderRadius="12px"
        onClick={onCopy}
      >
        {hasCopied ? 'Copied!' : 'Copy address'}
      </Button>
    </Stack>
  );
}

export const TokenAssets: React.FC<StackProps> = memo(({ ...props }) => {
  const stxTokens = useStxTokenState();
  const balances = useAccountBalances();
  if (!balances) return null;

  const noAssets =
    !stxTokens.value &&
    Object.keys(balances.fungible_tokens).length === 0 &&
    Object.keys(balances.non_fungible_tokens).length === 0;

  return noAssets ? (
    <NoAssets {...props} />
  ) : (
    <Stack pb="extra-loose" spacing="extra-loose" {...props}>
      {stxTokens.value && <AssetRow asset={stxTokens.value} />}
      <FungibleAssets />
      <CollectibleAssets spacing="extra-loose" />
    </Stack>
  );
});
