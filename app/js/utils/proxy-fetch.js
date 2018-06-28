/*
 * Proxies certain fetch requests to work around
 * CORS issues
 */
import fetch from 'isomorphic-fetch'

const realFetch = fetch

const proxy = 'http://localhost:1337/'

function proxyFetch(url, options) {
  console.log(`proxyFetch: ${url}`)
  return new Promise((resolve, reject) => {
    realFetch
    .call(this, proxy + url, options)
    .then((response) => {
      resolve(response)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

function proxyFetchForSomeHosts(url, options) {
  const tokens = url.split('://')
  const hostAndPath = tokens[1]
  const host = hostAndPath.split('/')[0]
  // if (scheme !== 'https') {
  //   return realFetch.call(this, url, options)
  // }

  if (host.endsWith('amazonaws.com') ||
       host.endsWith('facebook.com') ||
       host.endsWith('twitter.com') ||
       host.endsWith('github.com') ||
       host.endsWith('instagram.com') ||
       host.endsWith('linkedin.com') ||
       host.endsWith('ycombinator.com') ||
       host.endsWith('localhost:18332')) {
    return proxyFetch(url, options)
  } else {
    return realFetch.call(this, url, options)
  }
}

window.fetch = proxyFetchForSomeHosts
window.realFetch = realFetch
window.proxyFetch = proxyFetch
