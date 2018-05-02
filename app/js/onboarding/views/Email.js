import React from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { EmailAlertIcon } from 'mdi-react'
import { FastField, Form, Formik } from 'formik'
import Yup from 'yup'
import { Link } from 'react-router'
import { Button } from '@components/styled/Button'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Your email address seems invalid.')
    .required('A recovery email is required.')
})

const panelHeader = (appIconURL) => (
  <PanelCardHeader appIcon={appIconURL} />
)

const Email = ({ next, updateValue, email, submitted, appIconURL, ...rest }) => (
  <PanelCard renderHeader={() => panelHeader(appIconURL)} {...rest}>
    <Formik
      initialValues={{ email }}
      validationSchema={validationSchema}
      onSubmit={values => {
        updateValue('email', values.email)
        next()
      }}
      validateOnBlur={false}
      validateOnChange={false}
      render={({ errors, touched }) => (
        <Form>
          <label htmlFor="email">Email</label>
          <FastField name="email" type="email" placeholder="Enter an Email" autoFocus />
          {errors.email && touched.email && (
            <PanelCard.Error
              icon={<EmailAlertIcon />}
              message={errors.email}
            />
          )}
          <Button primary disabled={submitted} type="submit">
            Continue
          </Button>
        </Form>
      )}
    />
    <PanelCard.Section pt={3} lineHeight={3}>
      <p>
        Blockstack gives you control over fundamental digital rights: Identity,
        data ownership, privacy, and security.
      </p>
    </PanelCard.Section>
    <PanelCard.Section pt={3}>
      <p>
        <Link to="/sign-in">Already have a Blockstack ID?</Link>
      </p>
    </PanelCard.Section>
  </PanelCard>
)

Email.propTypes = {
  next: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  appIconURL: PropTypes.string,
  submitted: PropTypes.bool
}

export default Email
