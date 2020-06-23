import React from 'react';
import { Box, Text, Input, Button, ButtonGroup } from '@blockstack/ui';
import { Formik } from 'formik';
import { openPopup } from '../common/utils';
import { useDispatch } from '@common/hooks/use-dispatch';
import { doSignOut } from '@store/wallet';

const DevActions = () => {
  const dispatch = useDispatch();
  const saveAuthRequest = (authRequest: string) => {
    openPopup(`/actions.html?authRequest=${encodeURIComponent(authRequest)}`);
  };

  const openBrowserActions = () => {
    openPopup('/popup.html');
  };

  return (
    <Box width="100%">
      <Text textStyle="display.small" display="block">
        Dev Console
      </Text>
      <Text my={4} display="block">
        Mimic an authentication request by entering an <code>`authRequest`</code> below.
      </Text>
      <Formik
        initialValues={{ authRequest: '' }}
        onSubmit={values => {
          console.log(values);
          saveAuthRequest(values.authRequest);
        }}
      >
        {({ handleChange, values, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              value={values.authRequest}
              onChange={handleChange}
              textStyle="body.small"
              name="authRequest"
            />
            <Button mt={4}>Submit</Button>
          </form>
        )}
      </Formik>
      <ButtonGroup variantColor="purple" my={4}>
        <Button onClick={openBrowserActions}>Debug Browser Action</Button>
        <Button onClick={() => dispatch(doSignOut())}>Log Out</Button>
      </ButtonGroup>
    </Box>
  );
};

export { DevActions };
