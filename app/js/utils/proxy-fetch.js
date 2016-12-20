/*
 * Proxies all fetch requests to work around
 * CORS issues
 */
let realFetch = window.fetch

let proxy = "http://localhost:1337/"


let proxyFetch = function(url, options) {
  let tokens = url.split("//")
  let hostAndPath = tokens[1]
  let scheme = tokens[0]

  if(scheme == "http") {
    throw new Error("Only supports https requests")
  }

  return realFetch.call(this, proxy + hostAndPath, options)
}

window.fetch = proxyFetch
window.realFetch = realFetch
