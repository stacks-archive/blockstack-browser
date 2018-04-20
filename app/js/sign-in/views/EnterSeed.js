import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { Button, ButtonLink, Buttons } from '@components/styled/Button'
import { FastField, Form, Formik } from 'formik'
import Yup from 'yup'
import { TextboxPasswordIcon } from 'mdi-react'

const validationSchema = Yup.object({
  key: Yup.string()
    .matches(/^ *\w+(?: +\w+){11,}$/, 'This seems to be less than 12 words')
    .required('Please enter your 12 word recovery key')
})

class Options extends React.Component {
  state = {
    restoring: false
  }
  restoreAccount = async (key, next) => {
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
    const { previous, next, ...rest } = this.props
    return (
      <PanelCard
        renderHeader={() => (
          <PanelCardHeader
            h5="Enter your 12 word recovery key below."
            h2="Restore with Key"
            mdi={'TextboxPasswordIcon'}
            pt={0}
          />
        )}
        {...rest}
      >
        <PanelCard.Loading
          show={this.state.restoring}
          message="Restoring your account..."
        />
        <Fragment>
          <PanelCard.Section pt={2} left>
            <p>
              You’ll need your Secret Recovery Key (the 12 words you wrote down
              on paper and then saved in a secret place).
            </p>

            <p>The words must be in order and have spaces between them.</p>
          </PanelCard.Section>
          <PanelCard.Section pt={3}>
            <Formik
              initialValues={{ key: '' }}
              validationSchema={validationSchema}
              onSubmit={values => this.restoreAccount(values.key, next)}
              validateOnBlur={false}
              validateOnChange={false}
              render={({ errors, touched }) => (
                <Form>
                  <PanelCard.Section pb={4}>
                    <label htmlFor="key">Recovery Key</label>
                    <FastField
                      name="key"
                      component="textarea"
                      type="text"
                      placeholder="likeness nutria producer rem wedged upstate ossicle paying telega attain laverock planar"
                    />
                    {errors.key &&
                      touched.key && (
                        <PanelCard.Error
                          icon={<TextboxPasswordIcon />}
                          message={errors.key}
                        />
                      )}
                  </PanelCard.Section>
                  <Buttons bottom>
                    <ButtonLink onClick={() => previous()} secondary>
                      Go Back
                    </ButtonLink>
                    <Button primary type="submit">
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
  }
}

Options.propTypes = {
  previous: PropTypes.func,
  next: PropTypes.func
}

export default Options
