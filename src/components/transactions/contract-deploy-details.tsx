import React, { useState } from 'react';
import { useTxState } from '@common/hooks/use-tx-state';
import { CodeBlock, Stack, color, BoxProps } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { Prism } from '@common/clarity-prism';
import { AttachmentRow } from './attachment-row';
import { Caption, Title } from '@components/typography';
import { Divider } from '@components/divider';
import { ContractPreview } from '@components/transactions/contract-preview';
import { RowItem } from '@components/transactions/row-item';
import { useTransactionRequest } from '@common/hooks/use-transaction';

function ContractCodeSection() {
  const { pendingTransaction } = useTxState();
  const { currentAccount, currentAccountStxAddress } = useWallet();
  if (
    !pendingTransaction ||
    pendingTransaction.txType !== 'smart_contract' ||
    !currentAccount ||
    !currentAccountStxAddress
  ) {
    return null;
  }

  return (
    <CodeBlock
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      backgroundColor="ink.1000"
      width="100%"
      code={pendingTransaction.codeBody}
      Prism={Prism as any}
    />
  );
}

function TabButton({ isActive, ...props }: { isActive?: boolean } & BoxProps) {
  return (
    <Caption
      as="button"
      border={0}
      borderRadius="8px"
      px="base"
      py="base"
      bg={isActive ? color('bg-4') : 'transparent'}
      fontWeight={isActive ? 600 : 500}
      {...props}
    />
  );
}

export const ContractDeployDetails: React.FC = () => {
  const pendingTransaction = useTransactionRequest();
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const [tab, setTab] = useState<'details' | 'code'>('details');
  if (
    !pendingTransaction ||
    pendingTransaction.txType !== 'smart_contract' ||
    !currentAccount ||
    !currentAccountStxAddress
  ) {
    return null;
  }
  return (
    <Stack spacing="loose">
      <Stack spacing="0" isInline>
        <TabButton onClick={() => setTab('details')} isActive={tab === 'details'}>
          Details
        </TabButton>
        <TabButton onClick={() => setTab('code')} isActive={tab === 'code'}>
          Code
        </TabButton>
      </Stack>
      {tab === 'details' ? (
        <Stack
          spacing="loose"
          border="4px solid"
          borderColor={color('border')}
          borderRadius="12px"
          py="extra-loose"
          px="base-loose"
        >
          <Title as="h2" fontWeight="500">
            Contract deploy details
          </Title>
          <ContractPreview
            contractAddress={currentAccountStxAddress}
            contractName={pendingTransaction.contractName}
          />
          <Stack spacing="base-loose" divider={<Divider />}>
            {currentAccountStxAddress && (
              <RowItem name="Contract address" value={currentAccountStxAddress} type="Principal" />
            )}
            <RowItem name="Contract name" value={pendingTransaction.contractName} type="String" />
            {pendingTransaction.attachment && <AttachmentRow />}
          </Stack>
        </Stack>
      ) : (
        <ContractCodeSection />
      )}
    </Stack>
  );
};
