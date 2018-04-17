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

class RestoreAccount extends React.Component {
  state = {
    restoring: false,
    seed: null
  }

  restoreAccount = async (password, next) => {
    if (!this.state.restoring) {
      this.setState({
        restoring: true
      })
      return setTimeout(() => next(), 2150)
    } else {
      return null
    }
  }

  render() {
    const { next, ...rest } = this.props

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
              onSubmit={values => this.restoreAccount(values.password, next)}
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
                  ) : null}
                  <p>
                    The password you entered when created this Blockstack ID.
                  </p>
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
  }
}

RestoreAccount.propTypes = {
  decryptSeed: PropTypes.func,
  next: PropTypes.func
}

export default RestoreAccount
