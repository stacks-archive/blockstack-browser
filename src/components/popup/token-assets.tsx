import React from 'react';
import { Stack, StackProps, color, Button, useClipboard } from '@stacks/ui';
import { AssetRow } from '../asset-row';
import { useFungibleTokenState, useStxTokenState } from '@common/hooks/use-assets';
import { Caption } from '@components/typography';
import { CollectibleAssets } from '@components/popup/collectible-assets';
import { useAccountBalances } from '@common/hooks/account/use-account-balances';
import { NoAssetsEmptyIllustration } from '@components/vector/no-assets';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { UserAreaSelectors } from '@tests/integration/user-area.selectors';

function FungibleAssets(props: StackProps) {
  const fungibleTokens = useFungibleTokenState();
  const balances = useAccountBalances();
  if (!balances) return null;

  const ftCount = Object.keys(balances.fungible_tokens);
  const noTokens = ftCount.length === 0;

  if (noTokens || !fungibleTokens) return null;
  return (
    <Stack spacing="loose" {...props}>
      {fungibleTokens?.map(asset => (
        <AssetRow key={asset.name} asset={asset} />
      ))}
    </Stack>
  );
}

function NoAssets(props: StackProps) {
  const currentAccount = useCurrentAccount();
  const { onCopy, hasCopied } = useClipboard(currentAccount?.address || '');
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
        borderRadius="10px"
        onClick={onCopy}
        data-testid={UserAreaSelectors.AccountBalancesCopyAddress}
      >
        {hasCopied ? 'Copied!' : 'Copy address'}
      </Button>
    </Stack>
  );
}

export const TokenAssets: React.FC<StackProps> = ({ ...props }) => {
  const stxToken = useStxTokenState();
  const balances = useAccountBalances();
  if (!balances) return null;

  const noAssets =
    stxToken.balance.isEqualTo(0) &&
    Object.keys(balances.fungible_tokens).length === 0 &&
    Object.keys(balances.non_fungible_tokens).length === 0;

  return noAssets ? (
    <NoAssets {...props} />
  ) : (
    <Stack pb="extra-loose" spacing="extra-loose" {...props}>
      {stxToken && stxToken.balance.isGreaterThan(0) && <AssetRow asset={stxToken} />}
      <FungibleAssets />
      <CollectibleAssets spacing="extra-loose" />
    </Stack>
  );
};
