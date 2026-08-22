# Gemini Workspace Context: OpenClaw Ecosystem & Open Balancer

This workspace serves as the command center for the **OpenClaw** multi-agent ecosystem and the **Open Balancer** automation platform. It spans local development environments ("dios-macbook-air", "Leon") and cloud infrastructure (VPS).

## ⚡ Operational Invariants
- **Synchronous Command Execution**: Set `WaitMsBeforeAsync: 10000` on `run_command` calls to ensure synchronous execution and prevent background task spinners.
- **Open Balancer Rebranding**: Always refer to the primary automation platform as **Open Balancer** (`cashflow.openbalancer.com` & `n8n.openbalancer.com`).
- **VPS Infrastructure DEPRECATED**: All external cloud VPS instances (Hostinger `srv1201204.hstgr.cloud`, `72.61.154.188`, etc.) are **100% DEPRECATED and DECOMMISSIONED**. NEVER attempt remote SSH, watchdog scripts, or deployments to external VPS hosts. All services, Docker containers, n8n, Supabase, and Cloudflare Tunnels run strictly on local machines (`dios-macbook-air`, `macmini-primary` `100.83.83.8`, `macmini-secondary` `100.70.181.127`). Backups are sourced exclusively from local records or `/Volumes/PHILIPS_SSD/`.
- **GitHub Auth Fallback**: If `gh repo create` or GitHub CLI hits rate limits, fallback directly to HTTPS token repository URLs (`https://$GITHUB_TOKEN@github.com/...`).
- **Self-Hosted Firecrawl**: Always use self-hosted Firecrawl on `macmini-primary` (`http://100.83.83.8:3002`) via `FIRECRAWL_API_URL` and `FIRECRAWL_API_KEY` for web scraping, crawling, and extraction.
- **Language Preference**: Communicate strictly in Bulgarian using single, concise sentences for key points.
- **Disk & Data Safety Invariants**: 
  - NEVER use `docker system prune --volumes` (preserves DBs).
  - NEVER delete `~/.colima` directory (hosts Docker Engine).
  - Use `brctl evict` for clearing iCloud local space (`Library/Mobile Documents`), never `rm`.
  - Delete local repos/data on primary ONLY if explicitly verified as backed up on `macmini-secondary` (PHILIPS_SSD) or GitHub.
- **SSH User for Secondary Node**: The user on `macmini-secondary` (`100.70.181.127` / PHILIPS_SSD) is strictly **`diokarabaz2`** (`diokarabaz2@100.70.181.127`). NEVER attempt `diokarabaz@100.70.181.127`.
- **Frontend CSP & Self-Hosted Assets**: NEVER rely on external runtime CDN scripts (`cdn.tailwindcss.com`, `unpkg.com`) for production pages. All assets must be self-hosted in `website/css/` & `website/js/` (or compiled via Vite in `dist/`) to comply with strict `Content-Security-Policy: default-src 'self'`. All SVG brand logos must have hardcoded dimensions (`.brand-logo-img { width: 36px !important; height: 36px !important; }`).
- **Critical Dark Base Styles (FOUC & Contrast Prevention)**: Every production HTML page MUST include inline `<style>:root { color-scheme: dark; } html, body { background-color: #080c14 !important; color: #f8fafc !important; } .brand-logo-img, img[src*="logo.svg"] { width: 36px !important; height: 36px !important; } .mobile-drawer { display: none; } .mobile-drawer.active { display: flex !important; }</style>` in `<head>` to prevent white-on-white unstyled flashes, preflight resets, and SVG explosions.
- **Cloudflare Pages & DNS Invariant**: The live DNS zone for `openbalancer.com` (`f88038d999ebcad660655dc522c58851`) is in Account `1128cf4fabd61e53dfca004865925597` targeting Pages project **`finansprotect-org-openbalanc`** (`finansprotect-org-openbalanc.pages.dev`). Deployments MUST be pushed to `finansprotect-org-openbalanc` (Account `1128cf4fabd6...`) and mirrored to `openbalancer` (Account `7979c4fd...`). DNS CNAME records for `openbalancer.com`, `www`, `dashboard`, and `cashflow` must target `finansprotect-org-openbalanc.pages.dev`. Cloudflare Tunnel (`cloudflared`) in Docker must run with `--net=host` to reach Colima services on `127.0.0.1:<port>`. Hostnames served via Cloudflare Pages MUST NOT be listed in Cloudflare Tunnel ingress configurations to prevent edge routing conflicts.
- **Wrangler Pages Deploy Invariant**: Always execute `wrangler pages deploy` specifying the absolute directory path and run from `/tmp` (or a directory without a conflicting root `wrangler.toml` with `build` config) to prevent configuration validation failures.
- **Cloudflare Account & Secrets Origin**: Cloudflare tokens, zones, and DNS secrets originate from the Infisical project **`Hosting & Domains`** on `macmini-primary` (`100.83.83.8`) for official incontrolplus operations. Use `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_DNS_TOKEN` for Account `1128cf4fabd61e53dfca004865925597` and secondary token for Account `7979c4fdc70fa11c48ac5bf469386145`. NEVER use legacy accounts (`petkaskoka@gmail.com`) or secrets outside `Hosting & Domains`.
- **Bulgarian Cyrillic Parsing & OCR Invariants**:
  - Never use ASCII `\b` (word boundary) on Cyrillic strings in JavaScript RegExp. Always use Unicode property escapes `(?:\b|[^\p{L}\p{N}])` with the `u` flag.
  - Extract EIK via Bulgarian Commercial Register Mod 11 checksum scanning over all 9-digit candidates, regardless of OCR label corruption (e.g. `ETHEMK:` -> `ЕИК`).
  - Differentiate bank statements from invoices to suppress false line-item generation from ledger turnovers.
  - Always serve Tesseract browser models with `gzip: true` and `Content-Type: application/octet-stream`.
- **QEMU & qemu-img External Disk Invariant (PHILIPS_SSD / NFS)**: When managing QEMU virtual machines or disk images on `/Volumes/PHILIPS_SSD/` (NFS/ExFAT layer), macOS does not support POSIX byte-locking. ALWAYS specify `file.locking=off` in `-drive` parameters, `-U` for `qemu-img info`, and `--image-opts "file.filename=...,file.locking=off"` for `qemu-img check -r all`. When creating new QCOW2 images, initialize the header on APFS (`/tmp/`) and move to the target volume to bypass `Failed to lock byte 101: Operation not supported` errors.
- **Gatekeeper Quarantine & Headless Agent Invariant**: macOS automatically marks downloaded binaries, tools, and scripts with `com.apple.quarantine`, causing headless CLI agents, cron jobs, and background workers to hang waiting for UI approval. All agent environments, tool installations, and scripts in `~/.local/bin`, `~/Developer`, `~/orca/projects`, `~/.openclaw`, and `~/.agents` MUST have quarantine attributes stripped recursively (`find ... -maxdepth 4 -exec xattr -d com.apple.quarantine {} + 2>/dev/null || true`). The background daemon `nosync-guard.sh` enforces this every 30 minutes across the mesh.
- **SSOT Archive & Local Disk Conservation Invariant**: The local laptop storage (256 GB) MUST NOT store redundant historical snapshots, legacy backups, or duplicate monorepos. The 50 remote repositories in the GitHub **`incontrolplus`** organization and `/Volumes/PHILIPS_SSD/` on `macmini-secondary` serve as the permanent SSOT archives. The local machine hosts strictly active workspaces (`~/orca/projects/`, `~/Wallestars`, `~/Developer`, `Obsidian Vault`).
- **LaunchAgent nosync-guard Invariant**: `com.openbalancer.nosync-guard.plist` runs automatically every 1800 seconds (30 minutes) via Launchd, converting nested `node_modules` into `node_modules.nosync` with symlinks in tracked iCloud/Documents/Desktop paths and stripping `com.apple.quarantine` attributes across developer directories.
- **Windows VM & Web VNC Port Invariant**: The Windows 11 VM on `macmini-secondary` runs under QEMU with VNC on `127.0.0.1:5901` bridged to `0.0.0.0:8006` via `websockify` (`--web /Users/diokarabaz2/novnc`). `novnc-proxy` on `macmini-primary` reverse-proxies port 8006 for `win.openbalancer.com`.
- **Docker Single-File Mount Pre-check**: When managing containers with single-file volume bind mounts (e.g., `novnc_nginx.conf`), ensure the host file exists before container restarts to prevent Docker from creating a directory placeholder.
- **UI/UX Development Philosophy**: Do not "write raw code manually" or "act like a programmer" for UI. Strictly use ready-made libraries (framer-motion, Tailwind), Dribbble bento-box layouts, and official high-quality product CDN images. Focus on integration and smooth transitions over custom building.
- **Multi-Subdomain Isolation & Role Separation Invariant**: In Cloudflare Pages (`finansprotect-org-openbalanc` / `_worker.js`), each subdomain must have a strictly dedicated, isolated static target (`dashboard.` -> `/dashboard.html` for SSOT Cluster Mesh Monitor, `cashflow.` -> `/cashflow.html` for Wallestars React SPA, `n8n.` -> `/n8n.html`, `infisical.` -> `/infisical.html`, `hermes.` -> `/hermes.html`, `admin.` -> `/admin.html`, `win.` -> `/win.html`, `mcp.` -> `/mcp.html`, `tailscale.` -> `/tailscale.html`). NEVER allow ad-hoc changes or deployments to overwrite or couple distinct subdomain views.
- **Production Bundle vs Dev Source Invariant**: NEVER reference uncompiled dev source files (`/src/main.tsx`, `.ts`, `.tsx`) in production HTML pages deployed to Cloudflare Pages. Always execute `npm run build` first and ensure production entry points reference pre-compiled, hashed assets in `/assets/` (`/assets/index-*.js`, `/assets/index-*.css`).
- **Private Network Access (PNA) & Mixed Content Edge Routing Invariant**: Public HTTPS domains (`https://*.openbalancer.com`) CANNOT make direct unencrypted or cross-origin requests to local private IPs (`http://100.83.83.8:*`) due to browser Private Network Access and Mixed Content security policies. All real-time telemetry and API queries needed by client SPAs must be proxied or served through Cloudflare Edge Worker API endpoints (e.g. `/api/revenue`, `/api/health`) with resilient initial state fallbacks to prevent white screens or failed loads.
- **Full 10-Subdomain Playwright Verification Invariant**: Following any Cloudflare Pages deployment or `_worker.js` update, NEVER verify only the single target subdomain in isolation. Always execute the automated comprehensive Playwright verification suite across all 10 subdomains to guarantee zero cross-subdomain regressions, 0 white screens, 0 fatal console errors, and 100% HTTP 200 uptime.
- **Canonical incontrolplus SSOT & Skills Mirroring Invariant**: The single source of truth (SSOT) for all core web platform code is strictly **`incontrolplus/openbalancer-dashboard`**, for Windows VM automation is **`incontrolplus/portable-windows-11-qemu`**, and for all reusable agent skills (`~/.agents/skills/`) is **`incontrolplus/antigravity-custom-skills`**. All new features, multi-page modules, or custom skills MUST be committed and synchronized directly to these canonical repositories.
- **Crash-Proof React Context & Hook Invariant**: All shared React context providers (`SocketContext`, `AuthContext`, `ThemeContext`) and custom hooks must provide resilient, fallback safe states (`connected: true/false`, graceful null-safe stubs) and NEVER throw uncaught fatal errors when background socket daemons or external auth sessions are disconnected or unreachable. This guarantees zero white-screens and 100% initial render uptime on public edge deployments.
- **Dashboard & Cashflow Role Alignment & Zero Bundle Drift Invariant**: **`dashboard.openbalancer.com`** serves as the primary master operations SSOT hub (hosting the 10-Node Cluster Mesh Monitor and the full 45-module Finans Protect Suite), while **`cashflow.openbalancer.com`** acts as the dedicated B2B card issuing and cashflow gateway. Production deployments MUST deploy identical, compiled master bundles from **`incontrolplus/openbalancer-dashboard`** to both `dashboard.html` and `cashflow.html` simultaneously to eliminate state and bundle drift across the ecosystem.
- **Liquid Glass & Explicit High-Contrast Input Invariant**: In all dark-mode and bento-box layouts, form inputs (<input>, <textarea>, <select>) must NEVER rely on implicit or undeclared background classes. They MUST explicitly declare a deep glass background (`bg-[#090f1d]/90` or `bg-[#0b1222]`), high-contrast text (`text-white font-medium`), distinct placeholder (`placeholder-slate-500`), and liquid glass frosted borders with cyan focus rings (`border-white/10 hover:border-cyan-500/40 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15`). Containers must use crystal glassmorphism (`backdrop-blur-2xl`, `bg-gradient-to-br from-white/[0.06] to-white/[0.01]`, `border border-white/10`) to eliminate white-on-white text rendering bugs.
- **Bulgarian Commercial Register Beneficial Owner & Eligibility Invariant**: When querying business registries by physical person names (First, Middle, Last), queries must resolve to companies where the individual is registered as the beneficial owner, manager, or shareholder (`действителен собственик / съдружник / управител`), displaying their explicit ownership share percentage (>= 50% for Wallester eligibility) and official role, rather than matching strings against company names. All returned EIKs must pass the Bulgarian Commercial Register Mod 11 checksum algorithm.
- **Infisical Self-Hosted KMS & Secret Decryption Invariant**: In self-hosted Infisical on `macmini-primary` (`infisical-db` / `infisical-standalone`), `secrets_v2.encryptedValue` and `projects.kmsSecretManagerEncryptedDataKey` include a 3-byte KMS version tag at the end. Decryption using AES-256-GCM must always strip the last 3 bytes (`subarray(0, -3)`) and follow the 2-tier KMS derivation chain (`ENCRYPTION_KEY` -> `ROOT_ENCRYPTION_KEY` -> `projectKmsKey` -> `secretDataKey` -> `secret`).
- **CompanyBook Official REST API & Dual-Engine Fallback Invariant**: Production CompanyBook API keys originate from the Infisical project **`CompanyBook API`** (`COMPANYBOOK_API_KEY_BRATESH08_EOOD`). All queries to `https://api.companybook.bg/api/` must include the header `X-API-Key`. All edge proxy services (`companybook_proxy`, `registry_check`, and `server/index.js`) must prioritize the official REST API with automatic seamless fallback to self-hosted Firecrawl on `http://100.83.83.8:3002` and Supabase PostgreSQL caching (`verified_owners`, `user_registry_checks`). Eligibility/ownership lookups MUST use exclusively `/api/people/search?name=X&with_data=true` (person search) — NEVER `/api/v2/companies/search?name=X` (company name search), as the latter returns companies whose names contain the query words, not companies owned by the person. CompanyBook's people search returns fuzzy/partial name matches, so a **mandatory post-filter** must normalize (`toUpperCase()`, collapse whitespace, trim) and compare each `result.name` against the exact searched full name, skipping (`continue`) any non-exact match. The `with_data=true` parameter is required to obtain `personCompanies[].roles[]` (e.g. `SoleCapitalOwner`, `PhysicalPersonTrader`, `Partner`, `Managers`, `BoardMember`) and `legalForm` for accurate ownership share derivation.
- **NRA VAT Triplet & CP1251 Encoding Invariant**: When generating Bulgarian National Revenue Agency (НАП) files (`DEKLAR.TXT`, `POKUPKI.TXT`, `PRODAGBI.TXT`), strictly enforce `windows-1251` (CP1251) byte encoding without UTF-8 BOM, `\r\n` (CRLF) line endings, and exact mathematical equality between sales/purchases ledgers and declaration cells (`Sum(PRODAGBI.VAT) - Sum(POKUPKI.VAT) == DEKLAR.Cell50/Cell60`).
- **Commercial Register GFO XML Invariant**: Annual Financial Statements exported for the Commercial Register must strictly comply with `urn:bg:registryagency:gfo:v1`, maintaining zero balance difference between total assets and total equity/liabilities, with net result reconciled against Account 123.
- **Playwright Accessible Name vs Inner Text Selection Invariant**: When writing Playwright tests against buttons with explicit `aria-label` or accessible names, use `page.locator('button:has-text(...)')` or match the exact `aria-label` value in `getByRole('button', { name: ... })` to prevent 30-second locator timeouts.
- **Pytest Multi-Project Rootpath Invariant**: Always provide `pytest.ini` with `pythonpath = .` in root workspace directories to enable synchronous unit test execution without requiring manual `PYTHONPATH` environment exports.

## 📂 Key Directories & Projects

### 1. `~/Wallestars` (Core Automation Platform — Open Balancer)
The primary codebase for bot infrastructure and automation workflows.
*   **Tech Stack:** JavaScript/TypeScript, Vite, Tailwind CSS, Supabase, Netlify.
*   **Key Components:**
    *   `n8n/`: Workflow definitions (19 active workflows including "Wallester Registration Agent").
    *   `scripts/`: Automation and deployment scripts (`health-check.sh`, `deploy-local.sh`).
    *   `src/`: Application source code.
*   **Documentation:** See `README.md`, `DEPLOYMENT_README.md`, and `AUTOMATION_STATUS.md` within the directory.

### 2. `~/.openclaw` (Agent Configuration)
Configuration and data storage for the OpenClaw agent.
*   **Files:** `openclaw.json` (agent config), `.env` (API keys/secrets).
*   **Logs:** Contains operational logs for the agent's activities.

### 3. `~/OpenClaw-Hub`
Repository for high-level agent prompts (e.g., `Airtop Prompts`) and structural notes.

## 🏗️ Infrastructure Overview

### Cloud (VPS) — DEPRECATED
*   **Host:** `srv1201204.hstgr.cloud` / `72.61.154.188`
*   **Status:** **DEPRECATED & DECOMMISSIONED** (No remote access, replaced by `macmini-primary` Tailscale mesh).

### Local Machines & Tailscale Mesh
*   **"macmini-primary" / "Leon" (Remote):** Mac Mini M4 (`100.83.83.8` via Tailscale) — Primary DevOps & Docker Machine (Hosts n8n, Supabase, Infisical, Cloudflare Production Tunnel, Self-hosted Firecrawl, Finans Protect).
*   **"dios-macbook-air" (Current):** MacBook Air M4 (Primary Agent Machine). Hosts CLI client, WebChat UI, and Wallestars Express server (Port 3500).
*   **"macmini-secondary" / "Leon2":** Mac Mini (`100.70.181.127` via Tailscale).

## 🚀 Key Workflows & Commands

### OpenClaw CLI
*   **Onboard/Install:** `openclaw onboard --install-daemon`
*   **Start Gateway:** `openclaw gateway --port 18789`
*   **Agent Interaction:** `openclaw agent --message "..."`

### Wallestars Deployment
*   **Deploy:** `./deploy-vps.sh` (from `~/Wallestars`)
*   **Health Check:** `./health-check.sh`

## ⚠️ Pending Tasks & Security (Phase 2)
Refer to `PHASE1-VERIFICATION-REPORT.md` for details.
1.  **VPS Security:** Remove UFW rule for port 5678 (allow localhost only).
2.  **SSH Hardening:** Disable `PermitRootLogin`.
3.  **Verification:** Confirm status of "Leon" (Mac Mini).

## 📝 Notes
*   **Context:** `chat-notes.md` contains details on Chrome integration (`claude --chrome`) and system extensions.
*   **Setup:** `openclaw-setup-notes.md` details token configuration and multi-device setup.

---

## 🧭 Navigation Protocol — How to Find the Right Files

When given a task, follow this decision tree **before taking any action**:

### Step 1: Identify Task Category

| Task | Go To |
|------|-------|
| Code / бъг / нова функция | `~/Wallestars/` |
| Workflow / automation | `~/Wallestars/n8n/` |
| Agent config / API keys | `~/.openclaw/` |
| Deploy / health check | `~/Wallestars/scripts/` |
| Infrastructure / machines | Run Tailscale check first (see below) |
| Prompts / agent specs | `~/OpenClaw-Hub/` |

### Step 2: Navigate & Read Context First

**ALWAYS** read the relevant context file before editing anything:

```bash
# За Wallestars проект:
cat ~/Wallestars/README.md
cat ~/Wallestars/AUTOMATION_STATUS.md

# За agent config:
cat ~/.openclaw/openclaw.json

# За deployment статус:
cat ~/Wallestars/DEPLOYMENT_README.md
```

### Step 3: Verify Machine Status (Infrastructure Tasks)

Преди всяка задача свързана с машини или мрежа:

```bash
# 1. Проверка на Tailscale мрежата
/Applications/Tailscale.app/Contents/MacOS/Tailscale status

# 2. Интерпретация на резултата:
# "-" след IP = онлайн и активен
# "offline, last seen Xd ago" = офлайн, не предприемай remote действия

# 3. SSH до macmini-primary (Leon):
ssh -i ~/.ssh/id_ed25519 diokarabaz@100.83.83.8

# 4. SSH до macmini-secondary (Leon2): (ЗАДЪЛЖИТЕЛНО с потребител diokarabaz2!)
ssh -i ~/.ssh/id_ed25519 diokarabaz2@100.70.181.127
```

---

## ⚙️ Action Protocols by Task Type

### 🔧 Protocol A: Code Fix / Feature

```
1. cd ~/Wallestars
2. Прочети AUTOMATION_STATUS.md за текущия статус
3. Намери засегнатия файл (src/ или scripts/)
4. Прочети файла изцяло преди редактиране
5. Направи промяната
6. Провери с: npm run build (ако е приложимо)
7. Докладвай промените
```

### 🔄 Protocol B: n8n Workflow

```
1. cd ~/Wallestars/n8n/
2. ls -la (виж всички workflow файлове)
3. Прочети съответния .json workflow
4. Редактирай само таргетирания node
5. За активиране: отвори n8n UI на https://n8n.openbalancer.com
```

### 🚀 Protocol C: Deploy / Update Local Services

```
1. cd ~/Wallestars/scripts/
2. Изпълни: bash health-check.sh (ПЪРВО!)
3. Рестартирай съответния контейнер на macmini-primary (100.83.83.8) или локално
4. Потвърди с нов health check
```

### 🖥️ Protocol D: Machine Management (macmini-primary / macmini-secondary)

```
1. Провери Tailscale статус
2. Ако машината е офлайн → СПРИ. Изчакай физическо включване.
3. Ако машината е онлайн:
   a. SSH до macmini-primary: ssh -i ~/.ssh/id_ed25519 diokarabaz@100.83.83.8
   b. Провери: tailscale status && uptime && df -h
   c. Провери openclaw daemon: openclaw status
```

---

## 🚦 Decision Rules (Важно!)

1. **Не предприемай деструктивни действия** (rm, reset, overwrite) без изрично потвърждение
2. **Ако машина е офлайн** → не чакай и не retry-вай — докладвай статуса и изчакай сигнал "онлайн са"
3. **Ако не си сигурен в директорията** → изпълни `pwd` и `ls` преди всяко действие
4. **При SSH грешка** → не retry повече от 2 пъти, докладвай грешката
5. **Приоритетен ред на машините:** macmini-primary (100.83.83.8) > macmini-secondary (100.70.181.127) > dios-macbook-air (current)
6. **НИКОГА не използвай външни VPS сървъри** (`72.61.154.188` / Hostinger) — всички са DEPRECATED и DECOMMISSIONED. Всички логове и бекъпи се четат само от локални дискове или `/Volumes/PHILIPS_SSD/`.

---

## 🔄 Session Start Checklist (Задължително при всяка нова сесия)

Изпълни в този ред — без изключения:

### 1. Потвърди контекст и директория
```bash
pwd   # Трябва да съвпада с таблицата в Navigation Protocol
ls    # Бърза проверка на съдържанието
```
Ако директорията не съвпада с задачата → `cd` в правилната ПРЕДИ всичко друго.

### 2. Зареди последно известно състояние
```bash
cat ~/Wallestars/AUTOMATION_STATUS.md
```
Третирай съдържанието като "оперативна истина". Не правй промени, ако статусът противоречи на задачата — докладвай конфликта.

### 3. При infra/машини/деплой задачи: провери мрежата
```bash
/Applications/Tailscale.app/Contents/MacOS/Tailscale status
```
- `"-"` след IP → онлайн, може да продължиш
- `"offline, last seen Xd ago"` → **СТОП**. Не правй remote действия. Изчакай физически сигнал.

### 4. Обяви готовност
Преди задача съобщи кратко:
```
Task type: [A/B/C/D/E]
Директория: [pwd резултат]
Status файл: [прочетен / N/A]
Tailscale: [онлайн/офлайн/N/A]
Готов за: [описание на следващата стъпка]
```

---

## 🧠 State & Memory Policy

### Кое се помни и как

| Механизъм | Обхват | Съдържание |
|-----------|--------|------------|
| `GEMINI.md` (този файл) | Всяка сесия | Правила, протоколи, навигация — пълен контекст |
| `--resume` / `/resume` | Интерактивни сесии | Продължаване на прекъснат разговор |
| `save_memory` tool | Между сесии | Само инварианти — не секрети |
| `.env` файлове | Runtime | API ключове — никога в чат |

### Правила за `save_memory`
Записвай само ако:
- Фактът е верен независимо от сесията (напр. приоритетен ред на машини)
- Не съдържа credentials, IP-та или чувствителни данни
- Не дублира информация от GEMINI.md

**Забранено в `save_memory`:** API ключове, пароли, Tailscale auth ключове, пълни IP адреси на production системи.

### При non-interactive извикване (скриптове/пайпове)
Поведението е ефективно **stateless** — няма автоматично session resume.
→ Всички критични инструкции са тук в GEMINI.md. Не разчитай на памет от предишно извикване.

---

## ⚠️ Compliance & Risk Gates

Преди автоматизации, включващи следните инструменти, задължително прецени:

| Инструмент | Риск | Изисква |
|-----------|------|---------|
| DuoPlus + antidetect + proxy комбо | ToS нарушение на target платформа | Изрично потвърждение за use-case |
| SMSTome / disposable SMS за mass регистрации | ToS + потенциален измамен intent | Легален review |
| NodeMaven за scraping на лични данни | GDPR чл. 5 (data minimization) | Lawful basis + privacy notice |
| Airtop/Stagehand за lead collection | GDPR + ePrivacy директива | Consent или legitimate interest |
| Wallester card issuing API | PCI DSS + лицензионни задължения | Само в одобрени бизнес сценарии |

**Правило:** Ако задачата комбинира 2+ инструмента от таблицата → СПРИ и поискай потвърждение от потребителя преди изпълнение.

---

## 🎯 Core Integration Stack (Reference)

Одобреният "ядрен" стек — всяка нова идея е вариация на един от тези блока:

```
Orchestration:  n8n (self-hosted, VPS)
Data:           Supabase (PostgreSQL + Auth + Storage)
Project:        Linear (GraphQL API + webhooks)
Web automation: Stagehand + Browserbase (или Airtop за no-code)
Payments:       Wallester Business API (card issuing)
Mobile:         DuoPlus (само при легитимен use-case)
Network:        NodeMaven proxies (само за geo-тестване)
Mesh:           Tailscale (machine connectivity)
```

Нова интеграция от "100 идеи" списъка → първо определи в кой блок се вписва, после интегрирай там.
