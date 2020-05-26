import React from 'react';
import { View, PropTypes } from 'react-view';
import { Button } from '@blockstack/ui';

export const ButtonView = () => (
  <View
    componentName="Button"
    props={{
      children: {
        value: 'Hello world',
        type: PropTypes.ReactNode,
        description: 'Visible label.',
      },
      loadingText: {
        value: 'Loading...',
        type: PropTypes.String,
        description: 'The message to be shown when the button is loading.',
      },
      onClick: {
        value: '() => alert("click")',
        type: PropTypes.Function,
        description: 'Function called when button is clicked.',
      },
      isDisabled: {
        value: false,
        type: PropTypes.Boolean,
        description: 'Indicates that the button is disabled',
      },
      isLoading: {
        value: false,
        type: PropTypes.Boolean,
        description: 'Enables the loading state of the button.',
      },
    }}
    scope={{
      Button,
    }}
    imports={{
      '@blockstack/ui': {
        named: ['Button'],
      },
    }}
  />
);
