import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Navigation from '@components/Navigation'
import { FastField, Form, Formik } from 'formik'
import { PanelCard, PanelCardHeader } from '@components/PanelShell'
import { AccountRemoveIcon } from 'mdi-react'
import { Button } from '@components/styled/Button'

const getUsernameStatus = async (username, sponsoredName = '.personal.id') => {
  if (!username) {
    return null
  }
  const res = await fetch(
    `https://core.blockstack.org/v1/names/${username}${sponsoredName}`
  )
  const user = await res.json()

  return user.status
}

const panelHeader = () => (
  <PanelCardHeader
    appIcon="https://browser.blockstack.org/images/app-icon-dotpodcast-256x256.png"
    variant="small"
    title="Choose a username"
  />
)

class Username extends React.Component {
  state = {
    search: 'initial',
    username: this.props.username || '',
    confirm: 'has-not'
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
        if (status !== 'available') {
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

  render() {
    const {next, updateValue, username, previous, ...rest} = this.props

    return (
      <PanelCard renderHeader={ panelHeader } { ...rest }>
        <Navigation previous={ previous } next={ next }/>
        { username && (
          <Fragment>
            <Formik
              initialValues={ {
                username
              } }
              validate={ this.validate }
              onSubmit={ values => {
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
                  next()
                }
              } }
              validateOnChange={ false }
              validateOnBlur={ false }
              render={ ({errors, touched}) => (
                <Form>
                  <label htmlFor="username">Username</label>
                  <PanelCard.InputOverlay text=".blockstack.id">
                    <FastField name="username" type="text" autoComplete="off"/>
                  </PanelCard.InputOverlay>
                  { errors.username &&
                  touched.username && (
                    <PanelCard.Error
                      icon={ <AccountRemoveIcon/> }
                      message={ errors.username }
                    />
                  ) }
                  <Button type="submit" primary>
                    { this.state.search === 'available'
                      ? `${this.state.username} is Available! Continue →`
                      : 'Search' }
                  </Button>
                </Form>
              ) }
            />
            <PanelCard.Section pt={ 3 } lineHeight={ 3 }>
              <p>
                Your ID for the decentralized internet. We simplify data
                ownership and give you back control. <a href="#">Learn more.</a>
              </p>
            </PanelCard.Section>
          </Fragment>
        ) }
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
