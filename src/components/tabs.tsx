import { Box, BoxProps, color, Stack } from '@stacks/ui';
import React from 'react';

const TabButton = ({
  isActive,
  label,
  ...rest
}: { isActive?: boolean; label: string } & BoxProps) => {
  return (
    <Box
      flexGrow={1}
      px="base"
      py="tight"
      textAlign="center"
      borderRadius="8px"
      color={isActive ? color('text-title') : color('text-caption')}
      fontSize={1}
      fontWeight={isActive ? 500 : 400}
      as="button"
      _hover={!isActive ? { color: color('text-title') } : undefined}
      border={0}
      position="relative"
      zIndex={4}
      {...rest}
    >
      {label}
    </Box>
  );
};

function BackgroundPill({ alignment }: { alignment: 'start' | 'end' }) {
  return (
    <Box
      position="absolute"
      height="calc(100% - 8px)"
      width="calc(50% - 4px)"
      bg={color('bg')}
      top="4px"
      transition="all 0.65s cubic-bezier(0.23, 1, 0.32, 1)"
      left={0}
      transform={alignment === 'start' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))'}
      borderRadius="8px"
    />
  );
}

interface Tabs {
  slug: string;
  label: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabClick,
  ...rest
}: {
  tabs: Tabs[];
  activeTab: number;
  onTabClick: (index: number) => void;
}) {
  return (
    <Stack
      position="relative"
      isInline
      borderRadius="8px"
      bg={color('bg-4')}
      p="extra-tight"
      width="100%"
      flexShrink={0}
      {...rest}
    >
      <BackgroundPill alignment={activeTab === 0 ? 'start' : 'end'} />
      <>
        {tabs.map((tab, index) => (
          <TabButton
            onClick={() => onTabClick(index)}
            isActive={activeTab === index}
            key={tab.slug}
            label={tab.label}
          />
        ))}
      </>
    </Stack>
  );
}
