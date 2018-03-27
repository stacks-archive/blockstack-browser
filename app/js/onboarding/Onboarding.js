import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Email } from './views'
import PanelShell from './components/PanelShell'

export default class Onboarding extends Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired
  }

  state = {
    email: '',
    password: '',
    username: '',
    view: Email
  }

  render() {
    return (
      <div className="onboarding">
        <PanelShell>
          <this.state.view updateView={updatedView => this.setState({ view: updatedView })} />
        </PanelShell>
      </div>
    )
  }
}
