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