import React from 'react'
import { ShellScreen } from '@blockstack/ui'
import Yup from 'yup'

import debounce from 'lodash.debounce'
import log4js from 'log4js'

const logger = log4js.getLogger('onboarding/Username.js')

const defaultSponsoredName = '.test-personal.id'

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
  const api = 'https://test-registrar.blockstack.org/v1/names/'
  // const url = `https://core.blockstack.org/v1/names/${username.toLowerCase()}${sponsoredName}`
  const url = `${api}${username.toLowerCase()}${sponsoredName}`
  const res = await fetch(url)
  const user = await res.json()
  logger.debug('got response', user)
  return user.status
}

const errorMessage = 'A username is required.'

class UsernameView extends React.Component {
  state = {
    status: null,
    username: ''
  }

  validate = async values => {
    console.log('validating', values)
    this.setState({
      status: 'validating'
    })

    const noValues = !values.username || values.username === ''
    let errors = {}

    if (noValues) {
      this.setState({
        status: 'error'
      })
      errors.username = errorMessage
      throw errors
    }

    if (values.username !== this.state.username && !noValues) {

      const invalidChars = values.username.match(/\W+/g)

      if (invalidChars) {
        this.setState({
          status: 'error'
        })
        errors.username = 'Invalid username (a-zA-Z0-9_)'
        throw errors
      } else {
        const status = await getUsernameStatus(values.username)

        this.setState({
          status,
          username: values.username
        })
      }

    }

    const isRegistered = !noValues && this.state.status !== 'available'
    if (isRegistered) {
      this.setState({
        status: 'error'
      })
      errors.username = 'Username unavailable'
      throw errors
    } else {
      errors = {}
    }

    if (Object.keys(errors).length) {
      this.setState({
        status: 'error'
      })
      throw errors
    }
    return null
  }

  renderButtonLabel = ({ status }) => {
    switch (status) {
      case 'available':
        return 'Register Username'
      case 'validating':
        return 'Validating...'
      default:
        return 'Check Availability'
    }
  }

  processRegistration = (username, next) => next(username)

  constructor(props) {
    super(props)

    // this.validate = debounce(this.validate, 300)
  }

  render() {
    const { updateValue, next, loading, ...rest } = this.props

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
              this.state.status === 'available' &&
              this.state.username === values.username
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
              autoFocus: true,
              overlay: defaultSponsoredName,
              error:
                this.state.status === 'registered_subdomain' && 'Username taken'
            }
          ],
          actions: {
            split: true,
            items: [
              {
                label: ' ',
                textOnly: true
              },
              {
                label: this.renderButtonLabel(this.state),
                loading,
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

export default UsernameView
