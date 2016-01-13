import hasProp from 'hasprop'

export function hasNameBeenPreordered(name, preorderedIdentities) {
  let nameHasBeenPreordered = false
  preorderedIdentities.map(function(identity) {
    if (identity.id === name) {
      nameHasBeenPreordered = true
      return
    }
  })
  return nameHasBeenPreordered
}

export function isNameAvailable(nameLookupUrl, name, callback) {
  const username = name.split('.')[0]
  const url = nameLookupUrl + username

  fetch(url)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      let isAvailable = false
      console.log(responseJson)
      if (hasProp(responseJson, username + '.' + "error.type")) {
        const errorType = responseJson[username]["error"]["type"]
        console.log(errorType)
        if (errorType === "username_not_registered") {
          isAvailable = true
        }
      } else {
        console.log('agh')
      }
      callback(isAvailable)
    })
}