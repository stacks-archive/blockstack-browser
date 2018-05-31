const formatAppManifest = manifest => {
  if (!manifest) {
    return undefined
  }
  const {
    name = 'Untitled dApp',
    icons = [{ src: '/images/app-icon-hello-blockstack.png' }],
    ...restOfManifest
  } = manifest

  return { name, icon: icons[0].src, ...restOfManifest }
}

const asyncLocalStorage = {
  setItem: (key, value) =>
    Promise.resolve().then(() => localStorage.setItem(key, value)),
  getItem: key => Promise.resolve().then(() => localStorage.getItem(key)),
  removeItem: key => Promise.resolve().then(() => localStorage.removeItem(key))
}

export { formatAppManifest, asyncLocalStorage }
