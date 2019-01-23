import React from 'react'
import PropTypes from 'prop-types'
import { ShellScreen, Shell } from '@blockstack/ui'
import { withRouter } from 'react-router'

class PasswordView extends React.Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    errors: PropTypes.object,
    loading: PropTypes.bool,
    upgradeInProgress: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired
  }
  state = {
    status: 'initial',
    password: '',
    resetConfirm: false,
    authRequest: null
  }

  componentDidMount() {
    if (this.props.location.query.authRequest && !this.state.authRequest) {
      this.setState({
        authRequest: this.props.location.query.authRequest
      })
    }
  }

  setError = () => {
    if (this.state.status !== 'error' && this.props.errors) {
      this.setState({
        errors: this.props.errors,
        status: 'error'
      })
    }
  }

  componentDidUpdate() {
    this.setError()
  }

  handleResetConfirm = () => {
    if (this.state.resetConfirm) {
      this.setState({
        resetConfirm: false
      })
    } else {
      this.setState({
        resetConfirm: true
      })
    }
  }

  handleResetBrowser = () => {
    localStorage.clear()
    const path = this.state.authRequest
      ? `/sign-in?authRequest=${this.state.authRequest}`
      : '/sign-in'
    window.location = path
  }

  /**
   * Validation
   */
  validate = values => {
    console.log('validating')

    // No value checks for both
    const noValues = !values.password || values.password === ''

    // Too short checks for both
    const tooShort = values.password.length < 8

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

    this.setState(
      {
        password: values.password,
        status: 'good-to-go',
        errors: null
      },
      () => this.props.handleSubmit(values.password)
    )
    return null
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.accountCreated && props.accountCreated) {
      return {
        ...state,
        accountCreated: true
      }
    }
    return {
      ...state
    }
  }

  render() {
    const { ...rest } = this.props

    const fields = [
      {
        type: 'password',
        name: 'password',
        label: 'Password',
        message:
          'The password you entered when you created this Blockstack ID.',
        autoFocus: true
      }
    ]

    const props = {
      title: {
        children: this.state.resetConfirm
          ? 'Forgot your password?'
          : 'We have updated the browser.',
        variant: 'h2',
        subtitle: {
          light: true,
          padding: '15px 0 0 0',
          children: this.state.resetConfirm ? (
            <>
              You can sign in using your Secret Recovery Key, which is a 12-word
              phrase originally given to you during registration of your
              Blockstack ID.
              <br />
              <br />
              If you don't have your Secret Recovery Key, you'll need to
              register a new Blockstack ID.
            </>
          ) : (
            <>
              Please enter your password to migrate your data to the new
              version.
            </>
          )
        }
      },
      content: {
        grow: 0,
        form: {
          errors: this.state.errors,
          validate: v => this.validate(v),
          initialValues: { password: '' },
          onSubmit: () => console.log('submit for validation'),
          fields: this.state.resetConfirm ? [] : fields,
          actions: {
            split: true,
            style: {
              justifyContent: 'space-between'
            },
            items: [
              {
                label: this.state.resetConfirm ? 'Cancel' : 'Forgot Password?',
                textOnly: true,
                onClick: () => this.handleResetConfirm(),
                style: {
                  width: 'auto'
                }
              },
              {
                label: 'Continue',
                primary: true,
                type: 'submit',
                icon: 'ArrowRightIcon',
                loading: this.props.loading,
                disabled: this.props.loading,
                onClick: this.state.resetConfirm
                  ? () => this.handleResetBrowser()
                  : undefined,
                style: {
                  width: 'auto'
                }
              }
            ]
          }
        }
      }
    }
    return (
      <>
        {this.props.upgradeInProgress ? (
          <Shell.Loading message="Updating Blockstack..." />
        ) : null}
        <ShellScreen {...rest} {...props} />
      </>
    )
  }
}
export default withRouter(PasswordView)
