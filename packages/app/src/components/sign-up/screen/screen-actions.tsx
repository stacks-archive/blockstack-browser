import React from 'react';

import { Flex, Box, Button } from '@blockstack/ui';
import { Link } from '../../link';

interface ScreenAction {
  label: string;
  onClick?: any;
  href?: string;
  disabled?: boolean;
  variant?: string;
  id?: string;
  testAttr?: string;
}

interface ScreenActionsProps {
  action: ScreenAction | ScreenAction[];
}

export const ScreenActions: React.FC<ScreenActionsProps> = ({ action }) => (
  <>
    {action ? (
      Array.isArray(action) ? (
        <Flex p={5} justify="space-between" align="center">
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
        <Box p={5}>
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
  </>
);
