import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Notification from '../components/Notification'

export default class TasksPage extends Component {
  constructor() {
    super()
  }

  render() {
    var tasks = [
      { label: "Create an identity"       , url: '/'},
      { label: "Backup your account"      , url: '/backup'},
      { label: "Set a password"           , url: '/settings'},
      { label: "Upload a photo"           , url: '/'},
      { label: "Fill out your name"       , url: '/'},
      { label: "Fill out your bio"        , url: '/'},
      { label: "Verify a twitter account" , url: '/'},
      { label: "Verify a facebook account", url: '/'}
    ]

    return (
      <div>
        <div>
          <h3>Notifications</h3>

          <ul className="list-group">
            {tasks.map(function(task, index) {
              console.log(task)
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
