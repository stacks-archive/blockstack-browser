import { FinishedTxPayload } from './transactions';

export interface StacksProvider {
  /** @deprecated */
  getURL: () => Promise<string>;
  /**
   * Make a transaction request
   *
   * @param payload - a JSON web token representing a transaction request
   */
  transactionRequest(payload: string): Promise<FinishedTxPayload>;
  /**
   * Make an authentication request
   *
   * @param payload - a JSON web token representing an auth request
   *
   * @returns an authResponse string in the form of a JSON web token
   */
  authenticationRequest(payload: string): Promise<string>;
  getProductInfo:
    | undefined
    | (() => {
        version: string;
        name: string;
        meta?: {
          tag?: string;
          commit?: string;
          [key: string]: any;
        };
        [key: string]: any;
      });
}

export type BlockstackProvider = StacksProvider;

declare global {
  interface Window {
    BlockstackProvider?: BlockstackProvider;
    StacksProvider?: StacksProvider;
  }
}
