import { SpaceBetween } from '@components/space-between';
import { Stack, StackProps } from '@stacks/ui';
import { AssetAvatar } from '@components/stx-avatar';
import { Caption, Title } from '@components/typography';
import React from 'react';
import { forwardRefWithAs } from '@stacks/ui-core';
import { usePressable } from '@components/item-hover';

export const AssetItem = forwardRefWithAs(
  (
    {
      isPressable,
      avatar,
      title,
      caption,
      amount,
      ...rest
    }: {
      isPressable?: boolean;
      avatar: string;
      title: string;
      caption?: string;
      amount: string;
    } & StackProps,
    ref
  ) => {
    const [component, bind] = usePressable(isPressable);

    return (
      <SpaceBetween
        as={'button'}
        display="flex"
        textAlign="left"
        outline={0}
        position="relative"
        ref={ref as any}
        {...rest}
        {...bind}
      >
        <Stack spacing="base" isInline>
          <AssetAvatar size="36px" gradientString={avatar} useStx={caption === 'STX'} color="white">
            {title[0]}
          </AssetAvatar>
          <Stack>
            <Title>{title}</Title>
            {caption && <Caption>{caption}</Caption>}
          </Stack>
        </Stack>
        <Title>{amount}</Title>
        {component}
      </SpaceBetween>
    );
  }
);
