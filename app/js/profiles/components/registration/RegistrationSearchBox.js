import React, { PropTypes, Component } from 'react'
import Alert from '../../../components/Alert'
import { browserHistory } from 'react-router'

class RegistrationSearchBox extends Component {
  static propTypes = {
    alerts: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    username: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
  }

  onCancelClick() {
    browserHistory.push('/profiles')
  }

  render() {
    return (
      <div>
        <h3 className="modal-heading">Search for your username</h3>
        <div className="modal-body">
        {
          this.props.alerts.map((alert, index) =>
             (
            <Alert
              key={index} message={alert.message} status={alert.status} url={alert.url}
            />
             )
          )
        }
          <p>
            Add a username to save your profile so you can interact with other
            people on the decentralized internet.
          </p>
          <form
            className="container-fluid"
            onSubmit={this.props.search}
            style={{ width: '90%' }}
          >
            <input
              name="username"
              className="form-control text-xs-center"
              placeholder="Username"
              value={this.props.username}
              onChange={this.props.onChange}
              required
              disabled={this.props.disabled}
              style={{ marginBottom: '5px' }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={this.props.disabled}
            >
              Search
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={this.onCancelClick}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  }
}

RegistrationSearchBox.propTypes = {
  alerts: PropTypes.array.isRequired,
  search: PropTypes.func.isRequired,
  username: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}

export default RegistrationSearchBox
