import React, { PropTypes } from 'react'
import Alert from '../components/Alert'

const AddUsernameSearchBox = (props) =>
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
        className="form-inline"
        onSubmit={props.search}
        style={{ marginBottom: '2em' }}
      >
        <input
          name="username"
          className="form-control"
          placeholder="Username"
          value={props.username}
          onChange={props.onChange}
          required
          disabled={props.disabled}
        />
        <button
          type="submit"
          className="btn btn-blue"
          disabled={props.disabled}
        >
          Search
        </button>
      </form>
    </div>
  </div>
 )

AddUsernameSearchBox.propTypes = {
  alerts: PropTypes.array.isRequired,
  search: PropTypes.func.isRequired,
  username: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
}

export default AddUsernameSearchBox
