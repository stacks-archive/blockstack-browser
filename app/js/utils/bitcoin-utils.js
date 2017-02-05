
export function getUtxo(address) {
  return new Promise((resolve, reject) => {
    fetch(`https://explorer.blockstack.org/insight-api/addr/${address}/utxo`)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      resolve(responseJson)
    }).catch((error) => {
      reject(error)
    })
  })
}



export function getMinerFee (bytes) {
  return new Promise((resolve, reject) => {
    fetch(`https://bitcoinfees.21.co/api/v1/fees/recommended`)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const satoshisPerByte = responseJson.fastestFee
      const fee = bytes * satoshisPerByte
      resolve(fee)
    }).catch((error) => {
      reject(error)
    })
  })
}
