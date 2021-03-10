;; A component with a function that accepts all argument types.
;; Use for testing.

(define-public 
  (rawr 
    (arg-uint uint)
    (arg-int int)
    (arg-buff (buff 20))
    (arg-string-ascii (string-ascii 20))
    (arg-string-utf8 (string-utf8 20))
    (arg-principal principal)
    (arg-bool bool)
  )
  (ok u0)
)
