import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Notification from '../components/Notification'

export default class TasksPage extends Component {
  constructor() {
    super()
  }

  render() {
    var tasks = [
      { label: "Fund your account", url: '/deposit', body: 'To pay for identity registrations'},
      { label: "Register your first identity", url: '/register',
        body: 'So you can start building your profile, connecting with others, and logging into apps'},
      { label: "Backup your account", url: '/backup', body: 'To recover your account in the event of a loss'},
      { label: "Set a password", url: '/settings', body: 'To protect your account from being hacked'}
    ]

    return (
      <div>
        <div>
          <h3>Getting Started</h3>

          <ul className="list-group">
            {tasks.map(function(task, index) {
              return (
                <Notification
                  key={index}
                  label={task.label}
                  body={task.body}
                  url={task.url} />
              )
            })}
          </ul>

        </div>
      </div>
    )
  }
}
