import Wallet from '../src/wallet'

const defaultSeed = 'sound idle panel often situate develop unit text design antenna '
  + 'vendor screen opinion balcony share trigger accuse scatter visa uniform brass '
  + 'update opinion media'

export const getWallet = async (seed: string = defaultSeed) => {
  const wallet = await Wallet.restore('password', seed)
  return wallet
}

export const getIdentity = async (seed: string = defaultSeed) => {
  const wallet = await getWallet(seed)
  const [identity] = wallet.identities
  return identity
}

export const getNewIdentity = async () => {
  const wallet = await Wallet.generate('password')
  return wallet.identities[0]
}

export const profileResponse = [
  {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiI1NzEyMjE5MC1kZGI2LTQwMzgtYjQxZC04YmM5NzJiOGY4NTYiLCJpYXQiOiIyMDE5LTEyLTA2VDA5OjU1OjM1LjI5N1oiLCJleHAiOiIyMDIwLTEyLTA2VDA5OjU1OjM1LjI5N1oiLCJzdWJqZWN0Ijp7InB1YmxpY0tleSI6IjAzZTkzYWU2NWQ2Njc1MDYxYTE2N2MzNGI4MzIxYmVmODc1OTQ0NjhlOWIyZGQxOWMwNWE2N2E3YjRjYWVmYTAxNyJ9LCJpc3N1ZXIiOnsicHVibGljS2V5IjoiMDNlOTNhZTY1ZDY2NzUwNjFhMTY3YzM0YjgzMjFiZWY4NzU5NDQ2OGU5YjJkZDE5YzA1YTY3YTdiNGNhZWZhMDE3In0sImNsYWltIjp7IkB0eXBlIjoiUGVyc29uIiwiQGNvbnRleHQiOiJodHRwOi8vc2NoZW1hLm9yZyIsImFwcHMiOnsiaHR0cHM6Ly9iYW50ZXIucHViIjoiaHR0cHM6Ly9nYWlhLmJsb2Nrc3RhY2sub3JnL2h1Yi8xRGt1QUNodWZZalRrVENlakpnU3p0dXFwNUtkeWtwV2FwLyIsImh0dHA6Ly8xMjcuMC4wLjE6MzAwMCI6Imh0dHBzOi8vZ2FpYS5ibG9ja3N0YWNrLm9yZy9odWIvMTVoQUxuRUo4ZnZYTmdSeXptVnNwRHlaY0dFeExHSE5TZi8iLCJodHRwczovL2Jsb2Nrc3RhY2suZ2l0aHViLmlvIjoiaHR0cHM6Ly9nYWlhLmJsb2Nrc3RhY2sub3JnL2h1Yi8xRUR1dktmenVOUlVlbnR6MXQ1amZ4VDlmVzFIUDJOSkdXLyJ9LCJhcGkiOnsiZ2FpYUh1YkNvbmZpZyI6eyJ1cmxfcHJlZml4IjoiaHR0cHM6Ly9nYWlhLmJsb2Nrc3RhY2sub3JnL2h1Yi8ifSwiZ2FpYUh1YlVybCI6Imh0dHBzOi8vaHViLmJsb2Nrc3RhY2sub3JnIn19fQ.IqsvlAnuWd3H8K0hZHdb3p4jm2KC2UXQv0PBKR9U_kFikfXw4wvGbmfh5HYp4q_5sHi2oZZoNPygsdgV7UFQjg',
    decodedToken: {
      header: {
        typ: 'JWT',
        alg: 'ES256K'
      },
      payload: {
        jti: '57122190-ddb6-4038-b41d-8bc972b8f856',
        iat: '2019-12-06T09:55:35.297Z',
        exp: '2020-12-06T09:55:35.297Z',
        subject: {
          publicKey: '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017'
        },
        issuer: {
          publicKey: '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017'
        },
        claim: {
          '@type': 'Person',
          '@context': 'http://schema.org',
          apps: {
            'https://banter.pub': 'https://gaia.blockstack.org/hub/1DkuAChufYjTkTCejJgSztuqp5KdykpWap/',
            'http://127.0.0.1:3000': 'https://gaia.blockstack.org/hub/15hALnEJ8fvXNgRyzmVspDyZcGExLGHNSf/',
            'https://blockstack.github.io': 'https://gaia.blockstack.org/hub/1EDuvKfzuNRUentz1t5jfxT9fW1HP2NJGW/'
          },
          api: {
            gaiaHubConfig: {
              url_prefix: 'https://gaia.blockstack.org/hub/'
            },
            gaiaHubUrl: 'https://hub.blockstack.org'
          }
        }
      },
      signature: 'IqsvlAnuWd3H8K0hZHdb3p4jm2KC2UXQv0PBKR9U_kFikfXw4wvGbmfh5HYp4q_5sHi2oZZoNPygsdgV7UFQjg'
    }
  }
]
