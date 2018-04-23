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

class SeedDecrypt extends React.Component {
  constructor(props) {
    super(props)
    this.passwordRef = React.createRef()
  }

  componentDidMount() {
    if (this.passwordRef.current && this.passwordRef.current.focus) {
      this.passwordRef.current.focus()
    }
  }
  render() {
    const { decryptSeed, ...rest } = this.props
    return (
      <PanelCard
        renderHeader={() => (
          <PanelCardHeader
            h5="Enter your password to decrypt the recovery key for this ID."
            h2="Decrypt Key"
            mdi={'TextboxPasswordIcon'}
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
                    innerRef={this.passwordRef}
                    ref={this.passwordRef}
                    autoFocus
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

SeedDecrypt.propTypes = {
  decryptSeed: PropTypes.func.isRequired
}

export default SeedDecrypt
