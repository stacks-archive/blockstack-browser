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

export { formatAppManifest }
