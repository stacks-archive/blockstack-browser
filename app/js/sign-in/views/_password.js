import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Shell } from '@blockstack/ui'

class PasswordView extends React.Component {
  state = {
    status: 'initial'
  }

  setError = () => {
    if (this.state.status !== 'error' && this.props.error) {
      this.setState({
        errors: {
          password: this.props.error
        },
        status: 'error'
      })
    }
  }
  componentDidUpdate() {
    this.setError()
  }

  validate = values => {
    // No value checks for both
    const noValues = !values.password || values.password === ''
    const noValuesConfirm =
      !this.props.decrypt &&
      (!values.passwordConfirm || values.passwordConfirm === '')

    // Too short checks for both
    const tooShort = values.password.length < 8
    const tooShortConfirm =
      !this.props.decrypt && values.passwordConfirm.length < 8

    // check if passwords match
    const passwordsDoNotMatch =
      !this.props.decrypt && values.password !== values.passwordConfirm

    this.setState({
      status: 'validating',
      errors: undefined
    })

    const errors = {}

    /**
     * No Value checks
     */
    if (noValues) {
      errors.password = 'This is required'
      this.setState({
        status: 'error',
        errors
      })
      throw errors
    } else if (noValuesConfirm) {
      errors.passwordConfirm = 'This is required'
      this.setState({
        status: 'error',
        errors
      })
      throw errors
    }

    /**
     * Min length checks
     */
    if (tooShort) {
      errors.password = 'Password is too short'
      this.setState({
        status: 'error',
        password: values.password,
        errors
      })

      throw errors
    } else if (tooShortConfirm) {
      errors.passwordConfirm = 'Password is too short'
      this.setState({
        status: 'error',
        passwordConfirm: values.passwordConfirm,
        errors
      })

      throw errors
    }

    /**
     * Check if passwords match (if !this.props.decrypt)
     */
    if (passwordsDoNotMatch) {
      errors.passwordConfirm = 'Passwords do not match'
      this.setState({
        status: 'error',
        password: values.password,
        errors
      })

      throw errors
    }

    /**
     * Set errors
     */
    if (Object.keys(errors).length) {
      this.setState({
        status: 'error'
      })
      throw errors
    }

    this.props.updateValue('password', values.password)
    this.setState({
      password: values.password,
      status: 'good-to-go'
    })
    this.props.updateValue('password', values.password).then(() => {
      this.props.next()
    })

    return null
  }
  render() {
    const {
      updateValue,
      next,
      loading,
      password,
      decrypt,
      ...rest
    } = this.props

    const fields = [
      {
        type: 'password',
        name: 'password',
        label: 'Password',
        message: decrypt
          ? 'The password you entered when you created this Blockstack ID.'
          : null,
        autoFocus: true
      }
    ]

    if (!decrypt) {
      fields.push({
        type: 'password',
        name: 'passwordConfirm',
        label: 'Confirm Password',
        message:
          'Please record your password, Blockstack cannot reset this password for you.'
      })
    }

    const props = {
      title: {
        children: decrypt ? 'Enter your password' : 'Create a password',
        variant: 'h2'
      },
      content: {
        grow: 0,
        form: {
          errors: this.state.errors,
          validate: v => this.validate(v),
          initialValues: { password: password || '' },
          onSubmit: values => {
            if (this.state.status === 'good-to-go') {
              updateValue('password', values.password)
              next()
            }
          },
          fields,
          actions: {
            split: true,
            items: [
              {
                label: ' ',
                textOnly: true
              },
              {
                label: 'Next',
                primary: true,
                type: 'submit',
                icon: 'ArrowRightIcon',
                loading:
                  this.props.decrypting ||
                  loading ||
                  this.state.status === 'validating',
                disabled:
                  this.props.decrypting ||
                  loading ||
                  this.state.status === 'validating'
              }
            ]
          }
        }
      }
    }
    return (
      <React.Fragment>
        {this.props.loading ? (
          <Shell.Loading message="Restoring your account..." />
        ) : null}
        <ShellScreen {...rest} {...props} />
      </React.Fragment>
    )
  }
}

PasswordView.propTypes = {
  updateValue: PropTypes.func,
  next: PropTypes.func,
  loading: PropTypes.bool,
  password: PropTypes.string,
  decrypt: PropTypes.bool,
  decrypting: PropTypes.bool,
  error: PropTypes.any,
  key: PropTypes.any
}
export default PasswordView
