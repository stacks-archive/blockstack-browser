import React from 'react'
import { ShellScreen, Shell } from '@blockstack/ui'
import Yup from 'yup'

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Your password is too short.')
    .required('A passsword is required.')
})

class PasswordView extends React.Component {
  state = {
    status: 'initial'
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    if (this.state.status !== 'error' && this.props.error) {
      this.setState({
        errors: {
          password: this.props.error
        },
        status: 'error'
      })
    }
  }

  validate = values => {
    console.log('validating')
    const noValues = !values.password || values.password === ''
    const tooShort = values.password.length < 8

    this.setState({
      status: 'validating',
      errors: undefined
    })

    let errors = {}

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
    const { updateValue, next, loading, password, ...rest } = this.props

    const props = {
      title: {
        children: 'Enter your password',
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
export default PasswordView
