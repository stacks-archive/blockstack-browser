export interface StacksProvider {
  getURL: () => Promise<string>;
}

export type BlockstackProvider = StacksProvider;

declare global {
  interface Window {
    BlockstackProvider?: BlockstackProvider;
    StacksProvider?: StacksProvider;
  }
}
