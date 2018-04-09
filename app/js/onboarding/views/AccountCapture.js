import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Formik, FastField, Form } from 'formik'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { EmailAlertIcon, LockOpenIcon } from 'mdi-react'
import Yup from 'yup'
import { Button } from '@components/styled/Button'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Your email address seems invalid.')
    .required('A recovery email is required.'),
  password: Yup.string()
    .min(8, 'Your password is too short.')
    .required('A passsword is required.'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Please confirm your password.')
})

const panelHeader = () => <PanelCardHeader />

const AccountCapture = ({ next, updateValue, email, password }) => (
  <PanelCard renderHeader={panelHeader}>
    <Fragment>
      <Formik
        initialValues={{ email, password }}
        validationSchema={validationSchema}
        onSubmit={values => {
          updateValue('email', values.email)
          updateValue('password', values.password)
          next()
        }}
        validateOnBlur={false}
        validateOnChange={false}
        render={({ errors, touched }) => (
          <Form>
            <label htmlFor="email">Email</label>
            <FastField
              name="email"
              type="email"
              placeholder="Recovery Email"
              autoComplete="off"
            />
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
            {errors.email && touched.email && (
              <PanelCard.Error
                icon={<EmailAlertIcon />}
                message={errors.email}
              />
            )}
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
      <PanelCard.Section pt={3} lineHeight={3}>
        <p>
          We use your email to provide you with recovery options for your ID,
          nothing else. <a href="#">Learn more.</a>
        </p>
      </PanelCard.Section>
      <PanelCard.Section pt={3} lineHeight={3}>
        <p>
          This password will be used as part of the encryption of your ID.{' '}
          <a href="#">Learn more.</a>
        </p>
      </PanelCard.Section>
      <PanelCard.Section pt={3}>
        <p>
          <a href="#">Already have a Blockstack ID?</a>
        </p>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

AccountCapture.propTypes = {
  next: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default AccountCapture
