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
- **QEMU Disk Locking on Philips SSD (NFS)**: When running `qemu-system-x86_64` or `qemu-img` against disks on `/Volumes/PHILIPS_SSD/` (NFS layer), ALWAYS specify `file.locking=off` in `-drive` parameters and `-U` for `qemu-img info` to prevent byte-locking fatal errors (`Failed to lock byte 201: Operation not supported`).
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
- **Liquid Glass & Explicit High-Contrast Input Invariant**: In all dark-mode and bento-box layouts, form inputs (<input>, <textarea>, <select>) must NEVER rely on implicit or undeclared background classes. They MUST explicitly declare a deep glass background (`bg-[#090f1d]/90` or `bg-[#0b1222]`), high-contrast text (`text-white font-medium`), distinct placeholder (`placeholder-slate-500`), and liquid glass frosted borders with cyan focus rings (`border-white/10 hover:border-cyan-500/40 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15`). Containers must use crystal glassmorphism (`backdrop-blur-2xl`, `bg-gradient-to-br from-white/[0.06] to-white/[0.01]`, `border border-white/10`) to eliminate white-on-white text rendering bugs. Every dashboard page must follow the signature Liquid Glass layout: ambient glowing blur spheres, gradient header banners with rounded-2xl icon boxes (`w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600`), top container highlight lines (`h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent`), and gradient action buttons (`bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600`).
- **Bulgarian Commercial Register Beneficial Owner & Eligibility Invariant**: When querying business registries by physical person names (First, Middle, Last), queries must resolve to companies where the individual is registered as the beneficial owner, manager, or shareholder (`действителен собственик / съдружник / управител`), displaying their explicit ownership share percentage (>= 50% for Wallester eligibility) and official role, rather than matching strings against company names. All returned EIKs must pass the Bulgarian Commercial Register Mod 11 checksum algorithm.
- **Infisical Self-Hosted KMS & Secret Decryption Invariant**: In self-hosted Infisical on `macmini-primary` (`infisical-db` / `infisical-standalone`), `secrets_v2.encryptedValue` and `projects.kmsSecretManagerEncryptedDataKey` include a 3-byte KMS version tag at the end. Decryption using AES-256-GCM must always strip the last 3 bytes (`subarray(0, -3)`) and follow the 2-tier KMS derivation chain (`ENCRYPTION_KEY` -> `ROOT_ENCRYPTION_KEY` -> `projectKmsKey` -> `secretDataKey` -> `secret`).
- **CompanyBook Official REST API & Dual-Engine Fallback Invariant**: Production CompanyBook API keys originate from the Infisical project **`CompanyBook API`** (`COMPANYBOOK_API_KEY_BRATESH08_EOOD`). All queries to `https://api.companybook.bg/api/` must include the header `X-API-Key`. All edge proxy services (`companybook_proxy`, `registry_check`, and `server/index.js`) must prioritize the official REST API with automatic seamless fallback to self-hosted Firecrawl on `http://100.83.83.8:3002` and Supabase PostgreSQL caching (`verified_owners`, `user_registry_checks`). Eligibility/ownership lookups MUST use exclusively `/api/people/search?name=X&with_data=true` (person search) — NEVER `/api/v2/companies/search?name=X` (company name search), as the latter returns companies whose names contain the query words, not companies owned by the person. CompanyBook's people search returns fuzzy/partial name matches, so a **mandatory post-filter** must normalize (`toUpperCase()`, collapse whitespace, trim) and compare each `result.name` against the exact searched full name, skipping (`continue`) any non-exact match. The `with_data=true` parameter is required to obtain `personCompanies[].roles[]` (e.g. `SoleCapitalOwner`, `PhysicalPersonTrader`, `Partner`, `Managers`, `BoardMember`) and `legalForm` for accurate ownership share derivation.
- **JSX Text Escaping & Character Entities Invariant**: In JSX text nodes inside table headers, paragraphs, and labels, never write raw comparison characters (`>=`, `<=`, `<`). Always use Unicode mathematical symbols (`≥`, `≤`) or HTML entities (`&ge;`, `&le;`, `&gt;`) to avoid syntax parse errors in production Vite / Rolldown builds.
- **Cross-Node Ecosystem & Resource Audit Invariant**: When investigating architecture, pipelines, ROI, or financial automations, NEVER look at one component or machine in isolation. ALWAYS perform a multi-node discovery across: `macbook-air` (local `~/Wallestars/openbalancer/b2b_pipeline/` modules), `macmini-primary` (`100.83.83.8` Supabase tables `verified_owners`, `wallester_accounts`, `payment_cards`), `macmini-secondary` (`100.70.181.127` user `diokarabaz2` & `/Volumes/PHILIPS_SSD/` SSOT, deep vaults, Windows VM), and `GitHub` (`incontrolplus/` repos).
- **Telegram Single-Owner Webhook Invariant in n8n**: Only ONE canonical workflow (`OmniElig01`) must register and handle incoming webhook updates for `@wallestars_molty_bot`. Legacy or test workflows sharing the same bot token MUST have `active = false` and their entries removed from `webhook_entity` to prevent `setWebhook` race conditions on container restart.
- **n8n Native Object Serialization for Telegram UI**: In n8n HTTP Request node (v4.2), pass complex objects (e.g. Telegram `reply_markup` with `inline_keyboard`) via native JS object expression `jsonBody: "={{ { chat_id: $json.chat_id, text: $json.formatted_message, parse_mode: 'Markdown', reply_markup: $json.reply_markup } }}"` rather than wrapping sub-objects in `JSON.stringify()`.
- **iCloud Non-Sync & Local Vault Invariant**: When creating sensitive local archives, decrypted password exports, or disk backups, NEVER place them directly into raw `~/Documents` or `~/Desktop` if iCloud Drive sync is enabled. Always place them in root-level hidden local directories (e.g. `~/.comet_backup_local/`) or use the mandatory `.nosync` folder extension (`~/Documents/SECURE_LOCAL.nosync/`) to prevent iCloud sync blocks, upload loops, or remote evictions.
- **Xcode Automatic Simulator Download Prevention Invariant**: On all macOS developer machines (`dios-macbook-air`, `macmini-primary`, `macmini-secondary`), Xcode automatic background component and runtime downloads must be permanently disabled via `defaults write com.apple.dt.Xcode DVTDisableAutomaticComponentDownloads -bool true` and `defaults write com.apple.dt.Xcode IDEDisableAutomaticSimulatorDownloads -bool true` to prevent silent 17+ GB simulator downloads into `/Library/Developer/CoreSimulator/Volumes/`.
- **Ultra-Light Audio Streaming & Media Keys Invariant**: For continuous background audio or YouTube playlist playback, do NOT keep heavy Chromium/Electron tabs open (which consume 1.8 - 2.2 GB RAM). Use the global `play` command via `mpv --no-video --ytdl-raw-options=yes-playlist= --loop-playlist=inf` (< 35 MB RAM footprint) with macOS keyboard media bindings (`F7` Prev, `F8` Play/Pause, `F9` Next).
- **Credentials Role Separation (Infisical vs Apple Passwords)**: Maintain a strict separation of concerns:
  - **Self-Hosted Infisical (`100.83.83.8:8080`)**: Dedicated exclusively to machine-to-machine API keys, tokens, database strings, and Docker/n8n/Cloudflare infrastructure secrets.
  - **Apple Passwords (Safari + Touch ID)**: Dedicated to personal website logins, banking, and portal credentials with zero RAM overhead.
- **Frontend Zero-Credential & Strict Backend-Only Auth Invariant**: Operator, user, and service credentials (`email`, `password`, tokens, API keys) must NEVER be placed in frontend code, React default `useState` states, component props, input placeholders, or client autofill buttons. All authentication flows must strictly delegate verification to the backend Cloudflare Edge Worker API (`/api/auth/login`), generating cryptographically signed HMAC-SHA256 session tokens. Initial frontend input states must always be strictly empty (`""`) with neutral placeholders (`name@company.com`, `••••••••••••`).
- **Cloudflare Pages Clean Directory Deployment & HTML Cache-Control Invariant**: When deploying to Cloudflare Pages via `wrangler pages deploy`, always copy production distribution files to a fresh, isolated directory (`/tmp/pages_deploy/`) before executing the deploy command to prevent asset manifest caching bugs. All HTML shell endpoints (`/dashboard`, `/dashboard.html`, `/cashflow`, `/cashflow.html`) must explicitly send `Cache-Control: no-cache, no-store, must-revalidate` from `_worker.js` to ensure browsers and edge caches never serve stale script hashes or bypass security gates.
- **Unified Master SSOT Dashboard Synchronization Invariant**: All telemetry modules (Cluster Hardware & Thermal Radar with CPU temperatures and dynamic color metrics), Edge Auth sessions, and 45-module Finans Protect Suite components must be compiled into the single unified master bundle in `incontrolplus/openbalancer-dashboard` (and `Wallestars`), committed to `main`, and deployed synchronously across dual Cloudflare Pages projects (`finansprotect-org-openbalanc` and `openbalancer`).
- **Finans Protect Landing Cloudflare Pages Invariant**: The live production site for `finansprotect.com` and `www.finansprotect.com` is hosted on Cloudflare Pages project **`finansprotect-landing`** (Account `7979c4fdc70fa11c48ac5bf469386145`). Build assets from `MICROINVEST-OCR/app/dist` must be deployed to `/tmp/pages_deploy/` and published via `CLOUDFLARE_ACCOUNT_ID="7979c4fdc70fa11c48ac5bf469386145" wrangler pages deploy /tmp/pages_deploy --project-name finansprotect-landing --commit-dirty=true`.
- **Authentic Real Human Avatar & Trust Invariant**: All team and chat assistant avatars (`eva-avatar.png`, `maria-avatar.png`, `victoria-avatar.png`, `elena-avatar.png`) across Finans Protect and Open Balancer must be authentic, photorealistic, square (1:1), high-resolution portraits of real people in professional attire without baked-in circular borders, vector cutouts, or cartoon graphics to maintain enterprise brand trust.
- **Local Playwright System Browser Invariant**: On macOS development environments without global ms-playwright binaries, automated browser verification scripts must specify `executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'` and dismiss cookie/consent overlays (`[data-testid="consent-accept"]`) before interacting with floating launchers and widgets.



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
