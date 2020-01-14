export interface BlockstackProvider {
  getURL: () => Promise<string>;
}

declare global {
  interface Window {
    BlockstackProvider?: BlockstackProvider;
  }
}
