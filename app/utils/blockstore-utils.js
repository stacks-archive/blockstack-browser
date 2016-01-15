
export function getNameCost(nameWithTld) {
  if (!/^[a-z0-9_-]+.[a-z0-9_-]+$/.test(nameWithTld)) {
    return 0
  }

  const name = nameWithTld.split('.')[0],
        tld = nameWithTld.split('.')[1]

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

export function getNamesOwned(address, callback) {
  const appId = '73146f6a06443a3a66a7df9473353cde',
        appSecret = '7009a810943a00fe7e8157f27bf91bea7e1b4d4e46db695ba2d11e4333ea6f29'
  const url = 'https://api.onename.com/v1/addresses/' + address + '/names?app-id=' + appId + '&app-secret=' + appSecret

  fetch(url)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const namesOwned = responseJson["names"]
      callback(namesOwned)
    })
    .catch((error) => {
      console.warn(error)
      callback([])
    })
}