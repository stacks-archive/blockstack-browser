// @flow
import { stringify } from 'query-string'
// import store from '../store'

// const API_URL = 'https://browser-api.blockstack.org'
const API_URL = 'http://localhost:2888'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

class ServerAPIClass {
  request(path: string, method: Method, args: object = {}) {
    const headers = new Headers()
    let body
    let query = ''

    headers.append('Accept', 'application/json')
    if (method === 'POST') {
      body = JSON.stringify(args)
      headers.append('Content-Type', 'application/json')
    }
    else {
      query = `?${stringify(args)}`
    }

    return fetch(`${API_URL}${path}${query}`, {
      method,
      headers,
      body
    })
    .then(res => res.json())
    .then(res => {
      if (res.status !== undefined && !res.status) {
        throw new Error(res.error || 'Request failed')
      }
      return res
    })
  }

  get(path: string, args: object) {
    return this.request(path, 'GET', args)
  }

  post(path: string, args: object) {
    return this.request(path, 'POST', args)
  }

  put(path: string, args: object) {
    return this.request(path, 'PUT', args)
  }

  delete(path: string, args: object) {
    return this.request(path, 'DELETE', args)
  }
}

export const ServerAPI = new ServerAPIClass()

/**
 * Track an event for stats, only if the user hasn’t opted out. Requests are
 * fire-and-forget, failures are simply swallowed.
 * @param {string} event - Name of the event
 * @param {object} properties - Serializable list of properties about the event
 */
export function trackEvent(event: string, properties: object) {
  // const state = store.getState()
  //
  // if (state.settings.api.hasDisabledEventTracking) {
  //   return
  // }

  ServerAPI.post('/event', {
    event,
    properties,
    distinctId: 'hello'//state.settings.api.distinctId
  })
  console.log('Tracking', event)
}

/**
 * Track an event once per session. Subsequent track attempts do nothing.
 * @see {@link trackEvent} for more info
 */
export function trackEventOnce(event: string, properties: object) {
  if (!trackedEvents[event]) {
    trackEvent(event, properties)
  }
  trackedEvents[event] = true
}
const trackedEvents = {}
