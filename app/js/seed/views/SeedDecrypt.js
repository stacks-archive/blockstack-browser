import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button } from '@components/styled/Button'
import { Formik, FastField, Form } from 'formik'
import { LockOpenIcon } from 'mdi-react'

import Yup from 'yup'

const validationSchema = Yup.object({
  password: Yup.string()
})

const SeedDecrypt = ({ next, previous, decryptSeed }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        title={'Generate your secret recovery seed'}
        icon="/images/onboarding/seed-1.png"
        pt={0}
      />
    )}
  >
    <Fragment>
      <PanelCard.Section pt={0} lineHeight={3}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            password: ''
          }}
          onSubmit={values => {
            decryptSeed(values.password)
          }}
          validateOnBlur={false}
          validateOnChange={false}
          render={({ errors, touched }) => (
            <Form>
              <label htmlFor="password">Enter Password</label>
              <FastField
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Your Password"
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
              <p>The password you used when you created your Blockstack ID.</p>
              <Button type="submit" primary>
                Continue
              </Button>
            </Form>
          )}
        />
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

SeedDecrypt.propTypes = {
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired
}

export default SeedDecrypt
