import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button, Buttons, ButtonLink } from '@components/styled/Button'
import { Formik, FastField, Form } from 'formik'
import { LockOpenIcon } from 'mdi-react'

import Yup from 'yup'

const validationSchema = Yup.object({
  wordFour: Yup.string(),
  wordSix: Yup.string()
})

const SeedConfirm = ({ next, previous, ...rest }) => (
  <PanelCard
    renderHeader={() => (
      <PanelCardHeader
        title={'Confirm your recovery seed'}
        icon="/images/onboarding/seed-1.png"
        pt={0}
      />
    )}
    {...rest}
  >
    <Fragment>
      <PanelCard.Section pt={0} lineHeight={3}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            wordFour: '',
            wordSix: ''
          }}
          onSubmit={values => {
            next()
          }}
          validateOnBlur={false}
          validateOnChange={false}
          render={({ errors, touched }) => (
            <Form>
              <label htmlFor="password">Word #4</label>
              <FastField name="wordFour" type="text" placeholder="4th word" />
              <label htmlFor="password">Word #9</label>
              <FastField name="wordSix" type="text" placeholder="9th word" />
              {errors.wordFour && touched.wordFour ? (
                <PanelCard.Error
                  icon={<LockOpenIcon />}
                  message={errors.wordFour}
                />
              ) : errors.wordSix && touched.wordSix ? (
                <PanelCard.Error
                  icon={<LockOpenIcon />}
                  message={errors.wordSix}
                />
              ) : null}
              <Buttons>
                <ButtonLink secondary onClick={previous}>
                  Back
                </ButtonLink>
                <Button type="submit" primary>
                  Continue
                </Button>
              </Buttons>
            </Form>
          )}
        />
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

SeedConfirm.propTypes = {
  next: PropTypes.func.isRequired,
  previous: PropTypes.func.isRequired
}

export default SeedConfirm
