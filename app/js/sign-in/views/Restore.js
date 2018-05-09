import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button } from '@components/styled/Button'
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

  restoreAccount = (next) => {
    if (!this.state.restoring) {
      this.setState({
        restoring: true
      })
      return next()
    } else {
      return null
    }
  }

  render() {
    const { next, updateValue, decrypt, ...rest } = this.props

    return (
      <PanelCard
        renderHeader={() => (
          <PanelCardHeader title={'Enter your Password'} pt={4} />
        )}
        {...rest}
      >
        <PanelCard.Loading
          show={this.state.restoring}
          message="Restoring your account..."
        />
        <Fragment>
          <PanelCard.Section pt={0} lineHeight={3}>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                password: ''
              }}
              onSubmit={values => { 
                updateValue('password', values.password)
                this.restoreAccount(next)
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

                return (<Form>
                  {decrypt ? 
                    <div>
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
                      ) : null}
                      <p>
                        The password you entered when created this Blockstack ID.
                      </p>
                    </div> :
                    <div>
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
                      {errors.password && touched.password ? (
                        <PanelCard.Error
                          icon={<LockOpenIcon />}
                          message={errors.password}
                        />
                      ) : null}
                      <p>
                        Choose a password for your account.
                      </p>
                    </div>
                  }
                  {renderErrorMessages()}
                  <Button type="submit" primary>
                    Continue
                  </Button>
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
  updateValue: PropTypes.func,
  decrypt: PropTypes.bool
}

export default RestoreAccount
