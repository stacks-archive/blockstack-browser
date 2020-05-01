// @ts-nocheck
import Prism from 'prismjs';

(function (Prism) {
  // Functions to construct regular expressions
  // simple form
  // e.g. (interactive ... or (interactive)
  function simple_form(name) {
    return RegExp('(\\()' + name + '(?=[\\s\\)])');
  }
  // booleans and numbers
  function primitive(pattern) {
    return RegExp('([\\s([])' + pattern + '(?=[\\s)])');
  }

  // Patterns in regular expressions

  // & and : are excluded as they are usually used for special purposes
  const symbol = '[-+*/_~!@$%^=<>{}\\w]+';
  // symbol starting with & used in function arguments
  const marker = '&' + symbol;
  // Open parenthesis for look-behind
  const par = '(\\()';
  const endpar = '(?=\\))';
  // End the pattern with look-ahead space
  const space = '(?=\\s)';

  const language = {
    // Three or four semicolons are considered a heading.
    heading: {
      pattern: /;;;.*/,
      alias: ['comment', 'title'],
    },
    comment: /;.*/,
    string: [
      {
        pattern: /"(?:[^"\\]|\\.)*"/,
        greedy: true,
        inside: {
          argument: /[-A-Z]+(?=[.,\s])/,
          symbol: RegExp('`' + symbol + "'"),
        },
      },
      {
        pattern: /0x[0-9a-fA-F]*/,
        greedy: true,
        inside: {
          argument: /[-A-Z]+(?=[.,\s])/,
          symbol: RegExp('`' + symbol + "'"),
        },
      },
    ],
    'quoted-symbol': {
      pattern: RegExp("#?'" + symbol),
      alias: ['variable', 'symbol'],
    },
    'lisp-property': {
      pattern: RegExp(':' + symbol),
      alias: 'property',
    },
    splice: {
      pattern: RegExp(',@?' + symbol),
      alias: ['symbol', 'variable'],
    },
    keyword: [
      {
        pattern: RegExp(
          par +
            `(?:or|and|xor|not|begin|let|if|ok|err|unwrap\\!|unwrap-err\\!|unwrap-panic|unwrap-err-panic|match|try\\!|asserts\\!|\
map-get\\?|var-get|contract-map-get\\?|get|tuple|\
define-public|define-private|define-constant|define-map|define-data-var|\
define-fungible-token|define-non-fungible-token|\
define-read-only)` +
            space
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(par + '(?:is-eq|is-some|is-none|is-ok|is-er)' + space),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          par +
            `(?:var-set|map-set|map-delete|map-insert|\
ft-transfer\\?|nft-transfer\\?|nft-mint\\?|ft-mint\\?|nft-get-owner\\?|ft-get-balance\\?|\
contract-call\\?)` +
            space
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          par +
            `(?:list|map|filter|fold|len|concat|append|as-max-len\\?|to-int|to-uint|\
buff|hash160|sha256|sha512|sha512/256|keccak256|true|false|none)` +
            space
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          par +
            '(?:as-contract|contract-caller|tx-sender|block-height|at-block|get-block-info\\?)' +
            space
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(par + '(?:is-eq|is-some|is-none|is-ok|is-err)' + space),
        lookbehind: true,
      },
    ],
    declare: {
      pattern: simple_form('declare'),
      lookbehind: true,
      alias: 'keyword',
    },
    interactive: {
      pattern: simple_form('interactive'),
      lookbehind: true,
      alias: 'keyword',
    },
    boolean: {
      pattern: RegExp(par + '(?:true|false|none)' + space),
      lookbehind: true,
    },
    number: {
      pattern: primitive('[-+]?u?\\d+(?:\\.\\d*)?'),
      lookbehind: true,
    },
    defvar: {
      pattern: RegExp(par + '(?:let)\\s+' + symbol),
      lookbehind: true,
      inside: {
        keyword: /^def[a-z]+/,
        variable: RegExp(symbol),
      },
    },
    defun: {
      pattern: RegExp(par + '(?:defun\\*?|defmacro)\\s+' + symbol + '\\s+\\([\\s\\S]*?\\)'),
      lookbehind: true,
      inside: {
        keyword: /^(?:cl-)?def\S+/,
        // See below, this property needs to be defined later so that it can
        // reference the language object.
        arguments: null,
        function: {
          pattern: RegExp('(^\\s)' + symbol),
          lookbehind: true,
        },
        punctuation: /[()]/,
      },
    },
    lambda: {
      pattern: RegExp(par + 'lambda\\s+\\((?:&?' + symbol + '\\s*)*\\)'),
      lookbehind: true,
      inside: {
        keyword: /^lambda/,
        // See below, this property needs to be defined later so that it can
        // reference the language object.
        arguments: null,
        punctuation: /[()]/,
      },
    },
    car: {
      pattern: RegExp(par + symbol),
      lookbehind: true,
    },
    punctuation: [
      // open paren, brackets, and close paren
      /(?:['`,]?\(|[)\[\]])/,
      // cons
      {
        pattern: /(\s)\.(?=\s)/,
        lookbehind: true,
      },
    ],
  };

  const arg = {
    'lisp-marker': RegExp(marker),
    rest: {
      argument: {
        pattern: RegExp(symbol),
        alias: 'variable',
      },
      varform: {
        pattern: RegExp(par + symbol + '\\s+\\S[\\s\\S]*' + endpar),
        lookbehind: true,
        inside: {
          string: language.string,
          boolean: language.boolean,
          number: language.number,
          symbol: language.symbol,
          punctuation: /[()]/,
        },
      },
    },
  };

  const forms = '\\S+(?:\\s+\\S+)*';

  const arglist = {
    pattern: RegExp(par + '[\\s\\S]*' + endpar),
    lookbehind: true,
    inside: {
      'rest-vars': {
        pattern: RegExp('&(?:rest|body)\\s+' + forms),
        inside: arg,
      },
      'other-marker-vars': {
        pattern: RegExp('&(?:optional|aux)\\s+' + forms),
        inside: arg,
      },
      keys: {
        pattern: RegExp('&key\\s+' + forms + '(?:\\s+&allow-other-keys)?'),
        inside: arg,
      },
      argument: {
        pattern: RegExp(symbol),
        alias: 'variable',
      },
      punctuation: /[()]/,
    },
  };

  language['lambda'].inside.arguments = arglist;
  language['defun'].inside.arguments = Prism.util.clone(arglist);
  language['defun'].inside.arguments.inside.sublist = arglist;

  Prism.languages.clarity = language;
})(Prism);
