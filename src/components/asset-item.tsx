import { SpaceBetween } from '@components/space-between';
import { Box, Stack, StackProps } from '@stacks/ui';
import { AssetAvatar } from '@components/stx-avatar';
import { Caption, Text } from '@components/typography';
import React, { memo } from 'react';
import { forwardRefWithAs } from '@stacks/ui-core';
import { usePressable } from '@components/item-hover';
import { Tooltip } from '@components/tooltip';
import { getFormattedAmount } from '@common/token-utils';
import { FiCornerDownRight, FiInfo } from 'react-icons/fi';
import { color, Flex } from '@stacks/ui';

const AssetCaption: React.FC<{ caption?: string; show?: boolean }> = ({ caption, show }) =>
  caption ? (
    <Flex flexDirection="row">
      <Caption>{caption}</Caption>{' '}
      {show ? (
        <>
          <Caption ml={1}> • Microblock </Caption>

          <Tooltip placement="right-end" label={'Learn more about microblocks'}>
            <Stack isInline>
              {/* TODO UPDATE */}
              <a href="https://hiro.so" target="_blank">
                <Box
                  _hover={{ cursor: 'pointer' }}
                  size="12px"
                  color={color('text-caption')}
                  as={FiInfo}
                  ml={1}
                />
              </a>
            </Stack>
          </Tooltip>
        </>
      ) : (
        ''
      )}
    </Flex>
  ) : null;

const SubBalance: React.FC<{ amount: string }> = ({ amount }) =>
  amount ? (
    <Text
      fontVariantNumeric="tabular-nums"
      textAlign="right"
      fontSize="12px"
      color={color('text-caption')}
    >
      <Box
        strokeWidth={2}
        as={FiCornerDownRight}
        style={{ display: 'inline-block', paddingRight: '2px' }}
      />
      {amount}
    </Text>
  ) : null;

export const AssetItem = memo(
  forwardRefWithAs(
    (
      {
        isPressable,
        avatar,
        title,
        caption,
        amount,
        subAmount,
        ...rest
      }: {
        isPressable?: boolean;
        avatar: string;
        title: string;
        caption?: string;
        amount: string;
        subAmount?: string;
      } & StackProps,
      ref
    ) => {
      const [component, bind] = usePressable(isPressable);
      const formatted = getFormattedAmount(amount.toString());
      const subAmountFormatted = (subAmount && getFormattedAmount(subAmount)) ?? '';
      const isDifferent = !!subAmountFormatted && formatted.value !== subAmountFormatted.value;
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
              isUnanchored={isDifferent}
            >
              {title[0]}
            </AssetAvatar>

            <Stack flexGrow={1}>
              <SpaceBetween width="100%">
                <Box>
                  <Text>{title}</Text>
                  <AssetCaption caption={caption} show={isDifferent} />
                </Box>
                <Box>
                  <Tooltip
                    placement="left-start"
                    label={formatted.isAbbreviated ? amount : undefined}
                  >
                    <Text fontVariantNumeric="tabular-nums" textAlign="right">
                      {formatted.value}
                    </Text>
                  </Tooltip>
                  {isDifferent ? (
                    <SubBalance amount={subAmountFormatted && subAmountFormatted.value} />
                  ) : null}
                </Box>
              </SpaceBetween>
            </Stack>
          </Stack>
          {component}
        </Box>
      );
    }
  )
);
