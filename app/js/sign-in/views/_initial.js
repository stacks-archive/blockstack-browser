import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'
import Yup from 'yup'
import { validateMnemonic } from 'bip39'
import QrScan from '@components/ui/components/qr-scan'
import { validateAndCleanRecoveryInput } from '@utils/encryption-utils'

function validateInput(value) {
  // Raw mnemonic phrase
  if (validateMnemonic(value)) {
    return true
  }
  // Base64 encoded encrypted phrase
  if (/[a-zA-Z0-9+/]=$/.test(value)) {
    return true
  }
  return false
}

const validationSchema = Yup.object({
  recoveryKey: Yup.string()
    .required('This is required.')
    .test('is-valid', 'That’s not a valid recovery code or key', value =>
      validateAndCleanRecoveryInput(value)
    )
})

export default class InitialSignInScreen extends React.PureComponent {
  state = {
    isScanning: false,
    scanError: null
  };

  handleScan = (data) => {
    if (validateInput(data)) {
      this.props.next(data)
    }
    else {
      this.setState({ scanError: 'Invalid recovery code scanned' })
      clearTimeout(this.scanErrorTimeout)
      this.scanErrorTimeout = setTimeout(() => {
        this.setState({ scanError: null })
      }, 3000)
    }
  }

  handleScanError = (err) => {
    this.setState({ scanError: err.message })
  }

  startScanning = () => {
    this.setState({
      isScanning: true,
      scanError: null
    })
  }

  stopScanning = () => {
    this.setState({
      isScanning: false,
      scanError: null
    })
  }

  componentDidUnmount() {
    clearTimeout(this.scanErrorTimeout)
  }

  render() {
    const { next, value, ...rest } = this.props
    const { isScanning, scanError } = this.state

    const screen = {
      title: {
        children: 'Sign in with an existing ID'
      },
      content: {
        grow: 1,
        form: {
          validationSchema,
          initialValues: { recoveryKey: value },
          onSubmit: values => {
            next(values.recoveryKey)
          },
          fields: [
            {
              type: 'textarea',
              name: 'recoveryKey',
              label: 'Recovery Code/Key',
              mh: 100,
              autoFocus: true
            }
          ],
          actions: {
            split: true,
            items: [
              {
                label: 'Scan',
                icon: 'QrcodeIcon',
                onClick: this.startScanning
              },
              {
                label: 'Sign In',
                primary: true,
                icon: 'ArrowRightIcon',
                type: 'submit'
              }
            ]
          }
        },
        children: (
          <React.Fragment>
            <Type.p>
              Enter your Magic Recovery Code. This code was sent to you when you
              created your ID. Alternatively, you can supply your Secret Recovery
              Key. This key is a sequence of words you recorded, for example,
              "rabbit pink ..."
            </Type.p>
            {isScanning &&
              <QrScan
                onScan={this.handleScan}
                onError={this.handleScanError}
                handleClose={this.stopScanning}
                error={scanError}
              />
            }
          </React.Fragment>
        )
      },
      actions: {
        items: isScanning ? [] : [
          {
            label: 'Create a new Blockstack ID',
            to: '/sign-up'
          }
        ]
      }
    }

    return <ShellScreen {...rest} {...screen} />
  }
}

InitialSignInScreen.propTypes = {
  next: PropTypes.func,
  value: PropTypes.string
}
