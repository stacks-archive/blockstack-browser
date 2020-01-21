import React from 'react';
import { Flex, Box, Text } from '@blockstack/ui';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import { useHover } from 'use-events';
import { doTrack } from '../../../common/track';
import { BoxProps } from '@blockstack/ui/dist/box';
// import { doTrack } from '../../../common/track';

interface TitleProps extends BoxProps {
  isFirst: boolean;
  isOpen: boolean;
  hovered: boolean;
}

const TitleElement: React.FC<TitleProps> = ({ onClick, isFirst, isOpen, hovered, title }) => (
  <Flex
    align="center"
    borderBottom="1px solid"
    borderTop={isFirst ? '1px solid' : 'unset'}
    borderColor="#E5E5EC" // this is not currently in the UI lib, asked jasper about it but he was out of office
    py={3}
    justify="space-between"
    onClick={onClick}
  >
    <Box>
      <Text color={isOpen || hovered ? 'ink' : 'ink.600'}>{title}</Text>
    </Box>
    <Box color="ink.300" transform={isOpen ? 'rotate(180deg)' : 'none'}>
      <ChevronDownIcon />
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

interface CollapseProps {
  data: Data[];
}

/**
 * This component renders a list of clickable items that
 * will reveal content onClick, then hide it on any other
 * onClick of an item
 */
const Collapse: React.FC<CollapseProps> = ({ data, ...rest }) => {
  const [open, setOpen] = React.useState<number | null>(null);
  const handleOpen = (key: number) => (key === open ? setOpen(null) : setOpen(key));
  return (
    <Box px={5} fontSize="14px" {...rest}>
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
          <Box key={key} cursor={hovered ? 'pointer' : undefined} {...bind}>
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

export { Collapse };
