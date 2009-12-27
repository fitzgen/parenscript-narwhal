;; Disable debugger
(setf *invoke-debugger-hook*
      (lambda (condition hook)
        (declare (ignore hook))
        ;; Uncomment to get backtraces on errors
        ;; (sb-debug:backtrace 20)
        (format *error-output* "~%~%; Error: ~A~%" condition)
        (quit)))

;; Redirect the require messages to stderr.
(let ((*standard-output* *error-output*))
  (require :parenscript))

(defun join (strings &optional (joiner " "))
  "Join a list of strings together with the ``joiner``."
  (reduce #'(lambda (x y) (concatenate 'string x joiner y))
          strings))

(defun main ()
  (destructuring-bind (flag &rest args) (cdr *posix-argv*)
    (write-line (cond
                  ((string= "--stdin" flag)
                   (ps:ps-compile-stream *standard-input*))
                  ((string= "--file" flag)
                   (ps:ps-compile-file (first args)))
                  ((string= "--eval" flag)
                   (with-input-from-string (stream (first args))
                                           (ps:ps-compile-stream stream)))
                  (t (error "Must pass '--stdin', '--eval' or '--file' flag."))))))

(main)