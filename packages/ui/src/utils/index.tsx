import React from 'react';

let _window: Window | undefined = undefined;

// Note: Accessing "window" in IE11 is somewhat expensive, and calling "typeof window"
// hits a memory leak, whereas aliasing it and calling "typeof _window" does not.
// Caching the window value at the file scope lets us minimize the impact.
try {
  _window = window;
} catch (e) {
  /* no-op */
}

/**
 * Helper to get the window object. The helper will make sure to use a cached variable
 * of "window", to avoid overhead and memory leaks in IE11.
 */
export function getWindow(node?: HTMLElement | null): Window | undefined {
  return node?.ownerDocument?.defaultView ?? _window;
}

/**
 * Check if we can use the DOM. Useful for SSR purposes
 */
function checkIsBrowser() {
  const _window = getWindow();
  return Boolean(
    // eslint-disable-next-line @typescript-eslint/unbound-method
    typeof _window !== 'undefined' && _window.document && _window.document.createElement
  );
}

export const isBrowser = checkIsBrowser();

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export interface CreateContextOptions {
  /**
   * If `true`, React will throw if context is `null` or `undefined`
   * In some cases, you might want to support nested context, so you can set it to `false`
   */
  strict?: boolean;
  /**
   * Error message to throw if the context is `undefined`
   */
  errorMessage?: string;
  /**
   * The display name of the context
   */
  name?: string;
}

type CreateContextReturn<T> = [React.Provider<T>, () => T, React.Context<T>];

/**
 * Creates a named context, provider, and hook.
 *
 * @param options create context options
 */
export function createContext<ContextType>(options: CreateContextOptions = {}) {
  const {
    strict = true,
    errorMessage = 'useContext must be inside a Provider with a value',
    name,
  } = options;

  const Context = React.createContext<ContextType | undefined>(undefined);

  Context.displayName = name;

  function useContext() {
    const context = React.useContext(Context);
    if (!context && strict) throw new Error(errorMessage);
    return context;
  }

  return [Context.Provider, useContext, Context] as CreateContextReturn<ContextType>;
}

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
export function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(child =>
    React.isValidElement(child)
  ) as React.ReactElement[];
}

type ReactRef<T> = React.Ref<T> | React.RefObject<T> | React.MutableRefObject<T>;

/**
 * Assigns a value to a ref function or object
 *
 * @param ref the ref to assign to
 * @param value the value
 */
export function assignRef<T = any>(ref: ReactRef<T> | undefined, value: T) {
  if (ref == null) return;

  if (isFunction(ref)) {
    ref(value);
    return;
  }

  try {
    (ref as React.MutableRefObject<T>).current = value;
  } catch (error) {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}

/**
 * Combine multiple React refs into a single ref function.
 * This is used mostly when you need to allow consumers forward refs to
 * internal components
 *
 * @param refs refs to assign to value to
 */
export function mergeRefs<T>(...refs: (ReactRef<T> | undefined)[]) {
  return (value: T) => {
    refs.forEach(ref => assignRef(ref, value));
  };
}

export function genId(prefix: string) {
  return `${prefix}-${Math.random().toString(32).substr(2, 8)}`;
}

export const makeId = (id: string, index: number) => `${id}:${index}`;

const focusableElList = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'embed',
  'iframe',
  'input:not([disabled])',
  'object',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '*[tabindex]:not([aria-disabled])',
  '*[contenteditable]',
];

const focusableElSelector = focusableElList.join();

export function getFocusables(element: HTMLElement, keyboardOnly = false) {
  let focusableEls = Array.from(element.querySelectorAll(focusableElSelector));

  // filter out elements with display: none
  focusableEls = focusableEls.filter(
    focusableEl => window.getComputedStyle(focusableEl).display !== 'none'
  );

  if (keyboardOnly) {
    focusableEls = focusableEls.filter(
      focusableEl => focusableEl.getAttribute('tabindex') !== '-1'
    );
  }

  return focusableEls;
}

/// Evaluate color in theme object

const colorKeyInTheme = (theme: any, color: string) => color in theme.colors;

const colorHueValue = (theme: any, color: string) => {
  const hasDot = color.search('.') !== -1;
  if (hasDot) {
    const [colorName, hue] = color.split('.');

    if (colorKeyInTheme(theme, colorName)) {
      return theme.colors[colorName][hue];
    }
  }
  return null;
};

export const getColorInTheme = (theme: any, color: string) => {
  if (colorKeyInTheme(theme, color)) {
    return theme.colors[color][500];
  }

  if (colorHueValue(theme, color)) {
    return colorHueValue(theme, color);
  }

  return color;
};

export const __DEV__ = process.env.NODE_ENV !== 'production';

export function runIfFn<T, U>(valueOrFn: T | ((...args: U[]) => T), ...args: U[]): T {
  return isFunction(valueOrFn) ? valueOrFn(...args) : valueOrFn;
}

export function warn(options: { condition: boolean; message: string }) {
  if (options.condition && __DEV__) {
    console.warn(options.message);
  }
}

export function error(options: { condition: boolean; message: string }) {
  if (options.condition && __DEV__) {
    console.error(options.message);
  }
}

export type FunctionArguments<T extends Function> = T extends (...args: infer R) => any ? R : never;

export function callAllHandlers<T extends (event: any) => void>(...fns: (T | undefined)[]) {
  return function (event: FunctionArguments<T>[0]) {
    fns.some(fn => {
      fn && fn(event);
      return event && event.defaultPrevented;
    });
  };
}

export type Merge<T1, T2> = Omit<T1, Extract<keyof T1, keyof T2>> & T2;

export type SafeMerge<T, P> = P & Omit<T, keyof P>;

export type UnionStringArray<T extends Readonly<string[]>> = T[number];

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type As<P = any> = React.ReactType<P>;

export type AnyFunction<T = any> = (...args: T[]) => any;

export type Dict<T = any> = Record<string, T>;

export type ReactNodeOrRenderProp<P> = React.ReactNode | ((props: P) => React.ReactNode);

export type Booleanish = boolean | 'true' | 'false';

export type ObjectOrArray<T, K extends keyof any = keyof any> = T[] | Record<K, T>;

export type StringOrNumber = string | number;

// Number assertions
export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export const isNotNumber = (value: any) =>
  typeof value !== 'number' || isNaN(value) || !isFinite(value);

export function isNumeric(value: any) {
  return value != null && value - parseFloat(value) + 1 >= 0;
}

// Array assertions
export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}

export const isEmptyArray = (value: any) => isArray(value) && value.length === 0;

// Generic assertions
export const isDefined = (value: any) => typeof value !== 'undefined' && value !== undefined;

export const isUndefined = (value: any): value is undefined =>
  typeof value === 'undefined' || value === undefined;

// Object assertions
export const isObject = (value: any): value is Dict => {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function') && !isArray(value);
};

export const isEmptyObject = (value: any) => isObject(value) && Object.keys(value).length === 0;

export const isNull = (value: any): value is null => value == null;

// String assertions
export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === '[object String]';
}

// Empty assertions
export const isEmpty = (value: any) => {
  if (isArray(value)) return isEmptyArray(value);
  if (isObject(value)) return isEmptyObject(value);
  return value == null || value === '';
};

export function omit<T extends Dict, K extends keyof T>(object: T, keys: K[]) {
  const result: Dict = {};

  for (const key in object) {
    if (keys.includes(key as any)) continue;
    result[key] = object[key];
  }

  return result as Omit<T, K>;
}

export function pick<T extends Dict, K extends keyof T>(object: T, keys: K[]) {
  const result = {} as { [P in K]: T[P] };
  for (const key of keys) {
    if (key in object) {
      result[key] = object[key];
    }
  }
  return result;
}

export function split<T extends Dict, K extends keyof T>(object: T, keys: K[]) {
  const picked: Dict = {};
  const omitted: Dict = {};

  for (const key in object) {
    if (keys.includes(key as T[K])) {
      picked[key] = object[key];
    } else {
      omitted[key] = object[key];
    }
  }

  return [picked, omitted] as [{ [P in K]: T[P] }, Omit<T, K>];
}

/**
 * Get value from a deeply nested object using a string path
 * @param obj - the object
 * @param path - the string path
 * @param fallback
 * @param index
 */
export function get(obj: any, path: string | number, fallback?: any, index?: number) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //@ts-ignore
  // eslint-disable-next-line no-param-reassign
  path = (path?.split?.('.') ?? [path]) as string;
  // eslint-disable-next-line no-param-reassign
  for (index = 0; index < path.length; index++) {
    // eslint-disable-next-line no-param-reassign
    obj = obj ? obj[path[index]] : undefined;
  }
  return obj === undefined ? fallback : obj;
}

/**
 * Get value from deeply nested object, based on path
 * It returns the path value if not found in object
 *
 * @param path - the string path or value
 * @param scale - the string path or value
 */
export function getWithDefault(path: any, scale: any) {
  return get(scale, path, path);
}

export function mapResponsive(prop: any, mapper: (val: any) => any) {
  if (isArray(prop)) {
    return prop.map(mapper);
  }

  if (isObject(prop)) {
    return Object.keys(prop).reduce((result: Dict, key) => {
      result[key] = mapper(prop[key]);
      return result;
    }, {});
  }

  if (prop != null) {
    return mapper(prop);
  }

  return null;
}

export const startPad = (n: number, z = 2, s = '0') =>
  (n + '').length <= z ? ['', '-'][+(n < 0)] + (s.repeat(z) + Math.abs(n)).slice(-1 * z) : n + '';
