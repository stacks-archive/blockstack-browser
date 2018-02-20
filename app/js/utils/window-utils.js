export function openInNewTab(url) {
  const win = window.open(url, '_blank')
  win.focus()
}

export function isWindowsBuild() {
  const isWindowsBuildCompileFlag = false
  return isWindowsBuildCompileFlag === true
}

export function isWebAppBuild() {
  const isWebAppBuildCompileFlag = false
  return isWebAppBuildCompileFlag === true
}

export function isCoreEndpointDisabled() {
  return isWindowsBuild() || isWebAppBuild()
}

const mobileWindowWidth = 768

export function isMobile() {
  if (window.innerWidth <= mobileWindowWidth) {
    return true
  } else {
    return false
  }
}
