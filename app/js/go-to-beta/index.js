import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AppHomeWrapper, ShellParent, ShellScreen } from '@blockstack/ui'
import {
  selectEncryptedBackupPhrase
} from '@common/store/selectors/account'
import App from '../App'

const BETA_URL = 'https://beta.browser.blockstack.org'

const goToBeta = (encryptedBackupPhrase) => {
  const encodedPhrase = new Buffer(encryptedBackupPhrase, 'hex').toString(
    'base64'
  )
  const url = `${BETA_URL}/seed?encrypted=${encodeURIComponent(encodedPhrase)}`
  window.open(url, '_blank')
}

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: selectEncryptedBackupPhrase(state)
  }
}

const Modal = (_props) => {
  console.log('rendering modal')
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
        // validate: v => this.validate(v),
        initialValues: { password: '' },
        fields: [],
        onSubmit: () => window.open(`${BETA_URL}/sign-up`, '_blank'),
        actions: {
          split: false,
          items: [
            {
              label: 'Create new ID',
              primary: true,
              type: 'submit'
            },
            {
              label: 'Sign in with your existing ID',
              onClick: () => goToBeta(_props.encryptedBackupPhrase)
            }
          ]
        }
      }
    }
  }
  return (
    <>
      <ShellScreen {...props} {..._props} />
    </>
  )
}

class GoToBeta extends React.Component {
  static propTypes = {
    encryptedBackupPhrase: PropTypes.string.isRequired
  }

  onClick() {
    console.log(this.props)
  }

  render() {
    return (
      <App>
        <ShellParent
          encryptedBackupPhrase={this.props.encryptedBackupPhrase}
          view={0}
          views={[Modal]}
        />
        <AppHomeWrapper />
      </App>
    )
  }
}

export default connect(mapStateToProps)(GoToBeta)
