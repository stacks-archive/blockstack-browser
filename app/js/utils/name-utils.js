import hasProp from 'hasprop'

export function isABlockstackName(s) {
  return /^[a-z0-9_-]+\.[a-z0-9_-]+$/.test(s)
}

export function isABlockstackIDName(s) {
  return /^[a-z0-9_]+\.id$/.test(s)
}

export function isABlockstackAppName(s) {
  return /^[a-z0-9-]+\.app$/.test(s)
}

export function hasNameBeenPreordered(domainName, localIdentities) {
  let nameHasBeenPreordered = false
  Object.keys(localIdentities).map((localDomainName) => {
    if (localDomainName === domainName) {
      nameHasBeenPreordered = true
      return
    }
  })
  return nameHasBeenPreordered
}

export function isNameAvailable(lookupUrl, domainName) {
  return new Promise((resolve, reject) => {
    const url = lookupUrl.replace('{name}', domainName)
    fetch(url)
      .then((response) => {
        if(response.ok) {
            resolve(false)
        } else {
          if(response.status == 404) {
            resolve(true)
          }
        }
      })
      .catch((error) => {
        console.warn(error)
        reject(error)
      })
  })
}

export function getNamePrices(priceUrl, domainName) {
  return new Promise((resolve, reject) => {
    if (!isABlockstackName(domainName)) {
      reject("Not a Blockstack name")
      return
    }

    const url = priceUrl.replace('{name}', domainName)

    fetch(url).then(

    ).then((response) => {
      if(response.ok) {
        response.text().then((responseText) => JSON.parse(responseText))
        .then((responseJson) => {
          resolve(responseJson)
        })
      } else {
        reject("Error")
      }
    })
    .catch((error) => {
      console.warn(error)
      reject(error)
    })
  })

}
