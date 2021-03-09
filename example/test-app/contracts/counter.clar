(define-data-var counter int 0)

(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) 1))
    (print "+1")
    (ok (var-get counter))))

(define-public (decrement)
  (begin
    (var-set counter (- (var-get counter) 1))
    (print "-1")
    (ok (var-get counter))))

(define-read-only (get-counter)
  (var-get counter))
