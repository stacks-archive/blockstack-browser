import './setup'
import { IdentityNameValidityError, validateSubdomainFormat, validateSubdomainAvailability, validateSubdomain } from '../src/utils'
import { Subdomains, registrars } from '../src'

describe(validateSubdomainFormat.name, () => {
  it('returns error state when string less than 8 characters', () => {
    const result = validateSubdomainFormat('john')
    expect(result).toEqual(IdentityNameValidityError.MINIMUM_LENGTH)
  })

  it('returns error state when string has more than 38 characters', () => {
    const result = validateSubdomainFormat('pneumonoultramicroscopicsilicovolcanoconiosis')
    expect(result).toEqual(IdentityNameValidityError.MAXIMUM_LENGTH)
  })

  it('returns error state when using uppercase chars', () => {
    const result = validateSubdomainFormat('COOLNAMEBRO')
    expect(result).toEqual(IdentityNameValidityError.ILLEGAL_CHARACTER)
  })

  it('returns error state when using non-underscore symbols', () => {
    const result = validateSubdomainFormat('kyranj@mie')
    expect(result).toEqual(IdentityNameValidityError.ILLEGAL_CHARACTER)
  })

  it('returns error state when using non-underscore symbols', () => {
    const result = validateSubdomainFormat('COOLNAMEBRO')
    expect(result).toEqual(IdentityNameValidityError.ILLEGAL_CHARACTER)
  })

  it('returns error state when using sneaky homoglyphs', () => {
    const legitIndentity = 'kyranjamie'
    const homoglyph = 'kyrаnjamie'
    // eslint-disable-next-line 
    // @ts-ignore
    expect(legitIndentity === homoglyph).toEqual(false)
    const shouldPassResult = validateSubdomainFormat(legitIndentity)
    expect(shouldPassResult).toBeNull()

    const shouldFailResult = validateSubdomainFormat(homoglyph)
    expect(shouldFailResult).toEqual(IdentityNameValidityError.ILLEGAL_CHARACTER)
  })

  it('allows a selection of legit names', () => {
    const names = [
      'kyranjamie',
      'jasperjansz101',
      'auln3auuuu',
      'honeypot1337',
      'marina_p',
      '42214218',
      'emotion_trouble_solution_juice',
      '________'
    ]
    names.forEach(name => expect(validateSubdomainFormat(name)).toBeNull())
  })
})

describe(validateSubdomainAvailability.name, () => {
  it('fetches the status of a username', async () => {
    fetchMock.once(JSON.stringify({ success: true }))
    const response = await validateSubdomainAvailability('slkdjfskldjf', Subdomains.BLOCKSTACK)
    expect(response).toEqual({ success: true })
  })

  test('uses the correct registrar URL', async () => {
    fetchMock.mockClear()
    fetchMock.once(JSON.stringify({ success: true }))
    const response = await validateSubdomainAvailability('slkdjfskldjf', Subdomains.TEST)
    expect(response).toEqual({ success: true })
    const url: string = fetchMock.mock.calls[0][0]
    expect(url.includes(registrars[Subdomains.TEST].apiUrl)).toBeTruthy()
  })
})

describe(validateSubdomain.name, () => {
  test('returns unavailable if status is unavailable', async () => {
    fetchMock.once(JSON.stringify({ status: 'unavailable' }))
    const error = await validateSubdomain('asdfasdf')
    expect(error).toEqual(IdentityNameValidityError.UNAVAILABLE)
  })
})
