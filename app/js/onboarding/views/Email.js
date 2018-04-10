import React from 'react'
import PropTypes from 'prop-types'
import { FastField, Form, Formik } from 'formik'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { EmailAlertIcon } from 'mdi-react'
import Yup from 'yup'
import { Button } from '@components/styled/Button'

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Your email address seems invalid.')
    .required('A recovery email is required.')
})

const panelHeader = () => <PanelCardHeader appIcon="https://browser.blockstack.org/images/app-icon-dotpodcast-256x256.png" />

const Email = ({ next, updateValue, email, ...rest }) => (
  <PanelCard renderHeader={panelHeader} {...rest}>
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
          <FastField
            name="email"
            type="email"
            placeholder="Recovery Email"
          />
          {errors.email &&
            touched.email && (
              <PanelCard.Error
                icon={<EmailAlertIcon />}
                message={errors.email}
              />
            )}
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
    <PanelCard.Section pt={3}>
      <p>
        <a href="#">Already have a Blockstack ID?</a>
      </p>
    </PanelCard.Section>
  </PanelCard>
)

Email.propTypes = {
  next: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired
}

export default Email
