import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Type } from '@blockstack/ui'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

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
  sponsoredName,
  apiUrl
) => {
  if (!username) {
    return null
  }
  const url = `${apiUrl}/${username.toLowerCase()}${sponsoredName}`
  try {
    const res = await fetch(url)
    const user = await res.json()
    logger.debug('getUsernameStatus response:', user)
    return user.status
  } catch (err) {
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
      const MAX_USERNAME_LENGTH = 38
      const validMinLength = values.username.length >= MIN_USERNAME_LENGTH
      const validMaxLength = values.username.length < MAX_USERNAME_LENGTH

      const minLengthErrorMessage = `Must be at least ${8} characters.`
      const maxLengthErrorMessage = 'Username is too long.'

      if (!validMinLength) {
        this.setState({
          status: STATUS.ERROR
        })
        errors.username = minLengthErrorMessage
        throw errors
      }

      if (!validMaxLength) {
        this.setState({
          status: STATUS.ERROR
        })
        errors.username = maxLengthErrorMessage
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
        const status = await getUsernameStatus(values.username, this.props.sponsoredName, this.props.apiUrl)

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
        return 'Continue'
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
    const {
      updateValue,
      next,
      loading,
      username: cachedUsername = '',
      ...rest
    } = this.props
    const { status, username } = this.state
    const canSkip = status === STATUS.FAIL

    const props = {
      title: {
        children: 'Create a username',
        variant: 'h2'
      },
      content: {
        grow: 0,
        children: (
          <>
            <Type.small pt={3}>
              This will be your unique, public identity for any
              Blockstack&nbsp;app.
            </Type.small>
            {canSkip && (
              <Type.small pt={3}>
                If you’re having trouble registering a username, you can skip
                this now and try again later from your profile. This may make
                some apps unusable until you do.
              </Type.small>
            )}
          </>
        ),
        form: {
          validate: v => this.validate(v),
          initialValues: { username: cachedUsername },
          onSubmit: values => {
            if (status === STATUS.CONFIRMED && username === values.username) {
              updateValue('username', values.username)
              this.processRegistration(values.username, next)
            }
          },
          fields: [
            {
              type: 'text',
              label: 'Username',
              name: 'username',
              autoFocus: true,
              overlay: this.props.sponsoredName,
              handleChangeOverride: (e, handleChange) => {
                handleChange(e)
                this.setState({
                  status: null
                })
              },
              positive:
                status === STATUS.AVAILABLE || status === STATUS.CONFIRMED
                  ? 'Username Available!'
                  : undefined,
              error: status === STATUS.TAKEN ? 'Username taken' : undefined
            }
          ],
          actions: {
            split: true,
            items: [
              {
                label: this.renderButtonLabel(this.state),
                loading,
                disabled: loading,
                primary: true,
                type: 'submit',
                icon: 'ArrowRightIcon'
              }
            ].concat(
              canSkip
                ? [
                    {
                      label: 'Skip Username →',
                      textOnly: true,
                      disabled: loading,
                      onClick: ev => {
                        ev.preventDefault()
                        this.skip()
                      }
                    }
                  ]
                : []
            )
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
  username: PropTypes.string,
  apiUrl: PropTypes.string,
  sponsoredName: PropTypes.string,
  loading: PropTypes.bool
}

export default UsernameView
