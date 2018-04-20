import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { FastField, Form, Formik } from 'formik'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { AccountRemoveIcon, CheckIcon } from 'mdi-react'
import { Button } from '@components/styled/Button'

const getUsernameStatus = async (username, sponsoredName = '.personal.id') => {
  if (!username) {
    return null
  }
  const res = await fetch(
    `https://core.blockstack.org/v1/names/${username.toLowerCase()}${sponsoredName}`
  )
  const user = await res.json()

  return user.status
}

class Username extends React.Component {
  state = {
    search: 'initial',
    username: this.props.username || '',
    confirm: 'has-not',
    isProcessing: false
  }

  validate = values => {
    if (
      this.state.search === 'initial' ||
      this.state.search === 'taken' ||
      this.state.username !== values.username ||
      this.state.confirm === 'has-seen'
    ) {
      if (this.state.username !== values.username) {
        this.setState({
          username: values.username,
          search: 'initial'
        })
      }
      return getUsernameStatus(values.username).then(status => {
        const errors = {}
        if (status !== 'available' || !status) {
          if (this.state.search !== 'taken') {
            this.setState({
              search: 'taken'
            })
          }
          errors.username =
            'Sorry, that username has been registered already. Try another.'
        }

        if (!values.username) {
          if (this.state.search !== 'errors') {
            this.setState({
              search: 'errors'
            })
          }
          errors.username = 'A username is required'
        }

        if (Object.keys(errors).length) {
          throw errors
        }

        if (
          status === 'available' &&
          this.state.search !== 'available' &&
          this.state.confirm !== 'has-seen'
        ) {
          this.setState({
            search: status,
            confirm: 'has-seen'
          })
        } else if (
          status === 'available' &&
          this.state.username === values.username &&
          this.state.search !== 'initial' &&
          this.state.confirm === 'has-seen'
        ) {
          this.setState({
            confirm: 'confirmed'
          })
        }
      })
    } else {
      return false
    }
  }

  processRegistration = async (username, next) => {
    if (!this.state.isProcessing) {
      this.setState({
        isProcessing: true
      })
      return setTimeout(() => next(), 2150)
    } else {
      return null
    }
  }

  render() {
    const { next, updateValue, username, ...rest } = this.props

    const accountIcon = () => {
      switch (this.state.search) {
        case 'taken':
          return 'AccountRemoveIcon'
        case 'available':
          return 'AccountCheckIcon'
        default:
          return 'AccountIcon'
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

    return (
      <PanelCard renderHeader={panelHeader} {...rest}>
        <PanelCard.Loading
          show={this.state.isProcessing}
          message="Processing registration..."
        />
        {username && (
          <Fragment>
            <Formik
              initialValues={{
                username
              }}
              validate={this.validate}
              onSubmit={async values => {
                if (
                  this.state.search !== 'available' ||
                  this.state.username !== values.username
                ) {
                  updateValue('username', values.username)
                }
                if (
                  this.state.search === 'available' &&
                  this.state.username === values.username &&
                  this.state.confirm === 'confirmed'
                ) {
                  // Process name registration here
                  updateValue('username', values.username)
                  await this.processRegistration(values.username, next)
                }
              }}
              validateOnChange={false}
              validateOnBlur={false}
              render={({ errors, touched }) => (
                <Form>
                  <label htmlFor="username">Username</label>
                  <PanelCard.InputOverlay
                    text=".blockstack.id"
                    icon={{
                      component: CheckIcon,
                      show: this.state.search === 'available'
                    }}
                  >
                    <FastField name="username" type="text" autoComplete="off" />
                  </PanelCard.InputOverlay>
                  {errors.username && touched.username && (
                    <PanelCard.Error
                      icon={<AccountRemoveIcon />}
                      message={errors.username}
                    />
                    )}
                  <Button type="submit" primary>
                    {this.state.search === 'available'
                      ? 'Confirm Username →'
                      : 'Check availability'}
                  </Button>
                </Form>
              )}
            />
            <PanelCard.Section pt={3} lineHeight={3}>
              <p>Your unique, public identity for any Blockstack&nbsp;app.</p>
            </PanelCard.Section>
          </Fragment>
        )}
      </PanelCard>
    )
  }
}

Username.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default Username
