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

## 4. Ordinance H-12 (Наредба Н-12) & NRA VAT Monthly Triplet
When generating Bulgarian National Revenue Agency (НАП) statutory filing files:
1. **File Triplet**:
   - `DEKLAR.TXT`: VAT return declaration containing Cell 01-01, Cell 11 (20% base), Cell 21 (20% VAT), Cell 31 (purchases base), Cell 41 (VAT credit), Cell 50 (VAT payable), Cell 60 (VAT refundable), Cell 70 (effective tax).
   - `POKUPKI.TXT`: Purchases ledger with validated supplier UIC/BULSTAT (Mod 11), document type, dates, tax bases, and credit classification (`FULL`, `NONE`, `PARTIAL`).
   - `PRODAGBI.TXT`: Sales ledger with validated client UIC/BULSTAT, tax base classifications, and rates.
2. **Encoding & Line Endings**: Strictly use `windows-1251` (CP1251) binary encoding without UTF-8 BOM, and `\r\n` (CRLF) line endings.
3. **3-Way Mathematical Equality**:
   - `Sum(PRODAGBI.VAT) - Sum(POKUPKI.VAT) == DEKLAR.Cell50` (if payable) or `DEKLAR.Cell60` (if refundable). Discrepancy must be `0.00 BGN`.

## 5. Commercial Register GFO XML Specification (`urn:bg:registryagency:gfo:v1`)
1. **Root Element**: `<GFOReport xmlns="urn:bg:registryagency:gfo:v1">` with `<Header>`, `<Company>`, `<BalanceSheet>`, and `<IncomeStatement>`.
2. **Statutory Invariant**: `BalanceSheet.TotalAssets == BalanceSheet.TotalLiabilitiesAndEquity` (zero balance difference).
3. **Income Statement Tie-in**: `IncomeStatement.NetProfitLoss == BalanceSheet.LiabilitiesAndEquity.CurrentYearNetResult` (Account 123).
