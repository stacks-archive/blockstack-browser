import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { AppHomeWrapper, ShellParent, ShellScreen } from '@blockstack/ui'
import {
  selectEncryptedBackupPhrase
} from '@common/store/selectors/account'
import App from '../App'

const goToBeta = (encryptedBackupPhrase) => {
  const encodedPhrase = new Buffer(encryptedBackupPhrase, 'hex').toString(
    'base64'
  )
  const url = `https://beta.browser.blockstack.org/seed?encrypted=${encodeURIComponent(encodedPhrase)}`
  window.open(url, '_blank')
}

const Modal = (_props) => {
  console.log('rendering modal')
  const props = {
    title: {
      children: 'Are you sure you want to go to Beta mode?',
      variant: 'h2',
      subtitle: {
        light: true,
        padding: '15px 0 0 0',
        children: (
          <>
            <p>You're about to be sent to beta.browser.blockstack.org</p>
            <p>
              This site is automatically built using the latest code of the
              Blockstack Browser, so you may hit bugs.
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
        onSubmit: () => goToBeta(_props.encryptedBackupPhrase),
        actions: {
          split: false,
          items: [
            {
              label: 'Continue',
              primary: true,
              type: 'submit',
              icon: 'ArrowRightIcon'
              // loading: this.props.loading,
              // disabled: this.props.loading
            }
          ]
        }
      }
    }
  }
  return (
    <>
      {/* {this.props.upgradeInProgress ? (
        <Shell.Loading message="Updating Blockstack..." />
      ) : null} */}
      <ShellScreen {...props} {..._props} />
    </>
  )
}

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: selectEncryptedBackupPhrase(state)
  }
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
