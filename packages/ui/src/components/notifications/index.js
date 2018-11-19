import React from 'react'
import produce from 'immer'
import shortid from 'shortid'
import PropTypes from 'prop-types'

import { Container } from './styles.js'
import { Messages } from './messages'

/**
 * Action Types
 */
const NOTIFICATION_ADD = 'notifications/NOTIFICATION_ADD'
const NOTIFICATION_REMOVE = 'notifications/NOTIFICATION_REMOVE'
const NOTIFICATION_LEAVE = 'notifications/NOTIFICATION_LEAVE'

const actions = {
  NOTIFICATION_ADD,
  NOTIFICATION_REMOVE,
  NOTIFICATION_LEAVE
}

// Initial state
const initialState = {
  items: [],
  leaving: []
}

/**
 * Notification Types
 */
const NOTIFICATION_TYPES = {
  ALERT: 'notification/ALERT',
  DEFAULT: 'notification/DEFAULT',
  WARNING: 'notification/WARNING',
  SUCCESS: 'notification/SUCCESS'
}

/**
 * Context
 */
const NotificationContext = React.createContext()

/**
 * Our Hub
 */
class NotificationsHub extends React.Component {
  static defaultProps = {
    config: { tension: 125, friction: 20, precision: 0.1 }, // react-spring config
    timeout: 2400, // lifetime of the notification in ms
    canClose: true, // shows an X button to dismiss
    threshold: Infinity, // limit of notifications on screen
    position: 'end', // start | center | end
    top: true // top || bottom
  }

  state = initialState

  cancelMap = new WeakMap()

  /**
   * Dispatch
   * This will either use the connected dispatch if using redux,
   * or fall back to the local state version
   */
  dispatch = ({ type, payload }) =>
    this.props.dispatch
      ? this.props.dispatch({ type, payload })
      : this.setState(
          produce((draft) => {
            switch (type) {
              case actions.NOTIFICATION_ADD:
                draft.items.push({ key: shortid.generate(), ...payload })
                break
              case actions.NOTIFICATION_REMOVE:
                draft.items.splice(
                  draft.items.findIndex((i) => i.key === payload.key),
                  1
                )
                break
              case actions.NOTIFICATION_LEAVE:
                draft.leaving.splice(
                  draft.leaving.findIndex((i) => i.key === payload.key),
                  1
                )
                break
            }
          })
        )

  /**
   * doNotify
   * This is our main notification action
   * @param {string || object} notif - either a string or notification object
   * @param {string} type - notification type
   */
  doNotify = (notif, type = NOTIFICATION_TYPES.DEFAULT) => {
    const isString = typeof notif === 'string'

    const notification = isString
      ? {
          message: notif
        }
      : notif

    this.dispatch({
      type: NOTIFICATION_ADD,
      payload: {
        ...notification,
        type
      }
    })
  }
  /**
   * doNotifyAlert
   * Send an alert notification
   * @param {string || object} notif - either a string or notification object
   */
  doNotifyAlert = (notif) => this.doNotify(notif, NOTIFICATION_TYPES.ALERT)
  /**
   * doNotifyWarning
   * Send a warning notification
   * @param {string || object} notif - either a string or notification object
   */
  doNotifyWarning = (notif) => this.doNotify(notif, NOTIFICATION_TYPES.WARNING)
  /**
   * doNotifySuccess
   * Send a success notification
   * @param {string || object} notif - either a string or notification object
   */
  doNotifySuccess = (notif) => this.doNotify(notif, NOTIFICATION_TYPES.SUCCESS)
  /**
   * doRemove
   * Removes the notification
   * @param {object} item - notification object
   */
  doRemove = (item) =>
    this.dispatch({
      type: NOTIFICATION_REMOVE,
      payload: item
    })
  /**
   * doCancel
   * Cancel a notification before timeout
   * @param {object} item - notification object
   * @param {boolean} secondPass - something
   */
  doCancel = (item, secondPass = false) => {
    if (this.cancelMap.has(item)) {
      const fn = this.cancelMap.get(item)
      fn()
      if (secondPass) fn()
    }
  }

  /**
   * config
   * This is for react-spring
   * @param {object} item - notification object
   * @param {string} state - animation state
   */
  config = (item, state) => {
    const { config, timeout } = this.props
    return state === 'leave' ? [{ duration: timeout }, config, config] : config
  }
  /**
   * doLeaveNotification
   * Dispatch an action to remove the item from the leaving array
   * @param {object} item - notification object
   */
  doLeaveNotification = (item) =>
    this.dispatch({
      type: NOTIFICATION_LEAVE,
      payload: item
    })
  /**
   * leave
   * This is for react-spring, what happens on leave
   * @param {object} item - notification object
   */
  leave = (item) => async (next, cancel) => {
    this.cancelMap.set(item, cancel)
    await next({ to: { life: 0 } })
    await next({ to: { opacity: 0 } })
    await next({ to: { height: 0 } }, true)
    // use either the connected redux action, or the local one
    this.props.doLeaveNotification
      ? this.props.doLeaveNotification(item)
      : this.doLeaveNotification(item)
  }

  render() {
    const { showIndicator, canClose, position, top, children } = this.props
    return (
      <NotificationContext.Provider
        value={{
          items: this.props.items || this.state.items,
          leaving: this.props.leaving || this.state.leaving,
          remove: this.props.doRemove || this.doRemove,
          leave: this.leave,
          config: this.config,
          doNotify: this.props.doNotify || this.doNotify,
          doNotifyAlert: this.props.doNotifyAlert || this.doNotifyAlert,
          doNotifyWarning: this.props.doNotifyWarning || this.doNotifyWarning,
          doNotifySuccess: this.props.doNotifySuccess || this.doNotifySuccess,
          cancel: this.doCancel,
          showIndicator,
          canClose,
          position,
          top
        }}
      >
        <>
          <Container position={position} top={top}>
            <Messages />
          </Container>
          {children}
        </>
      </NotificationContext.Provider>
    )
  }
}

/**
 * Notify
 * This is a render props component that can allow you to wrap something with
 * our actions to display notifications
 */
const Notify = ({ notification, type, children, ...rest }) => (
  <NotificationContext.Consumer>
    {({ doNotify, doNotifyAlert, doNotifyWarning, doNotifySuccess }) =>
      children({
        bind: { onClick: () => doNotify(notification, type) },
        doNotify,
        doNotifyAlert,
        doNotifyWarning,
        doNotifySuccess
      })
    }
  </NotificationContext.Consumer>
)

Notify.propTypes = {
  notification: PropTypes.any,
  children: PropTypes.func,
  type: PropTypes.oneOf(['default', 'alert', 'warning', 'success'])
}

export { Notify, NotificationContext, actions, initialState }

export default NotificationsHub
