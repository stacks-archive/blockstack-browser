import React from 'react';
import { Box, Flex, Text } from '@stacks/ui';
import styled from '@emotion/styled';

const BannerText = styled(Text)`
  font-size: 11px;
  position: relative;
  top: -2px;
  font-weight: 600;
`;

export const TestnetBanner: React.FC = ({ ...rest }) => {
  return (
    <Flex height="24px" bg="white" alignItems="center" justifyContent="space-between" {...rest}>
      <Flex width="100%" alignItems="center">
        <Box textAlign="center" width="100%" backgroundColor="rgba(249, 161, 77, 0.12)">
          <BannerText color="orange">Testnet mode</BannerText>
        </Box>
      </Flex>
    </Flex>
  );
};
