interface Hash {
  update(data: string | Buffer): Hash
  digest(encoding: string): string
}

declare module 'crypto-browserify' {
  export function randomBytes(size: number): Buffer
  export function pbkdf2Sync(password: string, salt: Buffer, iterations: number, keylen: number, digest: string): Buffer
  export function createCipheriv(algorithm: string, key: string | Buffer, iv: string | Buffer)
  export function createHmac(algorithm: string, key: string | Buffer)
  export function createHash(algorithm: string): Hash
}
