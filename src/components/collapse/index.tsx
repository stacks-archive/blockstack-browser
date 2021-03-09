import React from 'react';
import { Flex, Box, Text, BoxProps, ChevronIcon } from '@stacks/ui';
import { useHover } from 'use-events';
import { useAnalytics } from '@common/hooks/use-analytics';

interface TitleProps extends BoxProps {
  isFirst: boolean;
  isOpen: boolean;
  hovered: boolean;
}

const TitleElement: React.FC<TitleProps> = ({ onClick, isFirst, isOpen, hovered, title }) => (
  <Flex
    alignItems="center"
    borderBottom={!isOpen ? '1px solid' : undefined}
    borderTop={isFirst ? '1px solid' : 'unset'}
    borderColor="#E5E5EC" // this is not currently in the UI lib, asked jasper about it but he was out of office
    pt={3}
    pb={isOpen ? 0 : 3}
    justifyContent="space-between"
    onClick={onClick}
  >
    <Box>
      <Text color={isOpen || hovered ? 'ink' : 'ink.600'}>{title}</Text>
    </Box>
    <Box color="ink.300">
      <ChevronIcon direction={isOpen ? 'up' : 'down'} />
    </Box>
  </Flex>
);

interface BodyProps {
  body: string;
}

const Body: React.FC<BodyProps> = ({ body }) => (
  <Box
    borderBottom="1px solid"
    borderColor="#E5E5EC" // this is not currently in the UI lib, asked jasper about it but he was out of office
    py={3}
  >
    <Text color="ink.600">
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </Text>
  </Box>
);

interface Data {
  title: string;
  body: string;
  tracking?: string;
  icon?: string;
}

interface CollapseProps extends BoxProps {
  data: Data[];
}

/**
 * This component renders a list of clickable items that
 * will reveal content onClick, then hide it on any other
 * onClick of an item
 */
export const Collapse: React.FC<CollapseProps> = ({ data, ...rest }) => {
  const [open, setOpen] = React.useState<number | null>(null);
  const { doTrack } = useAnalytics();
  const handleOpen = (key: number) => (key === open ? setOpen(null) : setOpen(key));
  return (
    <Box px={6} fontSize="12px" {...rest}>
      {/*
          It's important to include the rest of the props
          because in certain cases we want to add/adjust spacing,
          eg if this is contained in <Stack> it will add
          spacing automatically

          A pattern we're trying to follow is that these components
          will not have margin in and of themselves. No component should
          have default whitespace
      */}
      {data.map(({ title, body, tracking }, key) => {
        const [hovered, bind] = useHover();
        return (
          <Box key={key} cursor={hovered ? 'pointer' : undefined} lineHeight="16px" {...bind}>
            <TitleElement
              onClick={() => {
                tracking && doTrack(tracking);
                handleOpen(key);
              }}
              isFirst={key === 0}
              title={title}
              hovered={hovered}
              isOpen={key === open}
            />
            {open === key ? <Body body={body} /> : null}
          </Box>
        );
      })}
    </Box>
  );
};
