// TypeScript port of https://github.com/DavidWells/safe-await/

// Native Error types https://mzl.la/2Veh3TR
const nativeExceptions = [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,
].filter(except => typeof except === 'function');

function throwNative(error: Error) {
  for (const Exception of nativeExceptions) {
    if (error instanceof Exception) throw error;
  }
}

export function safeAwait<T>(promise: Promise<T>, finallyFn?: () => void) {
  return promise
    .then(data => {
      if (data instanceof Error) {
        throwNative(data);
        return [data] as readonly [Error];
      }
      return [undefined, data] as const;
    })
    .catch((error: Error) => {
      throwNative(error);
      return [error] as const;
    })
    .finally(() => {
      if (finallyFn) finallyFn();
    });
}
