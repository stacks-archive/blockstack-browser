// flow-typed signature: 913cd1fe8b8709db7b5516a3bbe10908
// flow-typed version: 7c8526fa76/currency-formatter_v1.x.x/flow_>=v0.25.x

/**
 * Shared interfaces between the modules 'currency-formatter' and
 * 'currency-formatter/currencies'
 */
declare type $npm$currencyFormatter$Currency = {
  code: string,
  decimalDigits: number,
  decimalSeparator: string,
  spaceBetweenAmountAndSymbol: boolean,
  symbol: string,
  symbolOnLeft: boolean,
  thousandsSeparator: string,
};

declare module 'currency-formatter' {
  declare type FormatOptions = {
    code?: string,
    decimal?: string,
    format?: string | {
      neg: string,
      pos: string,
      zero: string,
    },
    precision?: number,
    symbol?: string,
    thousand?: string,
  };

  declare var currencies: Array<$npm$currencyFormatter$Currency>;
  declare function format(amount: number, currency: FormatOptions): string;
  declare function findCurrency(code: string): ?$npm$currencyFormatter$Currency;
}

declare module 'currency-formatter/currencies' {
  declare module.exports: Array<$npm$currencyFormatter$Currency>;
}
