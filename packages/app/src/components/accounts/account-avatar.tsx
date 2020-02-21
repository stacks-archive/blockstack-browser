import React from 'react';
import { Flex, Box, BoxProps, Text } from '@blockstack/ui';
import { Image } from '@components/image';

interface AccountAvatarProps extends BoxProps {
  username: string;
  avatar?: string;
}

export const AccountAvatar = ({ username, avatar, ...rest }: AccountAvatarProps) => {
  const firstLetter = username[0];
  return (
    <Flex
      overflow="hidden"
      flexShrink={0}
      bg="#007AFF"
      size="36px"
      borderRadius="100%"
      align="center"
      justify="center"
      {...rest}
    >
      {avatar && <Image src={avatar} alt={username} />}
      <Box>
        <Text color="white" textTransform="uppercase" display="block">
          {firstLetter}
        </Text>
      </Box>
    </Flex>
  );
};
