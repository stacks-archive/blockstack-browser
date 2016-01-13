
export function getNameCost(nameWithTld) {
    if !(/^[a-z0-9_-]+.[a-z0-9_-]+$/.test(nameWithTld)) {
        throw new Error('Invalid name')
    }

    const name = nameWithTld.split('.')[1],
          tld = nameWithTld.split('.')[1]

    switch (tld) {
        case 'id':
            const baseCost = 102400000,
                  lengthDivisor = 4,
                  vowelDivisor = 4,
                  numericDivisor = 4,
                  symbolicDivisor = 4

            const lengthAdjustment = Math.pow(lengthDivisor, (name.length-1)),
                  vowelAdjustment = (['a', 'e', 'i', 'o', 'u'].indexOf(name) > -1) ? vowelDivisor : 1,
                  numericAdjustment = (/\d+/.test(name)) ? numericDivisor : 1,
                  symbolicAdjustment = (/[_-]+/.test(name)) ? symbolicDivisor : 1
            const contentsAdjustment = Math.max(vowelAdjustment, numericAdjustment, symbolicAdjustment)

            return baseCost / (lengthAdjustment*contentsAdjustment)
        default:
            return null
    }
}
