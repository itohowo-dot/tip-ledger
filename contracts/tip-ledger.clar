;; TipLedger - Decentralized Micro-Tipping Protocol on Stacks
;; Version: 1.0.0
;;
;; TipLedger is a decentralized micro-tipping protocol built on the Stacks blockchain.
;; It enables users to send STX tips with optional messages to creators, developers,
;; and contributors.
;;
;; The contract records all tipping activity on-chain, maintains transparent user
;; statistics, and collects a small platform fee for sustainability.
;;
;; Key Features:
;; - Send STX tips with messages
;; - Transparent on-chain tipping history
;; - User-level tipping analytics
;; - Protocol-level metrics tracking
;; - Automatic platform fee collection
;;
;; Protocol Metrics:
;; - Total tips sent
;; - Total transaction volume
;; - User tipping statistics
;; - Platform fee accumulation

;; ---------------------------------------------------------
;; Constants
;; ---------------------------------------------------------

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-invalid-amount (err u101))
(define-constant err-insufficient-balance (err u102))
(define-constant err-transfer-failed (err u103))
(define-constant err-not-found (err u104))

;; ---------------------------------------------------------
;; Fee Configuration
;; ---------------------------------------------------------

;; 0.5% platform fee (50 basis points)
(define-constant fee-basis-points u50)
(define-constant basis-points-divisor u10000)

;; ---------------------------------------------------------
;; Global State Variables
;; ---------------------------------------------------------

;; Total number of tips processed by TipLedger
(define-data-var total-tips-sent uint u0)

;; Total volume of STX tipped through the protocol
(define-data-var total-volume uint u0)

;; Total platform fees accumulated
(define-data-var platform-fees uint u0)

;; ---------------------------------------------------------
;; Data Maps
;; ---------------------------------------------------------

;; Ledger of all tips recorded on-chain
(define-map tips
    { tip-id: uint }
    {
        sender: principal,
        recipient: principal,
        amount: uint,
        message: (string-utf8 280),
        tip-height: uint
    }
)

;; User-level statistics tracking
(define-map user-tip-count principal uint)
(define-map user-received-count principal uint)
(define-map user-total-sent principal uint)
(define-map user-total-received principal uint)

;; ---------------------------------------------------------
;; Private Functions
;; ---------------------------------------------------------

;; Calculates the platform fee based on basis points
(define-private (calculate-fee (amount uint))
    (/ (* amount fee-basis-points) basis-points-divisor)
)

;; ---------------------------------------------------------
;; Public Functions
;; ---------------------------------------------------------

;; send-tip
;;
;; Sends a micro-tip in STX from the caller to a recipient.
;; Optionally includes a message.
;;
;; Behavior:
;; - Deducts a small platform fee (unless sender is contract owner)
;; - Transfers net amount to recipient
;; - Transfers fee to contract owner
;; - Records the tip in the TipLedger
;; - Updates user and global statistics
;;
;; Returns:
;; - (ok tip-id) on success
;; - error code on failure
(define-public (reward-tip (recipient principal) (amount uint) (message (string-utf8 280)))
    (let
        (
            (tip-id (var-get total-tips-sent))
            (fee (calculate-fee amount))
            (is-owner (is-eq tx-sender contract-owner))
            (net-amount (if is-owner amount (- amount fee)))

            ;; Load existing user stats
            (sender-sent (default-to u0 (map-get? user-total-sent tx-sender)))
            (recipient-received (default-to u0 (map-get? user-total-received recipient)))
            (sender-count (default-to u0 (map-get? user-tip-count tx-sender)))
            (recipient-count (default-to u0 (map-get? user-received-count recipient)))
        )

        ;; -------------------------
        ;; Validation
        ;; -------------------------
        (asserts! (> amount u0) err-invalid-amount)
        (asserts! (not (is-eq tx-sender recipient)) err-invalid-amount)