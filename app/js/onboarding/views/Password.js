import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { FastField, Form, Formik } from 'formik'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { LockOpenIcon } from 'mdi-react'
import Yup from 'yup'
import { Button } from '@components/styled/Button'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Your password is too short.')
    .required('A passsword is required.'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.')
})

const panelHeader = () => (
  <PanelCardHeader
    appIcon="https://browser.blockstack.org/images/app-icon-dotpodcast-256x256.png"
    variant="small"
    title="Create a password"
    pt={4}
  />
)

const Password = ({ next, updateValue, password, ...rest }) => (
  <PanelCard renderHeader={panelHeader} {...rest}>
    <Fragment>
      <Formik
        initialValues={{ password }}
        validationSchema={validationSchema}
        onSubmit={values => {
          updateValue('password', values.password)
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
            <Button primary type="submit">
              Continue
            </Button>
          </Form>
        )}
      />
    </Fragment>
  </PanelCard>
)

Password.propTypes = {
  next: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired
}

export default Password
