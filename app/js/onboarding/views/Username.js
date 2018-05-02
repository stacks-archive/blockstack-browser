import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Formik } from 'formik'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { AccountRemoveIcon, CheckIcon } from 'mdi-react'
import { Button } from '@components/styled/Button'
import debounce from 'lodash.debounce'
import Yup from 'yup'
import log4js from 'log4js'

const logger = log4js.getLogger('onboarding/Username.js')

const getUsernameStatus = async (username, sponsoredName = '.test-personal.id') => {
  if (!username) {
    return null
  }
  // const url = `https://core.blockstack.org/v1/names/${username.toLowerCase()}${sponsoredName}`
  const url = `https://test-registrar.blockstack.org/v1/names/${username.toLowerCase()}${sponsoredName}`
  const res = await fetch(url)
  const user = await res.json()
  logger.debug('got response', user)
  if (user.error === 'No such subdomain') {
    return 'available'
  }
  return user.status
}
const validationSchema = Yup.object({
  username: Yup.string().required('A username is required.')
})

class Username extends React.Component {
  state = {
    status: null,
    username: ''
  }

  validate = async values => {
    console.log('validating')
    const errors = {}

    if (!values.username) {
      errors.username = 'Required'
    }

    if (values.username !== this.state.username) {
      const status = await getUsernameStatus(values.username)

      // if (status !== this.state.status) {
      this.setState({
        status,
        username: values.username
      })
      // }
    }

    if (Object.keys(errors).length) {
      throw errors
    }

    return null
  }

  processRegistration = (username, next) => next(username)

  constructor(props) {
    super(props)

    this.validate = debounce(this.validate, 300)
  }

  render() {
    const { next, updateValue, ...rest } = this.props

    const isRegistered = this.state.status === 'registered_subdomain'

    const accountIcon = () => {
      switch (this.state.status) {
        case 'registered_subdomain':
          return 'AccountRemoveIcon'
        case 'available':
          return 'AccountCheckIcon'
        default:
          return 'AccountIcon'
      }
    }

    const renderButtonText = () => {
      switch (this.state.status) {
        case 'registered_subdomain':
          return 'Username unavailable'
        case 'available':
          return 'Confirm Username →'
        default:
          return 'Check Availability'
      }
    }

    const panelHeader = () => (
      <PanelCardHeader
        h5="This will be your public Blockstack Identity."
        h2="Create a Username"
        mdi={accountIcon()}
        pt={0}
      />
    )

    const renderErrorMessage = (errors, touched) =>
      errors &&
      errors.username &&
      touched &&
      touched.username && (
        <PanelCard.Error
          icon={<AccountRemoveIcon />}
          message={errors.username}
        />
      )

    return (
      <PanelCard renderHeader={panelHeader} {...rest}>
        <PanelCard.Loading
          show={this.props.isProcessing}
          message="Processing registration..."
        />
        {
          <Fragment>
            <Formik
              initialValues={{
                username: this.state.username
              }}
              validate={this.validate}
              validationSchema={validationSchema}
              onSubmit={values => {
                if (
                  this.state.status === 'available' &&
                  this.state.username === values.username
                ) {
                  updateValue('username', values.username)
                  this.processRegistration(values.username, next)
                }
              }}
              render={({
                errors,
                touched,
                handleBlur,
                handleChange,
                values
              }) => (
                <Form>
                  {console.log(values, errors, touched)}
                  <label htmlFor="username">Username</label>
                  <PanelCard.InputOverlay
                    text=".test-personal.id"
                    icon={{
                      component: CheckIcon,
                      show: this.state.status === 'available'
                    }}
                  >
                    <input
                      type="text"
                      name="username"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.username}
                      autoComplete="off"
                      autoFocus
                    />
                  </PanelCard.InputOverlay>
                  {renderErrorMessage(errors, touched)}
                  <Button type="submit" primary disabled={isRegistered}>
                    {renderButtonText()}
                  </Button>
                </Form>
              )}
            />
            <PanelCard.Section pt={3} lineHeight={3}>
              <p>Your unique, public identity for any Blockstack&nbsp;app.</p>
            </PanelCard.Section>
          </Fragment>
        }
      </PanelCard>
    )
  }
}

Username.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired
}

export default Username
