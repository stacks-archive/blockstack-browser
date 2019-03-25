import React from 'react'
import { ShellScreen, Type } from '@blockstack/ui'
import PropTypes from 'prop-types'
import Yup from 'yup'
import QrScan from '@components/ui/components/qr-scan'
import { validateAndCleanRecoveryInput } from '@utils/encryption-utils'

const validateInput = async value =>
  import(/* webpackChunkName: 'bip39' */ 'bip39').then(bip39 => {
    // Raw mnemonic phrase
    if (bip39.validateMnemonic(value)) {
      console.log('valid mnemonic')
      return true
    }
    // Base64 encoded encrypted phrase
    return /[a-zA-Z0-9+/]=?$/.test(value)
  })

const validationSchema = Yup.object({
  recoveryKey: Yup.string()
    .required('This is required.')
    .test(
      'is-valid',
      'That’s not a valid recovery code or key',
      value => validateAndCleanRecoveryInput(value).isValid
    )
})

export default class InitialSignInScreen extends React.PureComponent {
  state = {
    isScanning: false,
    scanError: null
  }

  handleScan = async data => {
    const valid = await validateInput(data)
    if (valid) {
      this.props.next(data)
    } else {
      this.setState({ scanError: 'Invalid recovery code scanned' })
      clearTimeout(this.scanErrorTimeout)
      this.scanErrorTimeout = setTimeout(() => {
        this.setState({ scanError: null })
      }, 3000)
    }
  }

  handleScanError = err => {
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
    const isNative = document.location.search.indexOf('client=ios_secure') !== -1

    const actionItems = [
      {
        label: 'Sign In',
        primary: true,
        icon: 'ArrowRightIcon',
        type: 'submit'
      }
    ]

    if (!isNative) {
      actionItems.unshift({
        label: 'Scan',
        icon: 'QrcodeIcon',
        onClick: this.startScanning
      })
    }

    const screen = {
      title: {
        children: 'Enter Secret Recovery Key or Magic Recovery Code'
      },
      content: {
        grow: 1,
        form: {
          validationSchema,
          initialValues: { recoveryKey: value },
          onSubmit: values => {
            next(validateAndCleanRecoveryInput(values.recoveryKey).cleaned)
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
            items: actionItems
          }
        },
        children: (
          <>
            <Type.p>
              Your Magic Recovery Code and Secret Recovery Key&nbsp;were emailed
              when you first created your Blockstack&nbsp;ID.
            </Type.p>
            {isScanning && (
              <QrScan
                onScan={this.handleScan}
                onError={this.handleScanError}
                handleClose={this.stopScanning}
                error={scanError}
              />
            )}
          </>
        )
      }
    }

    return <ShellScreen {...rest} {...screen} />
  }
}

InitialSignInScreen.propTypes = {
  next: PropTypes.func,
  value: PropTypes.string
}
