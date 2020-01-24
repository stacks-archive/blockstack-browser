import React from 'react';

import { Box, Stack } from '@blockstack/ui';
import { Title, Body } from '../typography';

interface ScreenBodyProps {
  title: string;
  body?: (string | JSX.Element)[];
}

export const ScreenBody: React.FC<ScreenBodyProps> = ({ title, body }) => (
  <Box p={5}>
    <Stack spacing={2}>
      <Title>{title}</Title>
      <Stack spacing={[3, 4]}>
        {body && body.length ? body.map((text, key) => <Body key={key}>{text}</Body>) : body}
      </Stack>
    </Stack>
  </Box>
);
