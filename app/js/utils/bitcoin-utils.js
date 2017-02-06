export function broadcastTransaction(rawTransaction) {
  return new Promise((resolve, reject) => {
    const payload =  {rawtx: rawTransaction}

    fetch('https://explorer.blockstack.org/insight-api/tx/send', {
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(payload)
  }).then((response) => response.text())
  .then((responseText) => JSON.parse(responseText))
  .then((responseJson) => {
      console.log(responseJson)
      resolve(responseJson)
    }).catch((error) => {
      reject(error)
    })
  })
}

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



export function getNetworkFee (bytes) {
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
