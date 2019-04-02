
export async function isCryptoInWorkerSupported() {
    const supported = global.crypto && global.crypto.getRandomValues
    return (!!supported).toString()
}