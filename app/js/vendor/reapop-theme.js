/**
 * TODO: Replace with `reapop-theme-wybo` module along with css once webpack
 * is the build tool, so that it can handle styles.
 */

 // media breakpoint - small screen min width
 const smallScreenMin = 768

 // default className for NotificationsSystem component
 const notificationsSystemClassName = 'notifications-system'

 // default className for NotificationsContainer component
 const notificationsContainerClassName = {
   main: 'notifications-container',
   position: (_pos) => `notifications-container--${_pos}`
 }

 // default transition for Notification component
 const notificationsContainerTransition = {
   enterTimeout: 500,
   leaveTimeout: 900,
   name: {
     enter: 'notification-wrapper-enter',
     leave: 'notification-wrapper-leave'
   }
 }

 // default className for Notification component
 const notificationClassName = {
   main: 'notification',
   wrapper: 'notification-wrapper',
   meta: 'notification-meta',
   title: 'notification-title',
   message: 'notification-message',
   // `fa` corresponds to font-awesome's class name
   icon: 'fa notification-icon',
   imageContainer: 'notification-image-container',
   image: 'notification-image',
   status: (_status) => `notification--${_status}`,
   dismissible: 'notification--dismissible',
   buttons: (count) => {
     if (count === 0) {
       return ''
     } else if (count === 1) {
       return 'notification--buttons-1'
     } else if (count === 2) {
       return 'notification--buttons-2'
     }
     return 'notification-buttons'
   },
   closeButtonContainer: 'notification-close-button-container',
   closeButton: 'fa notification-close-button',
   button: 'notification-button',
   buttonText: 'notification-button-text'
 }

 export default {
   smallScreenMin,
   notificationsSystem: {
     className: notificationsSystemClassName
   },
   notificationsContainer: {
     className: notificationsContainerClassName,
     transition: notificationsContainerTransition
   },
   notification: {
     className: notificationClassName
   }
 }
