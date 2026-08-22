---
name: microinvest-delta-import-audit
description: >-
  Autonomous E2E bank statement translation, Mod 11 EIK verification, Microinvest Delta Pro
  TransferData XML payload generation, zero-discrepancy double-entry auditing, and MS SQL / Access import.
---

# Microinvest Delta Pro FinTech Automation & Audit Guide

## 1. Input Validation & Modulo 11 EIK Checksum
When processing Bulgarian bank statement logs (`TRANSFER.LOG`, CP1251/Windows-1251):
1. **Encoding Integrity**: Decode using strict `cp1251` or `windows-1251`. Validate that all Cyrillic strings (counterparty, narrative) contain zero `\ufffd` or `????`.
2. **Modulo 11 Checksum Verification**:
   - **Pass 1**: Multiply the first 8 digits by weights `[1, 2, 3, 4, 5, 6, 7, 8]`. Compute remainder `% 11`. If remainder < 10, compare directly with the 9th digit.
   - **Pass 2 (Fallback)**: If remainder == 10, multiply by weights `[3, 4, 5, 6, 7, 8, 9, 10]`. Compute remainder `% 11`. If remainder < 10, compare with the 9th digit; if 10, the check digit must be 0.

## 2. Microinvest `urn:Transfer` XML Specification
Root element `<TransferData xmlns="urn:Transfer">` containing:
- `<Header>`: `<CompanyEIK>`, `<CompanyIBAN>`, `<PeriodStart>`, `<PeriodEnd>`, `<CreatedDate>`, `<TotalRecords>`, `<TotalAmount>`, `<Currency>`.
- `<Operations>`: Series of `<Operation>` elements (`ItemNo`, `DocType`, `DocNum`, `DocDate`, `Date`, `Counterparty`, `DebitAcc`, `CreditAcc`, `Amount`, `Currency`, `Description`, `DedupHash`).
- `<Accountings>`: Double-entry reflection `<Accounting>` (`ItemNo`, `PostingDate`, `DocNum`, `DebitAcc`, `CreditAcc`, `Amount`, `Currency`, `Narrative`, `DedupHash`).

## 3. Financial Invariant & Trial Balance Audit
1. **Zero Disbalance Invariant**: Verify that `Sum(Debit) - Sum(Credit) == 0.00 BGN`.
2. **Standard Account Mapping**:
   - `503/1`: Primary Bank Settlement Account (BGN / EUR)
   - `401/*`: Suppliers & Commercial Vendors
   - `411/*`: Customers & Trade Receivables
   - `454`: Personal Income Tax (DDFL)
   - `455`: Social Security & Health Contributions (DOO, DZPO, Health)
   - `621`: Bank Fees, Commissions & Account Service Charges
   - `602`: Rent & External Subcontractor Expenses
3. **Audit Artifact Generation**: Always generate:
   - `TRANSFER_LOG_AUDIT.json`: Structured machine-readable report with cryptographic SHA-256 and MD5 hashes.
   - `TRANSFER_LOG_AUDIT.log`: Complete 346-line double-entry audit trail.
   - `TRANSFER_LOG_AUDIT.md`: Formatted executive financial turnover summary.
