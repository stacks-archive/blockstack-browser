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
    console.log('validating')
    const noValues = !values.password || values.password === ''
    const tooShort = values.password.length < 8

    this.setState({
      status: 'validating',
      errors: undefined
    })

    const errors = {}

    if (noValues) {
      errors.password = 'This is required'
      this.setState({
        status: 'error',
        errors
      })
      throw errors
    }

    if (tooShort) {
      errors.password = 'Password is too short'
      this.setState({
        status: 'error',
        password: values.password,
        errors
      })

      throw errors
    }

    if (Object.keys(errors).length) {
      this.setState({
        status: 'error'
      })
      throw errors
    }

    this.setState(
      {
        password: values.password,
        status: 'good-to-go'
      },
      () => {
        this.props.updateValue('password', values.password)
        this.props.next()
      }
    )

    /**
     * Return null because we have a key and just need a password
     */
    if (this.props.key) {
      this.setState({
        status: 'good-to-go'
      })
    }
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
          fields: [
            {
              type: 'password',
              name: 'password',
              label: 'Password',
              message: decrypt
                ? 'The password you entered when you created this Blockstack ID.'
                : 'Please record your password, Blockstack cannot reset this password for you.',
              autoFocus: true
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
