import { IdentityNameValidityError, validateIdentityName, checkIdentityNameAvailability } from '../src/utils';
import { Subdomains } from '../src';

describe(validateIdentityName.name, () => {
  it('returns error state when string less than 8 characters', () => {
    const result = validateIdentityName('john')
    expect(result).toEqual(IdentityNameValidityError.MINIMUM_LENGTH)
  })

  it('returns error state when string has more than 38 characters', () => {
    const result = validateIdentityName('pneumonoultramicroscopicsilicovolcanoconiosis')
    expect(result).toEqual(IdentityNameValidityError.MAXIMUM_LENGTH)
  })

  it('returns error state when using uppercase chars', () => {
    const result = validateIdentityName('COOLNAMEBRO')
    expect(result).toEqual(IdentityNameValidityError.ILLEGAL_CHARACTER)
  })

  it('returns error state when using non-underscore symbols', () => {
    const result = validateIdentityName('kyranj@mie')
    expect(result).toEqual(IdentityNameValidityError.ILLEGAL_CHARACTER)
  })

  it('returns error state when using non-underscore symbols', () => {
    const result = validateIdentityName('COOLNAMEBRO')
    expect(result).toEqual(IdentityNameValidityError.ILLEGAL_CHARACTER)
  })

  it('returns error state when using sneaky homoglyphs', () => {
    const legitIndentity = 'kyranjamie'
    const homoglyph = 'kyrаnjamie'
    // eslint-disable-next-line 
    // @ts-ignore
    expect(legitIndentity === homoglyph).toEqual(false)
    const shouldPassResult = validateIdentityName(legitIndentity)
    expect(shouldPassResult).toBeNull()

    const shouldFailResult = validateIdentityName(homoglyph)
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
    names.forEach(name => expect(validateIdentityName(name)).toBeNull())
  })
})

describe(checkIdentityNameAvailability.name, () => {
  it('fetches the status of a username', async () => {
    fetchMock.once(JSON.stringify({ success: true }))
    expect(checkIdentityNameAvailability('slkdjfskldjf', Subdomains.BLOCKSTACK)).toEqual({ success: true })
  })
})
