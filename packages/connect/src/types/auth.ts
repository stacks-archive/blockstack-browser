import type { UserSession } from '@stacks/auth';

export interface FinishedData {
  authResponse: string;
  userSession: UserSession;
}

export interface AuthOptions {
  /** The URL you want the user to be redirected to after authentication. */
  redirectTo?: string;
  manifestPath?: string;
  /** @deprecated use `onFinish` */
  finished?: (payload: FinishedData) => void;
  /**
   * This callback is fired after authentication is finished.
   * The callback is called with a single object argument, with two keys:
   * `userSession`: a UserSession object with `userData` included
   * `authResponse`: the raw `authResponse` string that is returned from authentication
   * */
  onFinish?: (payload: FinishedData) => void;
  /** This callback is fired if the user exits before finishing */
  onCancel?: (error?: Error) => void;
  /**
   * @deprecated Authentication is no longer supported through a hosted
   * version. Users must install an extension.
   */
  authOrigin?: string;
  /** If `sendToSignIn` is `true`, then the user will be sent through the sign in flow. */
  sendToSignIn?: boolean;
  userSession?: UserSession;
  appDetails: {
    /** A human-readable name for your application */
    name: string;
    /** A full URL that resolves to an image icon for your application */
    icon: string;
  };
}
