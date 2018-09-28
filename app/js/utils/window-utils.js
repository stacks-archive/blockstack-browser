import { REGTEST_CORE_API_ENDPOINT }  from '../account/store/settings/default'

export function openInNewTab(url) {
  const win = window.open(url, '_blank')
  win.focus()
}

export function isWindowsBuild() {
  const isWindowsBuildCompileFlag = false
  return isWindowsBuildCompileFlag === true
}

export function isWebAppBuild() {
  const URL = document.createElement('a')
  URL.href = window.location.href
  const hostname = URL.hostname
  return hostname === 'browser.blockstack.org'
  //let isWebAppBuildCompileFlag = false
  //return isWebAppBuildCompileFlag === true
}

/**
 * Will determine whether or not we should try to
 *  perform "private" core endpoint functions --
 *  basically, attempts to read/write the core wallet.
 * Tests using the compile flags determining if its
 *  a Windows / WebApp build and using the URL --
 * if it's the standard regtest URL, then, yes, try
 *  to do the private operations, otherwise, no.
 * @private
 */
export function isCoreEndpointDisabled(testUrl) {
  return (isWindowsBuild() || isWebAppBuild() ||
    !testUrl.startsWith(REGTEST_CORE_API_ENDPOINT))
}

const mobileWindowWidth = 768

export function isMobile() {
  if (window.innerWidth <= mobileWindowWidth) {
    return true
  } else {
    return false
  }
}
