;;; heady.el --- Heady AI assistant for Emacs -*- lexical-binding: t; -*-

;; Author: HeadySystems
;; Version: 0.1.0
;; Package-Requires: ((emacs "27.1") (request "0.3.3") (markdown-mode "2.6"))
;; URL: https://github.com/HeadySystems/Heady
;; Keywords: ai, tools, convenience

;;; Commentary:
;; Heady Dev Companion for Emacs — chat, explain, refactor, generate tests/docs.
;; Connects to HeadyManager API (local, hybrid, or cloud).

;;; Code:

(require 'request)
(require 'json)

(defgroup heady nil
  "Heady AI Assistant settings."
  :group 'tools
  :prefix "heady-")

(defcustom heady-api-endpoint "http://localhost:3300"
  "Heady API endpoint URL."
  :type 'string :group 'heady)

(defcustom heady-mode "hybrid"
  "AI processing mode: local, hybrid, or cloud."
  :type '(choice (const "local") (const "hybrid") (const "cloud")) :group 'heady)

(defcustom heady-token nil
  "API token for authentication."
  :type '(choice (const nil) string) :group 'heady)

(defun heady--chat (message context callback)
  "Send MESSAGE with CONTEXT to Heady API, call CALLBACK with reply."
  (request (concat heady-api-endpoint "/api/buddy/chat")
    :type "POST"
    :headers `(("Content-Type" . "application/json")
               ,@(when heady-token `(("Authorization" . ,(concat "Bearer " heady-token)))))
    :data (json-encode `(("message" . ,message)
                         ("context" . ,(concat "emacs_" context))
                         ("source" . "ide-emacs")
                         ("mode" . ,heady-mode)))
    :parser 'json-read
    :success (cl-function
              (lambda (&key data &allow-other-keys)
                (let ((reply (or (alist-get 'reply data) (alist-get 'message data) "No response")))
                  (funcall callback reply))))
    :error (cl-function
            (lambda (&key error-thrown &allow-other-keys)
              (funcall callback (format "Error: %s" error-thrown))))))

(defun heady--show-response (reply)
  "Display REPLY in a Heady output buffer."
  (with-current-buffer (get-buffer-create "*Heady*")
    (goto-char (point-max))
    (insert "\n--- Heady ---\n" reply "\n")
    (display-buffer (current-buffer))))

(defun heady-chat (message)
  "Send MESSAGE to Heady and show response."
  (interactive "sAsk Heady: ")
  (heady--chat message "chat" #'heady--show-response))

(defun heady-explain-region (start end)
  "Explain selected code between START and END."
  (interactive "r")
  (let ((code (buffer-substring-no-properties start end)))
    (heady--chat (format "Explain this code:\n```\n%s\n```" code) "explain" #'heady--show-response)))

(defun heady-refactor-region (start end)
  "Suggest refactoring for selected code between START and END."
  (interactive "r")
  (let ((code (buffer-substring-no-properties start end)))
    (heady--chat (format "Refactor this code:\n```\n%s\n```" code) "refactor" #'heady--show-response)))

(defun heady-generate-tests ()
  "Generate tests for the current buffer."
  (interactive)
  (let ((code (buffer-substring-no-properties (point-min) (min (point-max) 8000))))
    (heady--chat (format "Generate tests for:\n```%s\n%s\n```" (or (file-name-extension (buffer-file-name)) "") code) "tests" #'heady--show-response)))

(defun heady-generate-docs ()
  "Generate documentation for the current buffer or selection."
  (interactive)
  (let ((code (if (use-region-p)
                  (buffer-substring-no-properties (region-beginning) (region-end))
                (buffer-substring-no-properties (point-min) (min (point-max) 8000)))))
    (heady--chat (format "Generate documentation:\n```\n%s\n```" code) "docs" #'heady--show-response)))

(defun heady-health-check ()
  "Check if HeadyManager is reachable."
  (interactive)
  (request (concat heady-api-endpoint "/api/health")
    :parser 'json-read
    :success (cl-function (lambda (&rest _) (message "Heady: Connected")))
    :error (cl-function (lambda (&rest _) (message "Heady: Offline")))))

(provide 'heady)
;;; heady.el ends here
