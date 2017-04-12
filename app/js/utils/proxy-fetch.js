/*
 * Proxies all fetch requests to work around
 * CORS issues
 */
import fetch from 'isomorphic-fetch'

let realFetch = fetch

let proxy = "http://localhost:1337/"


let proxyFetch = function(url, options) {
  const tokens = url.split("//")
  const hostAndPath = tokens[1]
  const scheme = tokens[0]
  const host = hostAndPath.split('/')[0]

  if(scheme == "http") {
    throw new Error("Only supports https requests")
  }

  if(host.endsWith("amazonaws.com") ||
     host.endsWith("facebook.com") ||
     host.endsWith("twitter.com") ||
     host.endsWith("github.com")) {
    return realFetch.call(this, proxy + hostAndPath, options)
  } else {
    return realFetch.call(this, url, options)
  }
}


window.fetch = proxyFetch
window.realFetch = realFetch
window.proxyFetch = proxyFetch
