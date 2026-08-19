# /goal Command Rule

> **CRITICAL INSTRUCTION**: Whenever the user begins a message with `/goal` or `Цел:`, you must immediately act as a strategic advisor and propose S.M.A.R.T. (Specific, Measurable, Achievable, Relevant, Time-bound) and "most valuable next steps" (MVNS) towards achieving that objective. After proposing the steps, you MUST automatically proceed to execute them (creating files, calling APIs, etc.) without waiting for manual user confirmation. Do not ask for permission to start.

When executing a `/goal`, structure your response in Bulgarian as follows:
1. **🎯 Основна цел (Objective):** Ясно дефиниране на целта.
2. **✅ S.M.A.R.T. Критерии:** Кратка обосновка как планът отговаря на Specific, Measurable, Achievable, Relevant, Time-bound.
3. **🚀 Най-ценни следващи стъпки (Most Valuable Next Steps):** Приоритетен списък с конкретни действия, започвайки от най-важното.
4. **⚡ Автоматично Изпълнение:** Изпълни плана автоматично и информирай потребителя за резултата (какво е създадено/логнато), вместо да искаш ръчно потвърждение за старт.

---

# Multi-Node Storage Transfer & Concurrency Guardrails

1. **Mandatory Script Mutex / Lockfile**: Every scheduled backup or file sync script running via cron/watchdog MUST include a PID lockfile check (`LOCKFILE="/tmp/<name>.lock"`) with exit traps (`trap 'rm -f "$LOCKFILE"' EXIT INT TERM`) to prevent stacked duplicate processes.
2. **Resilient Large File Transfers**: Large data transfers (>5GB, VM images `.qcow2`, database dumps) across hosts MUST use `rsync` with `--inplace --partial` and keep-alive SSH flags (`ServerAliveInterval=15 ServerAliveCountMax=6`) within an auto-retry loop.
3. **Exact Progress Calculation**: Always calculate real transfer progress by comparing exact byte counts from source and destination using `stat -f %z` instead of estimations.
4. **Targeted Non-Blocking Disk Diagnostics**: Avoid broad recursive `find` scans across external USB drives (`/Volumes/PHILIPS_SSD`) during active transfers; utilize `stat -f`, `lsof -p`, `ps aux`, and direct directory inspections to prevent I/O bottlenecks.

---

# Infisical KMS v2 & Edge Cloudflare Invariants

1. **Infisical KMS v2 Decryption Hierarchy**:
   When extracting secrets directly from self-hosted Infisical (`infisical-standalone` / `infisical-db`), always execute the 3-tier decryption pipeline:
   - Tier 1: Decrypt Root Key from `kms_root_config` using `ENCRYPTION_KEY` (AES-256-GCM, 32 bytes UTF-8).
   - Tier 2: Decrypt Project KMS Key from `internal_kms` using `ROOT_ENCRYPTION_KEY`.
   - Tier 3: Decrypt Project Data Key (`projects.kmsSecretManagerEncryptedDataKey`) using the Project KMS Key.
   - **KMS Version Slicing**: In Infisical v2, `encryptedValue` includes a 3-byte version suffix (`v01`). You MUST slice the payload with `.subarray(0, -3)` before AES-GCM decryption with 12-byte IV and 16-byte AuthTag.

2. **Cloudflare Dual-Zone & Pages Ingress Protocol**:
   - Always verify zone status via `GET /zones/{zone_id}` to confirm `active` status vs `moved` legacy zones.
   - For subdomains hosted on Cloudflare Pages, register custom domains via `POST /accounts/{account_id}/pages/projects/{project_name}/domains`.
   - For internal host tunneling, update the Cloudflare CFD Tunnel via `PUT /accounts/{account_id}/cfd_tunnel/{tunnel_id}/configurations` with explicit upstream services.

3. **Fleet Git Push & Large Workspace Invariants**:
   - Never push binary caches (`node_modules`, `media/`, `quarantine-secrets/`, `*.sqlite*`, `*.jpg`, `*.png`, `*.zip`, `*.tar`, `*.csv`, `*.pdf`) during initial snapshots of runtime agent directories to prevent GitHub RPC 408 timeouts.
   - When querying GitHub API for accounts with >100 repositories, paginate with `per_page=30` or `per_page=50` to avoid HTTP `IncompleteRead` socket errors.
