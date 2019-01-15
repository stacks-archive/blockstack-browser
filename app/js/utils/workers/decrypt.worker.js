import * as decryptMain from './decrypt.main'

export async function decrypt(hexEncryptedKey, password) {
    return decryptMain.decrypt(hexEncryptedKey, password)
}