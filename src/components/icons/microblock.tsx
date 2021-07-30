import React from 'react';
import { Box, BoxProps } from '@stacks/ui';
import { FiZap } from 'react-icons/fi';

export const MicroblockIcon: React.FC<BoxProps> = props => <Box as={FiZap} {...props} />;
