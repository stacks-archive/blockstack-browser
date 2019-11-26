import React from 'react';
import { validateMnemonic } from 'bip39';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Input,
  Text,
  Button,
  FormControl,
  FormLabel,
} from '@blockstack/ui';
import { IAppState } from '@store';
import { doStoreSeed, doGenerateWallet } from '@store/wallet';
import { Formik, FormikErrors } from 'formik';
import {
  selectCurrentWallet,
  selectIsRestoringWallet,
} from '@store/wallet/selectors';

interface FormValues {
  seed: string;
  password: string;
}

const Seed = () => {
  const { wallet, restoring } = useSelector((state: IAppState) => ({
    wallet: selectCurrentWallet(state),
    restoring: selectIsRestoringWallet(state),
  }));
  const dispatch = useDispatch();

  return (
    <Box width="100%">
      {wallet ? (
        <>
          <Text display="block">You&apos;re logged in!</Text>
          <Text>Enter a new seed and password to use a different account.</Text>
        </>
      ) : (
        <>
          <Text display="block">Enter your 12-word seed to log in.</Text>
          <Text>
            To generate a new wallet, enter a password and leave your seed
            blank.
          </Text>
        </>
      )}
      <Formik
        initialValues={{
          seed: '',
          password: '',
        }}
        onSubmit={values => {
          console.log(values);
          if (values.seed) {
            dispatch(doStoreSeed(values.seed));
          } else {
            dispatch(doGenerateWallet(values.password));
          }
        }}
        validate={values => {
          const errors: FormikErrors<FormValues> = {};
          if (values.seed && !validateMnemonic(values.seed)) {
            errors.seed = 'The seed phrase you entered is invalid';
          }
          if (!values.password) {
            errors.password = 'Required';
          }
          return errors;
        }}
      >
        {({ handleSubmit, values, handleChange, errors }) => (
          <form onSubmit={handleSubmit}>
            <FormControl my={4}>
              <FormLabel>Seed Phrase</FormLabel>
              <Input
                textStyle="body.small"
                type="text"
                value={values.seed}
                name="seed"
                onChange={handleChange}
                placeholder="Enter your 12 word seed"
                aria-invalid={errors.seed ? 'true' : undefined}
              />
            </FormControl>
            <FormControl my={4} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                textStyle="body.small"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Password"
                aria-invalid={errors.password ? 'true' : undefined}
              />
            </FormControl>
            <Button mt={4} type="submit" isLoading={restoring}>
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Seed;
