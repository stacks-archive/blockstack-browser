import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Navigation from '@components/Navigation'
import { Formik, FastField, Form } from 'formik'
import { PanelCard } from '@components/PanelShell'
import { LockOpenIcon } from 'mdi-react'
import Yup from 'yup'
import {Button} from '@components/styled/Button'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Your password is too short.')
    .required('A passsword is required.'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.')
})

const Password = ({ next, handleValueChange, password, previous }) => (
  <PanelCard>
    <Navigation previous={previous} next={next} />
    <Fragment>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          password
        }}
        onSubmit={values => {
          handleValueChange(values.password)
          next()
        }}
        validateOnBlur={false}
        validateOnChange={false}
        render={({ errors, touched }) => (
          <Form>
            <label htmlFor="password">
              Password <em>(8 characters minimum)</em>
            </label>
            <FastField
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Password"
            />
            <FastField
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm Password"
            />
            {errors.password && touched.password ? (
              <PanelCard.Error
                icon={<LockOpenIcon />}
                message={errors.password}
              />
            ) : errors.passwordConfirm && touched.passwordConfirm ? (
              <PanelCard.Error
                icon={<LockOpenIcon />}
                message={errors.passwordConfirm}
              />
            ) : null}
            <Button type="submit" primary>
              Continue
            </Button>
          </Form>
        )}
      />
      <PanelCard.Section pt={3} lineHeight={3}>
        <p>
          This password will be used as part of the encryption of your ID.{' '}
          <a href="#">Learn more.</a>
        </p>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

Password.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired
}

export default Password
