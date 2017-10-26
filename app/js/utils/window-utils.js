export function openInNewTab(url) {
  const win = window.open(url, '_blank')
  win.focus()
}

export function isWindowsBuild() {

  const isWindowsBuildCompileFlag = false
  return isWindowsBuildCompileFlag === true
}
