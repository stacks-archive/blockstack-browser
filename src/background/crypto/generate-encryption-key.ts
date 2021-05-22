import argon2, { ArgonType } from 'argon2-browser';

interface GenerateEncryptionKeyArgs {
  password: string;
  salt: string;
}
export async function generateEncryptionKey({ password, salt }: GenerateEncryptionKeyArgs) {
  const argonHash = await argon2.hash({
    pass: password,
    salt,
    hashLen: 48,
    time: 44,
    mem: 1024 * 32,
    type: ArgonType.Argon2id,
  });
  return argonHash.hashHex;
}
