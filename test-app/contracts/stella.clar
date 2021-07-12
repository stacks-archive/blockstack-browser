(impl-trait 'STR8P3RD1EHA8AA37ERSSSZSWKS9T2GYQFGXNA4C.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token stella-token)

;; get the token balance of owner
(define-read-only (get-balance (owner principal))
  (begin
    (ok (ft-get-balance stella-token owner))))

;; returns the total number of tokens
(define-read-only (get-total-supply)
  (ok (ft-get-supply stella-token)))

;; returns the token name
(define-read-only (get-name)
  (ok "SteLLa the Cat"))

;; the symbol or "ticker" for this token
(define-read-only (get-symbol)
  (ok "CAT"))

;; the number of decimals used
(define-read-only (get-decimals)
  (ok u9)) ;; 9 lives

;; Transfers tokens to a recipient
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (if (is-eq tx-sender sender)
    (begin
      (try! (ft-transfer? stella-token amount sender recipient))
      (print memo)
      (ok true)
    )
    (err u4)))

(define-public (get-token-uri)
  (ok (some u"https://example.com")))

(define-public (faucet)
  (ok (ft-mint? stella-token u12345678 tx-sender))
)
