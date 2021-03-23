const hiroHeaders: HeadersInit = {
  'x-hiro-product': 'stacks-wallet-web',
  'x-hiro-version': VERSION,
};

export function fetcher(input: RequestInfo, init: RequestInit = {}) {
  const initHeaders = init.headers || {};
  return fetch(input, { ...init, headers: { ...initHeaders, ...hiroHeaders } });
}
