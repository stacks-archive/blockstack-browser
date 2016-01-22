import hasProp from 'hasprop'

export function hasNameBeenPreordered(domainName, localIdentities) {
  let nameHasBeenPreordered = false
  localIdentities.map(function(identity) {
    if (identity.id === domainName) {
      nameHasBeenPreordered = true
      return
    }
  })
  return nameHasBeenPreordered
}

export function isNameAvailable(lookupUrl, domainName, callback) {
  const username = domainName.split('.')[0]
  const url = lookupUrl.replace('{name}', username)
  console.log(url)
  fetch(url)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      let isAvailable = false
      if (hasProp(responseJson, username + '.error.type')) {
        const errorType = responseJson[username]["error"]["type"]
        if (errorType === "username_not_registered") {
          isAvailable = true
        }
      }
      callback(isAvailable)
    })
}