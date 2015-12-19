import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class DepositPage extends Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div>
        <div>
          <h3>Deposit Bitcoins</h3>

          <p><i>
            Note: every identity registration costs a certain amount of money and must be paid for by funds in your account.
          </i></p>

          <p>To top up your account, send bitcoins to the address below:</p>

          <div className="highlight">
            <pre>
              <code>1HHasDGXWg7vV9QdUe7BJWoJykaBmmLyw4</code>
            </pre>
          </div>

          <div>
            <button className="btn btn-primary">Generate New Address</button>
          </div>
        </div>
      </div>
    )
  }
}
