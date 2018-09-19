const formatAppManifest = manifest => {
  if (!manifest) {
    return undefined
  }
  const {
    name = 'Untitled dApp',
    icons = [{ src: '/static/images/app-icon-hello-blockstack.png' }],
    ...restOfManifest
  } = manifest

  return { name, icon: icons[0].src, ...restOfManifest }
}

const isArray = value =>
  value && typeof value === 'object' && value.constructor === Array

export { formatAppManifest, isArray }
