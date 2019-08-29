declare module 'bs58check' {
  export function encode(buf: Buffer): string
  export function decode(str: string): Buffer

  export default {
    encode,
    decode
  }
}
