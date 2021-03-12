---
'@stacks/wallet-web': minor
---

Seed input fixes:
- A user can now paste in any combination of string and numbers and hopefully get a correct phrase out.
- The input for the seed phrase is now the perfect height to not scroll when someone enters in a 12 or 24 word phrase
- Hitting return/enter will submit the form
- Pasting in a magic recovery code will get validated. Previously we were just checking to see if it was 1 word.

Password entry fixes:
- Now debounced and does not blur the input when validation occurs, fixes #942
- improved the error message to be less dynamic with a sane, static, suggestion, resolves #1031
