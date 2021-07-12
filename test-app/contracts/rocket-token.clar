(impl-trait 'ST2PABAF9FTAJYNFZH93XENAJ8FVY99RRM4DF2YCW.sip-10-ft-standard.ft-trait)

;;;; Rocket-Token

(define-fungible-token rocket-token)

(define-constant err-min-transfer u10)

(define-public (get-total-supply)
  (ok (ft-get-supply rocket-token))
)

(define-read-only (get-balance (account principal))
  (ok
    (ft-get-balance rocket-token account)
  )
)

(define-read-only (get-decimals) (ok u0))

(define-read-only (get-name) (ok "Rocket Token"))

(define-read-only (get-symbol) (ok "RKT"))

(define-read-only (get-token-uri) (ok none))

(define-public (transfer (amount uint) (sender principal) (receiver principal))
  (begin
    (if (> amount u0)
      (match (ft-transfer? rocket-token amount sender receiver)
        success (ok success)
        error (err (+ err-min-transfer error)))
      (err err-min-transfer)
    )
  )
)

(define-public (buy (amount uint))
  (match (stx-burn? amount tx-sender)
    success (ft-mint? rocket-token amount tx-sender)
    error (err error)))

;; Initialize the contract
(ft-mint? rocket-token u20 'ST33GW755MQQP6FZ58S423JJ23GBKK5ZKH3MGR55N) ;; alice
(ft-mint? rocket-token u10 'ST33GW755MQQP6FZ58S423JJ23GBKK5ZKH3MGR55N) ;; bob
