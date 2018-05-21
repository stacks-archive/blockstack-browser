import React from 'react'
import PropTypes from 'prop-types'
import { ShellParent } from '@blockstack/ui'
import {
  selectIdentityAddresses,
  selectPublicKeychain
} from '@common/store/selectors/account'
import { connect } from 'react-redux'
import { Initial } from './views'


const views = [Initial]
const mapStateToProps = state => ({
  addresses: selectIdentityAddresses(state),
  publicKeychain: selectPublicKeychain(state)
})

const AuthIndex = props => <ShellParent views={views} {...props} />

AuthIndex.propTypes = {
  addresses: PropTypes.array.isRequired,
  publicKeychain: PropTypes.string.isRequired
}

export default connect(mapStateToProps, null, AuthIndex)
