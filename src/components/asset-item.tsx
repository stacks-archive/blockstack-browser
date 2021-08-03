import { SpaceBetween } from '@components/space-between';
import { Box, Stack, StackProps } from '@stacks/ui';
import { AssetAvatar } from '@components/stx-avatar';
import { Caption, Text } from '@components/typography';
import React, { memo } from 'react';
import { forwardRefWithAs } from '@stacks/ui-core';
import { usePressable } from '@components/item-hover';
import { Tooltip } from '@components/tooltip';
import { getFormattedAmount } from '@common/token-utils';

export const AssetItem = memo(
  forwardRefWithAs(
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
      const formatted = getFormattedAmount(amount.toString());
      return (
        <Box
          as={isPressable ? 'button' : 'div'}
          display="flex"
          textAlign="left"
          outline={0}
          position="relative"
          ref={ref as any}
          flexGrow={1}
          spacing="base"
          {...rest}
          {...bind}
        >
          <Stack flexGrow={1} width="100%" isInline spacing="base">
            <AssetAvatar
              size="36px"
              gradientString={avatar}
              useStx={caption === 'STX'}
              color="white"
            >
              {title[0]}
            </AssetAvatar>

            <Stack flexGrow={1}>
              <SpaceBetween width="100%">
                <Text>{title}</Text>
                <Box>
                  <Tooltip
                    placement="left-start"
                    label={formatted.isAbbreviated ? amount : undefined}
                  >
                    <Text fontVariantNumeric="tabular-nums" textAlign="right">
                      {formatted.value}
                    </Text>
                  </Tooltip>
                </Box>
              </SpaceBetween>
              {caption && <Caption>{caption}</Caption>}
            </Stack>
          </Stack>
          {component}
        </Box>
      );
    }
  )
);
