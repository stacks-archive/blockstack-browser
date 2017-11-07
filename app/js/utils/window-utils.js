export function openInNewTab(url) {
  const win = window.open(url, '_blank')
  win.focus()
}

const mobileWindowWidth = 768

export function isMobile() {
  if (window.innerWidth <= mobileWindowWidth) {
    return true
  } else {
    return false
  }
}