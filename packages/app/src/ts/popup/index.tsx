import React from 'react'
import { Store } from 'webext-redux'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import PopupApp from './containers/PopupApp'

const store = new Store({
  portName: 'ExPort' // Communication port between the background component and views such as browser tabs.
})

// eslint-disable-next-line @typescript-eslint/no-floating-promises
store.ready().then(() => {
  ReactDOM.render(
    <Provider store={store as any}>
      <PopupApp />
    </Provider>,
    document.getElementById('popup-root')
  )
})
