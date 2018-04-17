import log4js from 'log4js'
import {
  REGTEST_CORE_API_PASSWORD,
  REGTEST_CORE_INSIGHT_API_URL
} from '../account/store/settings/default'
const logger = log4js.getLogger('utils/bitcoin-utils.js')

const SATOSHIS_IN_BTC = 100000000

export function btcToSatoshis(amountInBtc) {
  return amountInBtc * SATOSHIS_IN_BTC
}

export function satoshisToBtc(amountInSatoshis) {
  return 1.0 * amountInSatoshis / SATOSHIS_IN_BTC
}

export function getInsightUrl(insightUrl, address, coreAPIPassword) {
  console.log(`constant: ${REGTEST_CORE_API_PASSWORD}, parameter: ${coreAPIPassword}`)
  if (coreAPIPassword === REGTEST_CORE_API_PASSWORD) {
    logger.debug('getInsightUrl: using regtest mock insight api ')
    insightUrl = REGTEST_CORE_INSIGHT_API_URL
  }
  const url = insightUrl.replace('{address}', address)
  return url
}

