import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button, ButtonLink, Buttons } from '@components/styled/Button'
import { Formik, FastField, Form } from 'formik'
import { LockOpenIcon } from 'mdi-react'

import Yup from 'yup'

const validationSchema = Yup.object({
  password: Yup.string().required('Please enter your password.'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
})

class RestoreAccount extends React.Component {
  state = {
    restoring: false,
    seed: null
  }

  restoreAccount = (next, restoring) => {
    if (!restoring) {
      return next()
    } else {
      return null
    }
  }

  render() {
    const { next, previous, updateValue, decrypt, restoring, restoreError, ...rest } = this.props

    return (
      <PanelCard
        renderHeader={() => (
          <PanelCardHeader title={'Enter your Password'} pt={4} />
        )}
        {...rest}
      >
        <PanelCard.Loading
          show={restoring}
          message="Restoring your account..."
        />
        <Fragment>
          <PanelCard.Section pt={0} lineHeight={3}>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                password: '',
                passwordConfirm: ''
              }}
              onSubmit={values => { 
                updateValue('password', values.password)
                this.restoreAccount(next, restoring)
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
                  } else if (restoreError) {
                    return (
                      <PanelCard.Error
                        icon={<LockOpenIcon />}
                        message={restoreError}
                      />
                    )
                  }
                  return null
                }

                return (<Form>
                  {decrypt ? 
                    <PanelCard.Section pb={4}>
                      <label htmlFor="password">Enter Password</label>
                      <FastField
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Your Password"
                      />
                      {renderErrorMessages()}
                      <p>
                        The password you entered when created this Blockstack ID.
                      </p>
                    </PanelCard.Section> :
                    <PanelCard.Section pb={4}>
                      <label htmlFor="password">Enter Password</label>
                      <FastField
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Your Password"
                      />
                      <FastField
                        name="passwordConfirm"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Confirm Password"
                      />
                      {renderErrorMessages()}
                      <p>
                        Choose a password for your account.
                      </p>
                    </PanelCard.Section>
                  }
                  <Buttons bottom>
                    <ButtonLink onClick={() => previous()} secondary>
                      Back
                    </ButtonLink>
                    <Button primary type="submit">
                      Continue
                    </Button>
                  </Buttons>
                </Form>)
              }}
            />
          </PanelCard.Section>
        </Fragment>
      </PanelCard>
    )
  }
}

RestoreAccount.propTypes = {
  decryptSeed: PropTypes.func,
  next: PropTypes.func,
  previous: PropTypes.func,
  updateValue: PropTypes.func,
  decrypt: PropTypes.bool,
  restoring: PropTypes.bool,
  restoreError: PropTypes.string
}

export default RestoreAccount
