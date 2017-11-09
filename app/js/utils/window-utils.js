export function openInNewTab(url) {
  const win = window.open(url, '_blank')
  win.focus()
}

export function isWindowsBuild() {
  const isWindowsBuildCompileFlag = false
  return isWindowsBuildCompileFlag === true
}

export function isCoreEndpointDisabled() {
  return isWindowsBuild() || isWebAppBuild()
}

export function isWebAppBuild() {
  const isWebAppBuildCompileFlag = false
  return isWebAppBuildCompileFlag === true
}

const mobileWindowWidth = 768

export function isMobile() {
  if (window.innerWidth <= mobileWindowWidth) {
    return true
  } else {
    return false
  }
}

export function registerWebProtocolHandler() {
  window.navigator.registerProtocolHandler(
    'web+blockstack',
    `${location.origin}/auth?authRequest=%s`,
    'Blockstack handler'
  )
}
