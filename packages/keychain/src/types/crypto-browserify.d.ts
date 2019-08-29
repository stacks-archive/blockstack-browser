interface Hash {
  update(data: string | Buffer): Hash
  digest(encoding: string): string
}

interface Cipher {
  update(data: string | Buffer, inputEncoding: string, outputEncoding: string): string
  final(outputEncoding: string): string
}

interface Hmac {
  write(data: string | Buffer): Hmac
  digest(encoding: string): string
  digest(): Buffer
}

declare module 'crypto-browserify' {
  export function randomBytes(size: number): Buffer
  export function pbkdf2Sync(password: string, salt: Buffer, iterations: number, keylen: number, digest: string): Buffer
  export function createCipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer): Cipher
  export function createHmac(algorithm: string, key: string | Buffer): Hmac
  export function createHash(algorithm: string): Hash
}
