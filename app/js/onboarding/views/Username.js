import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Navigation from '@components/Navigation'
import { Formik, FastField, Form } from 'formik'
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

const validate = values =>
  getUsernameStatus(values.username).then(status => {
    const errors = {}
    if (status !== 'available') {
      errors.username =
        'Sorry, that username has been registered already. Try another.'
    }

    if (!values.username) {
      errors.username = 'A username is required'
    }

    if (Object.keys(errors).length) {
      throw errors
    }
  })

const panelHeader = () => (
  <PanelCardHeader
    appIcon="https://browser.blockstack.org/images/app-icon-dotpodcast-256x256.png"
    variant="small"
    title="Choose a username"
  />
)

const Username = ({ next, updateValue, username, previous, ...rest }) => (
  <PanelCard renderHeader={panelHeader} {...rest}>
    <Navigation previous={previous} next={next} />
    <Fragment>
      <Formik
        initialValues={{
          username
        }}
        validate={validate}
        onSubmit={values => {
          updateValue('username', values.username)
          next()
        }}
        validateOnBlur={false}
        validateOnChange={false}
        render={({ errors, touched }) => (
          <Form>
            <label htmlFor="username">Username</label>
            <PanelCard.InputOverlay text=".blockstack.id">
              <FastField name="username" type="text" autoComplete="off" />
            </PanelCard.InputOverlay>
            {errors.username &&
              touched.username && (
                <PanelCard.Error
                  icon={<AccountRemoveIcon />}
                  message={errors.username}
                />
              )}
            <Button type="submit" primary>
              Continue
            </Button>
          </Form>
        )}
      />
      <PanelCard.Section pt={3} lineHeight={3}>
        <p>
          Your ID for the decentralized internet. We simplify data ownership and
          give you back control. <a href="#">Learn more.</a>
        </p>
      </PanelCard.Section>
    </Fragment>
  </PanelCard>
)

Username.propTypes = {
  previous: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
}

export default Username
