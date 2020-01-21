import React from 'react';
import { Button, Flex, Box, Spinner, Stack } from '@blockstack/ui';
import { Title, Body } from '../typography';
import { BoxProps } from '@blockstack/ui/dist/box';
import { Link } from '../../link';
import { OnboardingHeader } from '../header';

const Footer: React.FC = props => (
  <Flex px={5} fontSize={['12px', '14px']} color="ink.600" fontWeight="medium" justify="space-between" {...props} />
);

interface ScreenAction {
  label: string;
  onClick?: any;
  href?: string;
  disabled?: boolean;
  variant?: string;
  id?: string;
  testAttr?: string;
}

interface IScreenTemplate {
  title: string | React.ElementType;
  body?: (string | JSX.Element)[];
  headerTitle?: string | JSX.Element;
  back?: () => void;
  action?: ScreenAction | ScreenAction[];
  after?: string | JSX.Element;
  before?: string | JSX.Element;
  footer?: string | JSX.Element;
  isLoading?: boolean;
  noMinHeight?: boolean;
  appIcon?: boolean;
}

const ScreenTemplate = ({
  before,
  title,
  body,
  headerTitle,
  action,
  after,
  footer,
  isLoading,
  noMinHeight = false,
  appIcon,
  ...rest
}: IScreenTemplate & BoxProps) => {
  return (
    <>
      <Flex
        align="center"
        justify="center"
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bg={`rgba(255,255,255,${isLoading ? 0.6 : 0})`}
        borderBottomLeftRadius="6px"
        borderBottomRightRadius="6px"
        zIndex={99}
        transition="250ms all"
        style={{ pointerEvents: isLoading ? 'unset' : 'none' }}
        opacity={isLoading ? 1 : 0}
      >
        <Box transition="500ms all" transform={isLoading ? 'none' : 'translateY(10px)'}>
          <Spinner size="xl" thickness="3px" color="blue" />
        </Box>
      </Flex>
      <Stack
        width="100%"
        letterSpacing="tighter"
        minHeight={noMinHeight ? undefined : ['calc(100vh - 57px)', 'unset']}
        spacing={[4, 6]}
        style={{ pointerEvents: isLoading ? 'none' : 'unset' }}
        {...rest}
      >
        <OnboardingHeader appIcon={appIcon} title={headerTitle || 'Data Vault'} close={() => console.log('test')} />
        {before && before}
        <Box px={5}>
          <Stack spacing={2}>
            <Title>{title}</Title>
            <Stack spacing={[3, 4]}>
              {body && body.length ? body.map((text, key) => <Body key={key}>{text}</Body>) : body}
            </Stack>
          </Stack>
        </Box>
        {action ? (
          Array.isArray(action) ? (
            <Flex px={5} justify="space-between" align="center">
              {action.map((a, key) => (
                <Box key={key}>
                  {a.variant && a.variant === 'text' ? (
                    <Link color="blue" onClick={a.onClick} id={a.id} data-test={a.testAttr}>
                      {a.label}
                    </Link>
                  ) : (
                    <Button onClick={a.onClick} isDisabled={a.disabled} id={a.id} data-test={a.testAttr}>
                      {a.label}
                    </Button>
                  )}
                </Box>
              ))}
            </Flex>
          ) : (
            <Box px={5}>
              <Button
                width="100%"
                onClick={action.onClick}
                id={action.id}
                isDisabled={action.disabled}
                data-test={action.testAttr}
              >
                {action.label}
              </Button>
            </Box>
          )
        ) : null}
        {after ? after : null}
        {footer ? <Footer>{footer}</Footer> : null}
      </Stack>
    </>
  );
};

export { ScreenTemplate };
