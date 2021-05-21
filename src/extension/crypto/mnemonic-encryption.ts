import { decrypt, encrypt } from '@stacks/wallet-sdk';
import { generateEncryptionKey } from './generate-encryption-key';
import { generateRandomHexString } from './generate-random-hex';

interface EncryptMnemonicArgs {
  secretKey: string;
  password: string;
}
export async function encryptMnemonic({ secretKey, password }: EncryptMnemonicArgs) {
  const salt = generateRandomHexString();
  const argonHash = await generateEncryptionKey({ password, salt });
  const encryptedBuffer = await encrypt(secretKey, argonHash);
  return {
    salt,
    encryptedSecretKey: encryptedBuffer.toString('hex'),
  };
}

/**
 * Decrypt an encrypted secret key. If no salt is present, then this encrypted key was
 * generated before introducing Argon2 hashing. If that is true, then
 * decrypt the secret key and re-encrypt it using an Argon2 hashed password.
 */
interface DecryptionMnemonic {
  encryptedSecretKey: string;
  password: string;
  salt?: string;
}
export async function decryptMnemonic({
  encryptedSecretKey,
  password,
  salt,
}: DecryptionMnemonic): Promise<{
  encryptedSecretKey: string;
  salt: string;
  secretKey: string;
}> {
  if (salt) {
    const pw = await generateEncryptionKey({ password, salt });
    const secretKey = await decrypt(Buffer.from(encryptedSecretKey, 'hex'), pw);
    return {
      secretKey,
      encryptedSecretKey,
      salt,
    };
  } else {
    // if there is no salt, decrypt the secret key, then re-encrypt with an argon2 hash
    const secretKey = await decrypt(Buffer.from(encryptedSecretKey, 'hex'), password);
    const newEncryptedKey = await encryptMnemonic({ secretKey, password });
    return {
      secretKey,
      encryptedSecretKey: newEncryptedKey.encryptedSecretKey,
      salt: newEncryptedKey.salt,
    };
  }
}
