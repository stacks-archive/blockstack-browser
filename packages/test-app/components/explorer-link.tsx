import React from 'react';
import { Link } from '@components/link';
import { Box } from '@blockstack/ui';

interface LinkProps {
  txId: string;
  text?: string;
  skipConfirmCheck?: boolean;
}

export const ExplorerLink: React.FC<LinkProps> = ({ txId, text }) => {
  let id = txId.replace('"', '');
  if (!id.startsWith('0x') && !id.includes('.')) {
    id = `0x${id}`;
  }
  const url = `https://testnet-explorer.blockstack.org/txid/${id}`;
  return (
    <Box>
      <Link onClick={() => window.open(url, '_blank')} color="blue" display="inline-block" my={3}>
        {text || 'View transaction in explorer'}
      </Link>
    </Box>
  );
};
