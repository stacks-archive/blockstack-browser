(define-map statuses
  (
    (author principal)
  )
  (
    (status (buff 512))
  )
)

(define-read-only (get-status (author principal))
  (begin
    (print author)
    (default-to ""
      (get status (map-get? statuses {author: author}))
    )
  )
)

(define-public (write-status!
    (status (buff 512))
  )
  (begin
    (print tx-sender)
    (print status)
    (map-set statuses
      ((author tx-sender))
      ((status status))
    )
    (ok status)
  )
)
