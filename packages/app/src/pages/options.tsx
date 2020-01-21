import * as React from 'react';
import { Flex, ThemeProvider, theme, CSSReset, Stack, Box } from '@blockstack/ui';
import { Seed } from '../components/seed';
import { DevActions } from '../components/dev-actions';

const OptionsApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CSSReset />
        <Flex wrap="wrap" py={5} px={4}>
          <Stack spacing={8} width="100%">
            <Box borderWidth="1px" p={5}>
              <Seed />
            </Box>
            <Box borderWidth="1px" p={5}>
              <DevActions />
            </Box>
          </Stack>
        </Flex>
      </React.Fragment>
    </ThemeProvider>
  );
};

export { OptionsApp };
