import React from 'react'
import { AppHomeWrapper, ShellParent, ShellScreen } from '@blockstack/ui'
import App from '../App'

const BETA_URL = 'https://beta.browser.blockstack.org'

const Modal = () => {
  const props = {
    title: {
      children: 'You\'ve enabled Beta mode',
      variant: 'h2',
      subtitle: {
        light: true,
        padding: '15px 0 0 0',
        children: (
          <>
            <p>
              Your local Blockstack Browser will now start redirecting all activity to a 
              hosted version of the Browser at beta.browser.blockstack.org that runs the latest code on the
              {' '}
              <a href="https://github.com/blockstack/blockstack-browser/tree/develop" target="_blank">develop branch</a>
              .
            </p>
            <p>
              Use it to test the latest code changes, but beware you'll have to sign in with your
              Blockstack ID again below, and you may encounter bugs. 
              You can resume usage of your local Browser at any time by disabling beta mode in the menu bar.
            </p>
          </>
        )
      }
    },
    content: {
      grow: 0,
      form: {
        errors: [],
        initialValues: { password: '' },
        fields: [],
        onSubmit: () => window.open(BETA_URL, '_blank'),
        actions: {
          split: false,
          items: [
            {
              label: 'Create new ID or sign in',
              primary: true,
              type: 'submit'
            }
          ]
        }
      }
    }
  }
  return (
    <>
      <ShellScreen {...props} />
    </>
  )
}

const GoToBeta = () => (
  <App>
    <ShellParent
      view={0}
      views={[Modal]}
    />
    <AppHomeWrapper />
  </App>
)

export default GoToBeta
