import { appendUrlParam } from '@common/api/fetch'

describe(appendUrlParam.name, () => {
  test('it appends url correctly', () => {
    const rootApiUrl = "https://stacks-node-api.testnet.stacks.co/extended/v1"
    const addressTxUrl = rootApiUrl + '/address/STM6S3AESTK9NAYE3Z7RS00T11ER8JJCDNTKG711/transactions?limit=50'
    expect(appendUrlParam('extended/v1', 'unanchored', 'true')).toEqual('extended/v1?unanchored=true')
    expect(appendUrlParam('', 'unanchored', 'true')).toEqual('?unanchored=true')
    expect(appendUrlParam(addressTxUrl, 'unanchored', 'true')).toEqual(addressTxUrl + '&unanchored=true')
  });
})
