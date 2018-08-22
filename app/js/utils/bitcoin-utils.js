import log4js from 'log4js'
import {
  REGTEST_CORE_API_PASSWORD,
  REGTEST_CORE_INSIGHT_API_URL
} from '../account/store/settings/default'
const logger = log4js.getLogger(__filename)

const SATOSHIS_IN_BTC = 100000000

export function btcToSatoshis(amountInBtc) {
  return amountInBtc * SATOSHIS_IN_BTC
}

export function satoshisToBtc(amountInSatoshis) {
  return 1.0 * amountInSatoshis / SATOSHIS_IN_BTC
}

export function broadcastTransaction(broadcastTransactionUrl, rawTransaction) {
  return new Promise((resolve, reject) => {
    const payload = { rawtx: rawTransaction }

    fetch(broadcastTransactionUrl, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        resolve(responseJson)
      })
      .catch(error => {
        logger.error('broadcastTransaction: error broadcasting transaction', error)
        reject(error)
      })
  })
}

export function getInsightUrls(insightUrl, address, coreAPIPassword) {
  console.log(`constant: ${REGTEST_CORE_API_PASSWORD}, parameter: ${coreAPIPassword}`)
  if (coreAPIPassword === REGTEST_CORE_API_PASSWORD) {
    logger.debug('getInsightUrls: using regtest mock insight api ')
    insightUrl = REGTEST_CORE_INSIGHT_API_URL
  }
  const url = insightUrl.replace('{address}', address)
  return {
    base: url,
    confirmedBalanceUrl: `${url}/balance`,
    unconfirmedBalanceUrl: `${url}/unconfirmedBalance`
  }
}

export function getNetworkFee(bytes) {
  return new Promise((resolve, reject) => {
    fetch('https://bitcoinfees.21.co/api/v1/fees/recommended')
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        const satoshisPerByte = responseJson.fastestFee
        const fee = bytes * satoshisPerByte
        resolve(fee)
      })
      .catch(error => {
        reject(error)
      })
  })
}
