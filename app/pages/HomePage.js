import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import Alert from '../components/Alert'

class HomePage extends Component {
  constructor() {
    super()
  }

  render() {
    var tasks = [
      { label: "Fund your account", url: "/deposit",
        body: "to pay for identity registrations"},
      { label: "Register your first identity", url: "/register",
        body: "to start building your profile and connecting with others"},
      { label: "Backup your account", url: "/backup",
        body: "to recover it in the event of a loss"}
    ]

    return (
      <div>
        <div>
          <h3>Home</h3>

          <ul className="list-group">
            {tasks.map(function(task, index) {
              return (
                <Alert message={task.label + " - " + task.body} status="info"
                  key={index} url={task.url} />
              )
            })}
          </ul>

        </div>
      </div>
    )
  }
}

export default HomePage