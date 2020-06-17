import React, { useState } from 'react';
import { Box, Flex, Text, BoxProps } from '@blockstack/ui';

export interface Tab {
  title: string | React.ReactNode;
  key: string;
  content: React.ReactNode;
  hide?: boolean;
}

export interface TabHeaderProps extends BoxProps {
  active: boolean;
  tab: Tab;
}

const getBorderProps = (active: boolean) => {
  if (active) {
    return {
      borderBottomWidth: '1px',
      borderColor: 'blue',
    };
  }
  return {};
};

const getTextProps = (active: boolean) => {
  if (active) {
    return {
      color: 'blue',
      fontWeight: 600,
    };
  }
  return {};
};

const TabHeader: React.FC<TabHeaderProps> = ({ tab, active, ...rest }) => {
  return (
    <Box mr={2} py={3} {...getBorderProps(active)} {...rest}>
      <Text fontSize={0} {...getTextProps(active)} cursor="pointer">
        {tab.title}
      </Text>
    </Box>
  );
};

interface TabBodyProps extends BoxProps {
  tab: Tab;
}

const TabBody: React.FC<TabBodyProps> = ({ tab }) => {
  return (
    <Box width="100%" px={3} py={3} borderTopWidth="1px" borderColor="gray.light">
      {tab.content}
    </Box>
  );
};

export interface TabbedCardProps extends BoxProps {
  tabs: Tab[];
}

export const TabbedCard: React.FC<TabbedCardProps> = ({ tabs, ...rest }) => {
  const [activeKey, setActiveKey] = useState(tabs[0].key);

  const activeTab = tabs.find(tab => tab.key === activeKey);

  const Header = tabs.map(tab => {
    if (tab.hide) {
      return null;
    }
    return (
      <TabHeader
        tab={tab}
        active={tab.key === activeKey}
        onClick={() => {
          setActiveKey(tab.key);
        }}
        key={tab.key}
      />
    );
  });
  return (
    <Flex borderWidth="1px" borderColor="gray.light" borderRadius="8px" {...rest} wrap="wrap">
      <Box width="100%">
        <Flex px={3} width="100%">
          {Header}
        </Flex>
      </Box>
      {activeTab && (
        <Box width="100%">
          <Flex width="100%">
            <TabBody tab={activeTab} />
          </Flex>
        </Box>
      )}
    </Flex>
  );
};
