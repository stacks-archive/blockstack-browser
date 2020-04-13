export type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicAttributes {
      css?: any;
    }
  }
}
