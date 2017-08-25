import React, { PropTypes } from 'react'
import Alert from '../../../components/Alert'

const RegistrationSearchBox = (props) =>
  (
  <div>
    <h3 className="modal-heading">Search for your username</h3>
    <div className="modal-body">
    {
      props.alerts.map((alert, index) =>
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
        onSubmit={props.search}
        style={{ marginBottom: '2rem', width: '90%' }}
      >
        <input
          name="username"
          className="form-control text-xs-center"
          placeholder="Username"
          value={props.username}
          onChange={props.onChange}
          required
          disabled={props.disabled}
          style={{ marginBottom: '5px' }}
        />
        <button
          type="submit"
          className="btn btn-electric-blue btn-block"
          disabled={props.disabled}
        >
          Search
        </button>
      </form>
    </div>
  </div>
 )

RegistrationSearchBox.propTypes = {
  alerts: PropTypes.array.isRequired,
  search: PropTypes.func.isRequired,
  username: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}

export default RegistrationSearchBox
