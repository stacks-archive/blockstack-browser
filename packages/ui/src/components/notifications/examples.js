import React from 'react'
import { Notify } from './index'
import { Button } from '../button'

const example = (
  <Notify notification="My Message!">
    {({ bind }) => <Button {...bind}>Show notification</Button>}
  </Notify>
)
const example3 = (
  <Notify
    notification={{
      title: 'Title Example',
      message: 'Notifications can have a title and body message.'
    }}
  >
    {({ bind }) => <Button {...bind}>Show advanced notification</Button>}
  </Notify>
)
const example2 = (
  <Notify>
    {({ doNotifyWarning }) => (
      <Button onClick={() => doNotifyWarning('My warning message')}>
        Show Warning Notification
      </Button>
    )}
  </Notify>
)
