const hiroHeaders: HeadersInit = {
  'x-hiro-product': 'stacks-wallet-web',
  'x-hiro-version': VERSION,
};

export function fetcher(input: RequestInfo, init: RequestInit = {}) {
  const initHeaders = init.headers || {};
  return fetch(input, {
    credentials: 'omit',
    ...init,
    headers: { ...initHeaders, ...hiroHeaders },
  });
}
