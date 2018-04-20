import React, { Fragment } from 'react'
import { FastField, Form, Formik } from 'formik'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { LockOpenIcon } from 'mdi-react'
import Yup from 'yup'
import { Button } from '@components/styled/Button'
import PropTypes from 'prop-types'

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
    h5="This password will be used to encrypt your recovery key."
    h2="Create a Password"
    mdi={'LockIcon'}
    pt={0}
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
        render={({ errors, touched }) => {
          const renderErrorMessages = () => {
            if (errors.password && touched.password) {
              return (
                <PanelCard.Error
                  icon={<LockOpenIcon />}
                  message={errors.password}
                />
              )
            } else if (errors.passwordConfirm && touched.passwordConfirm) {
              return (
                <PanelCard.Error
                  icon={<LockOpenIcon />}
                  message={errors.passwordConfirm}
                />
              )
            }
            return null
          }
          return (
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
              {renderErrorMessages()}
              <Button primary type="submit">
                Continue
              </Button>
            </Form>
          )
        }}
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
