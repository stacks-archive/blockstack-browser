import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Notification from '../components/Notification'

export default class TasksPage extends Component {
  constructor() {
    super()
  }

  render() {
    var tasks = [
      { label: "Create an identity"       , url: '/register'},
      { label: "Backup your account"      , url: '/backup'},
      { label: "Set a password"           , url: '/settings'}
    ]

    return (
      <div>
        <div>
          <h3>Notifications</h3>

          <ul className="list-group">
            {tasks.map(function(task, index) {
              return (
                <Notification
                  key={index}
                  label={task.label}
                  url={task.url} />
              )
            })}
          </ul>

        </div>
      </div>
    )
  }
}
