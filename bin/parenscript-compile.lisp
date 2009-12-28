;; Redirect the require messages to stderr.
(let ((*standard-output* *error-output*))
  (require :parenscript))

(defun main ()
  (write-line (ps:ps-compile-stream *standard-input*)))

(main)
(quit)