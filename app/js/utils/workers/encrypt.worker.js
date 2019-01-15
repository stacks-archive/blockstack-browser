import * as encryptMain from './encrypt.main'

export async function encrypt(mnemonic, password) {
    return encryptMain.encrypt(mnemonic, password)
}