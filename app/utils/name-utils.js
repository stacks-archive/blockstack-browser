import hasProp from 'hasprop'

export function isABlockstoreName(s) {
  return /^[a-z0-9_-]+\.[a-z0-9_-]+$/.test(s)
}

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
  const username = domainName.split('.')[0],
        url = lookupUrl.replace('{name}', username)
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

export function getNameCost(domainName) {
  if (!isABlockstoreName(domainName)) {
    return 0
  }

  const name = domainName.split('.')[0],
        tld = domainName.split('.')[1]

  let baseCost = null,
      floor = null,
      divisors = []

  switch (tld) {
    case 'id':
      baseCost = 102400000
      floor = 25000
      divisors = [4, 4, 4, 4]
      break
    default:
      break
  }

  if (!baseCost || !floor || divisors.length === 0) {
    return 0
  }

  const lengthAdjustment = Math.pow(divisors[0], name.length-1),
        vowelAdjustment = (!/[aeiou]+/.test(name)) ? divisors[1] : 1,
        numericAdjustment = (/\d+/.test(name)) ? divisors[2] : 1,
        symbolicAdjustment = (/[_-]+/.test(name)) ? divisors[3] : 1
  const contentsAdjustment = Math.max(vowelAdjustment, numericAdjustment, symbolicAdjustment)

  let cost = baseCost / (lengthAdjustment*contentsAdjustment)

  if (cost < floor) {
    cost = floor
  }

  return cost
}
