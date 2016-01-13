
export function getNameCost(nameWithTld) {
    if (!/^[a-z0-9_-]+.[a-z0-9_-]+$/.test(nameWithTld)) {
        return 0
    }

    const name = nameWithTld.split('.')[0],
          tld = nameWithTld.split('.')[1]

    let baseCost = null,
        floor = null,
        divisors = []        

    switch (tld) {
        case 'id':
            baseCost = 102400000
            floor = 25000
            divisors = [4, 4, 4, 4]
            break
        default:
            break
    }

    if (!baseCost || !floor || divisors.length === 0) {
        return 0
    }

    const lengthAdjustment = Math.pow(divisors[0], name.length-1),
          vowelAdjustment = (!/[aeiou]+/.test(name)) ? divisors[1] : 1,
          numericAdjustment = (/\d+/.test(name)) ? divisors[2] : 1,
          symbolicAdjustment = (/[_-]+/.test(name)) ? divisors[3] : 1
    const contentsAdjustment = Math.max(vowelAdjustment, numericAdjustment, symbolicAdjustment)

    let cost = baseCost / (lengthAdjustment*contentsAdjustment)

    if (cost < floor) {
        cost = floor
    }

    return cost
}
