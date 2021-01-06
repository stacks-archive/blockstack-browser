import React from 'react';
import { Flex, Box, Text, FlexProps } from '@stacks/ui';
import { Image } from '@components/image';

interface AccountAvatarProps extends FlexProps {
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
      alignItems="center"
      justifyContent="center"
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
