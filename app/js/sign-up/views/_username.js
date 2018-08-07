import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen } from '@blockstack/ui'
import log4js from 'log4js'

const logger = log4js.getLogger('onboarding/Username.js')
const defaultSponsoredName = '.id.blockstack'

const STATUS = {
  CONFIRMED: 'confirmed',
  AVAILABLE: 'available',
  VALIDATING: 'validating',
  ERROR: 'error',
  FAIL: 'fail',
  TAKEN: 'registered_subdomain'
}

/**
 * Gets the status of submitted username
 */
const getUsernameStatus = async (
  username,
  sponsoredName = defaultSponsoredName
) => {
  if (!username) {
    return null
  }
  const api = 'https://registrar.blockstack.org/v1/names/'
  // const url = `https://core.blockstack.org/v1/names/${username.toLowerCase()}${sponsoredName}`
  const url = `${api}${username.toLowerCase()}${sponsoredName}`
  try {
    const res = await fetch(url)
    const user = await res.json()
    logger.debug('getUsernameStatus response:', user)
    return user.status
  } catch(err) {
    logger.error('getUsernameStatus error:', err)
    return STATUS.FAIL
  }
}

const errorMessage = 'A username is required.'

class UsernameView extends React.Component {
  state = {
    status: null,
    username: ''
  }

  validate = async values => {
    const noValues = !values.username || values.username === ''

    if (
      !noValues &&
      this.state.status === STATUS.AVAILABLE &&
      values.username === this.state.username
    ) {
      this.setState({ status: STATUS.CONFIRMED })
      return null
    }
    this.setState({
      status: STATUS.VALIDATING
    })

    let errors = {}

    if (noValues) {
      this.setState({
        status: STATUS.ERROR
      })
      errors.username = errorMessage
      throw errors
    }

    if (values.username !== this.state.username && !noValues) {

      const MIN_USERNAME_LENGTH = 8
      const validLength = values.username.length >= MIN_USERNAME_LENGTH

      const minLengthErrorMessage = `Username must be at least ${8} characters.`

      if (!validLength) {
        this.setState({
          status: STATUS.ERROR
        })
        errors.username = minLengthErrorMessage
        throw errors
      }

      const invalidChars = values.username.match(/\W+/g)

      if (invalidChars) {
        this.setState({
          status: STATUS.ERROR
        })
        errors.username = 'Invalid username (a-zA-Z0-9_)'
        throw errors
      } else {
        const status = await getUsernameStatus(values.username)

        if (status === STATUS.FAIL) {
          this.setState({ status })
          errors.username = 'Unable to check availability'
          throw errors
        }

        errors = {}
        this.setState({
          status,
          username: values.username
        })
      }
    }

    const isRegistered = !noValues && this.state.status !== STATUS.AVAILABLE
    if (isRegistered) {
      this.setState({
        status: STATUS.ERROR
      })
      errors.username = 'Username unavailable'
      throw errors
    } else {
      errors = {}
    }

    if (Object.keys(errors).length) {
      this.setState({
        status: STATUS.ERROR
      })
      throw errors
    }
    return null
  }

  renderButtonLabel = ({ status }) => {
    switch (status) {
      case STATUS.CONFIRMED:
        return 'Loading...'
      case STATUS.AVAILABLE:
        return 'Confirm Username'
      case STATUS.VALIDATING:
        return 'Checking...'
      case STATUS.ERROR:
        return 'Check Another'
      case STATUS.FAIL:
        return 'Try again'
      default:
        return 'Check Availability'
    }
  }

  processRegistration = (username, next) => {
    const lowercaseUsername = username.toLowerCase()
    return next(lowercaseUsername)
  }

  skip() {
    this.props.next('')
  }

  render() {
    const { updateValue, next, loading, ...rest } = this.props
    const { status, username } = this.state

    const props = {
      title: {
        children: 'Register a username',
        variant: 'h2'
      },
      content: {
        grow: 0,
        form: {
          validate: v => this.validate(v),
          initialValues: { username: '' },
          onSubmit: values => {
            if (
              status === STATUS.CONFIRMED &&
              username === values.username
            ) {
              updateValue('username', values.username)
              this.processRegistration(values.username, next)
            }
          },
          fields: [
            {
              type: 'text',
              label: 'Username',
              name: 'username',
              message:
                'This will be your unique, public identity for any Blockstack app.',
              autoFocus: true,
              overlay: defaultSponsoredName,
              handleChangeOverride: (e, handleChange) => {
                handleChange(e)
                this.setState({
                  status: null
                })
              },
              positive:
                status === STATUS.AVAILABLE ||
                status === STATUS.CONFIRMED
                  ? 'Username Available!'
                  : undefined,
              error:
                status === STATUS.TAKEN
                  ? 'Username taken'
                  : undefined
            }
          ],
          actions: {
            split: true,
            items: [
              status === STATUS.FAIL ? {
                label: 'Skip Username →',
                textOnly: true,
                disabled: loading,
                onClick: (ev) => {
                  ev.preventDefault()
                  this.skip()
                }
              } : {
                label: ' ',
                textOnly: true
              },
              {
                label: this.renderButtonLabel(this.state),
                loading,
                disabled: loading,
                primary: true,
                type: 'submit',
                icon: 'ArrowRightIcon'
              }
            ]
          }
        }
      }
    }
    return <ShellScreen {...rest} {...props} />
  }
}

UsernameView.propTypes = {
  updateValue: PropTypes.func,
  next: PropTypes.func,
  loading: PropTypes.bool
}

export default UsernameView
