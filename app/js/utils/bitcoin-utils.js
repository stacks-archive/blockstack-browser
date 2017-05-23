import log4js from 'log4js'

const logger = log4js.getLogger('utils/bitcoin-utils.js')

const SATOSHIS_IN_BTC = 100000000

export function btcToSatoshis(amountInBtc) {
  return amountInBtc * SATOSHIS_IN_BTC
}

export function broadcastTransaction(broadcastTransactionUrl, rawTransaction) {
  return new Promise((resolve, reject) => {
    const payload =  { rawtx: rawTransaction }

    fetch(broadcastTransactionUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    }).then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        resolve(responseJson)
      })
    .catch((error) => {
      logger.error('broadcastTransaction: error broadcasting transaction', error)
      reject(error)
    })
  })
}

export function getUtxo(utxoUrl, address) {
  return new Promise((resolve, reject) => {
    const url = utxoUrl.replace({ address }, address)
    fetch(url)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      resolve(responseJson)
    })
    .catch((error) => {
      reject(error)
    })
  })
}

export function getNetworkFee(bytes) {
  return new Promise((resolve, reject) => {
    fetch('https://bitcoinfees.21.co/api/v1/fees/recommended')
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const satoshisPerByte = responseJson.fastestFee
      const fee = bytes * satoshisPerByte
      resolve(fee)
    })
    .catch((error) => {
      reject(error)
    })
  })
}
