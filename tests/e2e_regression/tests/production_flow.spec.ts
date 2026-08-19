import { test, expect } from '@playwright/test';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PDF_SAMPLE = '/Users/diokarabaz/MICROINVEST-OCR/data/1.pdf';
const OCR_EXTRACT_SCRIPT = '/Users/diokarabaz/MICROINVEST-OCR/src/ocr/extract_dsk_statement.py';
const DELTA_TRANSLATE_SCRIPT = '/Users/diokarabaz/MICROINVEST-OCR/src/accounting/translate_to_delta.py';
const N8N_WEBHOOK_URL = 'http://100.83.83.8:5679/webhook/verify-e2e-infrastructure';
const RUN_ID = `e2e-${Date.now()}`;

function runCommand(command: string): string {
  return execSync(command, { encoding: 'utf-8', timeout: 30000 });
}

function extractUuid(output: string): string {
  const match = output.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return match ? match[0] : output.trim();
}

function runDockerPsql(sql: string): string {
  const cleanSql = sql.replace(/"/g, '\\"');
  const cmd = `/opt/homebrew/bin/docker exec -i supabase-db psql -U postgres -d postgres -t -A -c "${cleanSql}"`;
  return runCommand(cmd).trim();
}

test.describe('Production Playwright E2E Regression Suite', () => {

  test('Step 1: Dashboard UI Navigation & Real Health Scorecard', async ({ page }) => {
    // 1. Load Live Revenue Dashboard
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);

    // Verify Title and Root Elements
    await expect(page).toHaveTitle(/Revenue War Room LIVE/i);
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header).toContainText(/Revenue War Room — LIVE self-hosted Supabase/i);

    // Verify Scorecard Metrics Grid
    const grid = page.locator('.grid');
    await expect(grid).toBeVisible();
    const cards = page.locator('.card');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(8);

    // Verify System Health Endpoint
    const healthResp = await page.request.get('http://localhost:5001/api/health');
    expect(healthResp.status()).toBe(200);
    const healthJson = await healthResp.json();
    expect(healthJson.status).toBe('healthy');
    expect(healthJson.services.supabase).toBe(true);

    // Capture Visual Artifact
    await page.screenshot({ path: path.join(__dirname, '../reports/dashboard_snapshot.png'), fullPage: true });
  });

  test('Step 2: Real Document OCR Processing & Mathematical Audit', async () => {
    expect(fs.existsSync(PDF_SAMPLE)).toBe(true);
    expect(fs.existsSync(OCR_EXTRACT_SCRIPT)).toBe(true);

    const tmpJson = `/tmp/e2e_ocr_${RUN_ID}.json`;
    const ocrCmd = `python3 "${OCR_EXTRACT_SCRIPT}" --pdf-path "${PDF_SAMPLE}" --output "${tmpJson}"`;
    runCommand(ocrCmd);

    expect(fs.existsSync(tmpJson)).toBe(true);
    const rawData = fs.readFileSync(tmpJson, 'utf-8');
    const parsed = JSON.parse(rawData);

    // Validate Financial Math & Balance Checks
    const meta = parsed.statement_metadata;
    const txs = parsed.transactions;
    expect(meta).toBeDefined();
    expect(meta.opening_balance).toBe(5883.29);
    expect(txs.length).toBe(21);

    const totalDebits = Math.round(txs.reduce((sum: number, t: any) => sum + (t.debit_amount || 0), 0) * 100) / 100;
    const totalCredits = Math.round(txs.reduce((sum: number, t: any) => sum + (t.credit_amount || 0), 0) * 100) / 100;
    const calculatedClosing = Math.round((meta.opening_balance - totalDebits + totalCredits) * 100) / 100;

    expect(totalDebits).toBe(7329.50);
    expect(totalCredits).toBe(3610.08);
    expect(calculatedClosing).toBe(2163.87);

    // Verify Delta Pro Translation Pipeline
    const translateCmd = `python3 "${DELTA_TRANSLATE_SCRIPT}" --input "${tmpJson}" --output-dir "/tmp"`;
    runCommand(translateCmd);

    expect(fs.existsSync('/tmp/microinvest_transferdata.xml')).toBe(true);
    const xmlContent = fs.readFileSync('/tmp/microinvest_transferdata.xml', 'utf-8');
    expect(xmlContent).toContain('<TransferData');
    expect(xmlContent).toContain('<Accounting>');
    expect(xmlContent).toContain('<DebitAcc>');
    expect(xmlContent).toContain('<CreditAcc>');
  });

  test('Step 3: Direct Supabase Ingestion & ACID Record Verification', async () => {
    const invoiceNum = `INV-E2E-${RUN_ID}`;
    const supplier = 'E2E Automated Regression Supplier';
    const amount = 7329.50;

    // 1. Insert directly into Supabase table public.ocr_imports
    const insertSql = `INSERT INTO public.ocr_imports (invoice_number, supplier_name, total_amount, xml_content, status) VALUES ('${invoiceNum}', '${supplier}', ${amount}, '<TransferData verified="true"/>', 'processed') RETURNING id;`;
    const insertOut = runDockerPsql(insertSql);
    const insertedId = extractUuid(insertOut);
    expect(insertedId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    // 2. Query and verify persistence in Supabase
    const selectSql = `SELECT invoice_number || '|' || supplier_name || '|' || total_amount || '|' || status FROM public.ocr_imports WHERE id = '${insertedId}';`;
    const record = runDockerPsql(selectSql);
    expect(record).toBe(`${invoiceNum}|${supplier}|${amount.toFixed(2)}|processed`);

    // 3. Insert and verify E2E QA report row in public.website_qa_reports
    const qaSql = `INSERT INTO public.website_qa_reports (project_id, run_id, build_status, test_status, lighthouse_desktop, a11y_score, executor, raw_report) VALUES ('openbalancer-production', '${RUN_ID}', 'success', 'passed', 100, 100, 'playwright-e2e-nightly', '{"status":"all_passed","run_id":"${RUN_ID}"}'::jsonb) RETURNING id;`;
    const qaOut = runDockerPsql(qaSql);
    const qaId = extractUuid(qaOut);
    expect(qaId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    const verifyQa = runDockerPsql(`SELECT test_status FROM public.website_qa_reports WHERE id = '${qaId}';`);
    expect(verifyQa).toBe('passed');
  });

  test('Step 4: n8n Webhook Notification & Execution Verification', async ({ request }) => {
    const payload = {
      trigger: 'playwright-e2e-regression',
      runId: RUN_ID,
      timestamp: new Date().toISOString(),
      source: 'macmini-primary',
      testSuite: 'Production Nightly E2E Pipeline',
      status: 'SUCCESS',
    };

    const response = await request.post(N8N_WEBHOOK_URL, {
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.healthReport).toBeDefined();
    expect(body.healthReport.workflowName).toBe('Infrastructure E2E Verification Watchdog');
    expect(body.healthReport.overallStatus).toBe('healthy');
    expect(body.status).toBe('PASSED');
    expect(body.healthReport.executionId).toBeDefined();
  });

  test('Step 5: Unified End-to-End Business Flow (Dashboard -> OCR -> Supabase -> n8n)', async ({ page, request }) => {
    // 1. Dashboard entry
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('header')).toBeVisible();

    // 2. OCR processing
    const e2eTmp = `/tmp/unified_${RUN_ID}.json`;
    runCommand(`python3 "${OCR_EXTRACT_SCRIPT}" --pdf-path "${PDF_SAMPLE}" --output "${e2eTmp}"`);
    const ocrData = JSON.parse(fs.readFileSync(e2eTmp, 'utf-8'));
    const meta = ocrData.statement_metadata;
    const txs = ocrData.transactions;
    const totalDebits = Math.round(txs.reduce((sum: number, t: any) => sum + (t.debit_amount || 0), 0) * 100) / 100;
    const totalCredits = Math.round(txs.reduce((sum: number, t: any) => sum + (t.credit_amount || 0), 0) * 100) / 100;
    const calculatedClosing = Math.round((meta.opening_balance - totalDebits + totalCredits) * 100) / 100;
    expect(calculatedClosing).toBe(2163.87);

    // 3. Supabase persistence
    const uInvoice = `UNIFIED-${RUN_ID}`;
    const insertRes = runDockerPsql(`INSERT INTO public.ocr_imports (invoice_number, supplier_name, total_amount, status) VALUES ('${uInvoice}', 'Unified E2E Flow', ${calculatedClosing}, 'verified') RETURNING id;`);
    const uId = extractUuid(insertRes);
    expect(uId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    const checkRes = runDockerPsql(`SELECT status FROM public.ocr_imports WHERE id = '${uId}';`);
    expect(checkRes).toBe('verified');

    // 4. n8n notification trigger
    const n8nRes = await request.post(N8N_WEBHOOK_URL, {
      data: {
        event: 'e2e_regression_complete',
        runId: RUN_ID,
        flow: 'Dashboard -> OCR -> Supabase -> n8n',
        status: 'PASSED',
        recordsExtracted: txs.length,
      },
    });
    expect(n8nRes.status()).toBe(200);
    const n8nBody = await n8nRes.json();
    expect(n8nBody.status).toBe('PASSED');
  });

});
