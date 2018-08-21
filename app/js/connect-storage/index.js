import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import qs from 'query-string'
import { SettingsActions } from '../account/store/settings'
import { AppHomeWrapper, Shell } from '@blockstack/ui'
import Modal from 'react-modal'

class ConnectStoragePage extends React.Component {
  state = {
    error: null
  }

  componentDidMount() {
    this.props.connectStorage()
      .then(() => this.redirect())
      .catch((error) => {
        console.error('connectStorage failed', error)
        this.setState({ error })
      })
  }

  redirect() {
    const query = qs.parse(this.props.location.search)
    this.props.router.replace(query && query.redirect ? query.redirect : '/')
  }

  render() {
    const { error } = this.state
    return (
      <React.Fragment>
        <Modal
          className="container-fluid"
          shouldCloseOnOverlayClick={false}
          isOpen
        >
          {!!error ? (
            <div className="alert alert-danger">
              Failed to connect to storage: {error.message}
            </div>
          ) : (
            <div style={{ position: 'relative', height: '140px' }}>
              <Shell.Loading message="Connecting to Gaia storage..." />
            </div>
          )}
        </Modal>
        <AppHomeWrapper />
      </React.Fragment>
    )
  }
}

ConnectStoragePage.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object,
  connectStorage: PropTypes.func.isRequired
}

export default withRouter(connect(undefined, { ...SettingsActions })(ConnectStoragePage))
