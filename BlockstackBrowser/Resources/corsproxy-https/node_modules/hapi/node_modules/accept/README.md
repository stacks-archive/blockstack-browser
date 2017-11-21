#Accept

HTTP Accept-* headers parsing.

[![Build Status](https://secure.travis-ci.org/hapijs/accept.png)](http://travis-ci.org/hapijs/accept)

Lead Maintainer - [Mark Bradshaw](https://github.com/mark-bradshaw)

## Table of Contents

- [Introduction](#introduction)
- [Usage](#usage)
    - [`charset(charsetHeader, [preferences])`](#charsetcharsetheader-preferences)
    - [`charsets(charsetHeader)`](#charsetscharsetheader)
    - [`encoding(encodingHeader, [preferences])`](#encodingencodingheader-preferences)
    - [`encodings(encodingHeader)`](#encodingsencodingheader)
- [Q Weightings](#q-weightings)
- [Encodings](#encodings)
    - [Preferences](#preferences)
    - [Identity](#identity)

## Introduction

Accept helps to answer the question of how best to respond to a HTTP request, based on the requesting browser's capabilities.  Accept will parse the headers of a HTTP request and tell you what the preferred encoding is and what charsets are accepted.

Additional details about Accept headers and content negotiation can be found in [IETF RFC 7231, Section 5.3](https://tools.ietf.org/html/rfc7231#section-5.3).

## Usage

### `charset(charsetHeader, [preferences])`

Given a string of acceptable charsets from a HTTP request Accept-Charset header, and an optional array of charset preferences, it will return a string indicating the best charset option that can be used in the HTTP response.  This takes into account any weighting parameters given in the header for ordering and exclusion.

```
var charset = Accept.charsets("iso-8859-5, unicode-1-1;q=0.8"); // charset === "iso-8859-5"
var charset = Accept.charsets("iso-8859-5, unicode-1-1;q=0.8", ["unicode-1-1"]); // charset === "unicode-1-1"
```

### `charsets(charsetHeader)`

Given a string of acceptable charsets from a HTTP request Accept-Charset header it will return an array of strings indicating the possible charset options that can be used in the HTTP response, in order from most preferred to least as determined by the [q weightings](#weightings)

```
var charsets = Accept.charsets("iso-8859-5, unicode-1-1;q=0.8"); // charsets === ["iso-8859-5", "unicode-1-1"]
var charsets = Accept.charsets("iso-8859-5;q=0.5, unicode-1-1;q=0.8"); // charsets === ["unicode-1-1", "iso-8859-5"]
```

### `encoding(encodingHeader, [preferences])`

Given a string of acceptable encodings from a HTTP request Accept-Encoding header, and optionally an array of preferences, it will return a string with the best fit encoding that should be used in the HTTP response.  If no preferences array parameter is given the highest weighted or first ordered encoding is returned.  If weightings are given in the header (using the q parameter) they are taken into account and the highest weighted match is returned.  If a preferences array is given the best match from the array is returned.  For more information about how the preferences array works see the section below on [Preferences](#preferences).

```
var encoding = Accept.encoding("gzip, deflate, sdch"); // encoding === "gzip"
var encoding = Accept.encoding("gzip, deflate, sdch", ["deflate", "identity"]); // encoding === "delate"
```

### `encodings(encodingHeader)`

Given a string of acceptable encodings from a HTTP request Accept-Encoding header it will return an array of strings indicating the possible encoding options that can be used in the HTTP response, in order from most preferred to least as determined by the [q weightings](#weightings)

```
var encodings = Accept.encodings("compress;q=0.5, gzip;q=1.0"); // encodings === ["gzip", "compress", "identity"]
```


## Q Weightings

The Accept-* headers may optionally include preferential weighting to indicate which options are best for the requester.  It does this with `q` parameters in the headers (which stands for quality).  These q weightings must be in the range of 0 to 1, with a max of three decimal places.  The weightings are used to order the data given in the header, with the highest number being most preferential.  Anything with a q rating of 0 is not allowed at all.

If a particular Accept method allows a `preferences` array parameter, such as `encoding()`, the weightings in the header affect which preference will be returned.  Your preferences are matched with the weighting in mind, and the highest weighted option will be returned, no matter what order you list your preferences.  The header weighting is most important.

```
var encoding = Accept.encoding("gzip;q=1.0, identity;q=0.5", ["identity", "gzip"]);
// encoding === "gzip"
// despite identity getting listed first in the preferences array, gzip has a higher q weighting, so it is returned.
```


## Encodings

### Preferences

If you are looking for a set of specific encodings you can pass that in as an array to the `preferences` parameter.  Your preferences **must** be an array.  In the preferences array you specify a list of possible encodings you want to look for, in order of preference.  Accept will return back the most preferential option it can find, if any match.

```
var encoding = Accept.encoding("gzip, deflate, sdch", ["deflate", "identity"]); // encoding === "delate"
```

Your preferences are evaluated without any case sensitivity, to better match what the browser sends.  This means that "gZip" will match a preference of ["gzip"].

```
var encoding = Accept.encoding("gZip, deflate, sdch", ["gzip"]); // encoding === "gzip"
```

If you supply a preferences array, and no match is found, `encoding()` will return an empty string, rather than an encoding from the header.

```
var encoding = Accept.encoding("gZip", ["deflate"]); // encoding === ""
```

If the encoding header is the special "*" that indicates the browser will accept any encoding.  In that case the top preference from your supplied options will be returned.

```
var encoding = Accept.encoding("*", ["gzip"]); // encoding === "gzip"
```


### Identity

When you ask Accept for a list of all the supported encodings from the request, using the `encodings()` function (plural, not singular), you will be returned an array of strings in order from most preferred to least as determined by the encoding weight.

```
var encodings = Accept.encodings("compress;q=0.5, gzip;q=1.0"); // encodings === ["gzip", "compress", "identity"]
```

You'll notice that `identity` was returned in the array, even though it's not in the encoding header.  Identity is always an option for encoding, unless specifically excluded in the header using a weighting of zero.  Identity just means respond with no special encoding.
