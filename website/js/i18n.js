/* ==========================================================================
   OpenBalancer — Robust Internationalization Engine (BG / EN)
   Operated by INCONTROL PLUS ЕООД
   ========================================================================== */

(function () {
  const translations = {
    en: {
      // Accessibility & Navigation
      "skip_to_content": "Skip to main content",
      "nav_benchmarks": "Benchmarks",
      "nav_parameters": "Parameters",
      "nav_architecture": "Architecture",
      "nav_simulator": "Live Visualizer",
      "nav_matrix": "Comparison Matrix",
      "nav_config": "Config Builder",
      "nav_enterprise": "Enterprise SLA",
      "nav_pricing": "Pricing",
      "nav_faq": "FAQ",
      "nav_retainers": "Retainers",
      "nav_request_sla": "Request Enterprise SLA",
      "nav_docs": "Documentation",
      "nav_theme_toggle": "Toggle Theme Mode",
      "theme_btn_label": "Theme",
      "theme_dark": "Deep Space Dark",
      "theme_matrix": "Matrix Terminal Console",

      // Documentation Portal
      "doc_header_title": "Technical Documentation",
      "doc_header_sub": "Complete engineering reference, kernel event loop architecture, configuration schema, Prometheus metrics, and interactive developer tools.",
      "doc_search_placeholder": "Search documentation (e.g., algorithms, metrics, hot reload)...",
      "doc_nav_grp_getstarted": "🚀 Getting Started",
      "doc_nav_grp_architecture": "🏗️ Core Architecture",
      "doc_nav_grp_config": "⚙️ Configuration",
      "doc_nav_grp_observability": "📊 Telemetry & APIs",
      "doc_nav_grp_operations": "🚀 Production Operations",
      "doc_nav_grp_enterprise": "⚡ Performance & SLAs",
      "doc_nav_overview": "System Overview",
      "doc_nav_quickstart": "Quickstart & Installation",
      "doc_nav_architecture": "Kernel & Event Loop",
      "doc_nav_algorithms": "Routing Algorithms",
      "doc_nav_config_schema": "Config Schema & Options",
      "doc_nav_config_builder": "Interactive JSON Builder",
      "doc_nav_error_studio": "Custom Error Page Studio",
      "doc_nav_telemetry_api": "Status & Prometheus API",
      "doc_nav_latency_heatmap": "Latency Heatmap & Flamegraph",
      "doc_nav_api_tester": "Live API Tester (\"Try it Out\")",
      "doc_nav_deployment": "Docker & Kubernetes",
      "doc_nav_hot_reload": "Zero-Downtime Hot Reload",
      "doc_nav_benchmarks": "Benchmarks & Low Latency",
      "doc_nav_enterprise_sla": "Enterprise SLA Support",
      "doc_sec_overview_tag": "System Overview",
      "doc_overview_p1": "OpenBalancer is an ultra-fast, asynchronous load balancer and API reverse proxy built specifically for high-throughput AI model inference clusters, microservice meshes, and mission-critical API routing. Written from the ground up on non-blocking Python asyncio raw sockets, OpenBalancer eliminates unnecessary middleware layers to deliver sub-millisecond p99 routing overhead.",
      "doc_callout_sovereignty_title": "100% Data Sovereignty & Zero Vendor Lock-in:",
      "doc_callout_sovereignty_desc": " OpenBalancer runs completely standalone with zero external cloud dependencies, third-party analytics trackers, or closed telemetry beacons. It is ideal for isolated VPCs, air-gapped on-premise servers, and GDPR/HIPAA regulated infrastructure.",
      "doc_core_capabilities_title": "Core Architectural Highlights",
      "doc_cap1_title": "Non-Blocking Asynchronous Socket Loop:",
      "doc_cap1_desc": "Pipes incoming client requests to upstream backends asynchronously using raw TCP stream readers and writers without threading locks.",
      "doc_cap2_title": "AI LLM Streaming & SSE Passthrough:",
      "doc_cap2_desc": "Zero response buffering for text/event-stream and application/grpc, ensuring instant token-by-token streaming with constant O(1) memory consumption.",
      "doc_cap3_title": "Active Background Health Probing:",
      "doc_cap3_desc": "Continuously interrogates upstream backend health paths at configurable intervals with sub-millisecond latency tracking.",
      "doc_cap4_title": "Automatic Circuit Breaking:",
      "doc_cap4_desc": "Immediately isolates flapping or failing upstream nodes after consecutive probe failures, preventing cascading microservice collapse.",
      "doc_cap5_title": "Prometheus Telemetry & JSON Status:",
      "doc_cap5_desc": "Native built-in endpoints at /openbalancer/status and /metrics for turnkey Grafana observability.",
      "doc_sec_quickstart_tag": "Quickstart & Setup",
      "doc_quickstart_desc": "Get OpenBalancer running in under 60 seconds using Docker, Docker Compose, or standalone Python.",
      "doc_sec_arch_tag": "Under the Hood",
      "doc_arch_p1": "OpenBalancer utilizes single-threaded non-blocking cooperative multitasking via Python's asyncio socket event loop. By bypassing traditional thread pools and GIL contention, it maintains a lightweight footprint (~18MB RSS) capable of handling tens of thousands of concurrent open TCP streams.",
      "doc_arch_stream_title": "Zero-Copy Bufferless Streaming Pipeline:",
      "doc_arch_stream_desc": " When proxying streaming responses (e.g. OpenAI/Claude SSE completion streams or gRPC chunks), OpenBalancer bypasses internal aggregation buffers and streams chunks directly between socket descriptors in real time.",
      "doc_circuit_breaker_title": "Circuit Breaker & Health Probing State Machine",
      "doc_circuit_breaker_desc": "Every configured upstream node is evaluated across a robust state machine:",
      "doc_sec_algo_tag": "Dispatch Strategies",
      "doc_algo_intro": "OpenBalancer provides 6 production-ready load balancing strategies switchable at runtime or via configuration:",
      "doc_sec_schema_tag": "Specification",
      "doc_schema_intro": "OpenBalancer reads its initial topology from config.json. All parameters can be hot-reloaded without downtime via SIGHUP.",
      "doc_env_overrides_title": "Environment Variable Overrides",
      "doc_env_overrides_desc": "For Twelve-Factor App compliance and container environments, all primary options can be overridden via environment variables:",
      "doc_sec_builder_tag": "Interactive Tool",
      "doc_builder_desc": "Configure your cluster parameters visually below. The schema updates in real time with 1-click clipboard copy and direct JSON file download.",
      "doc_sec_telemetry_tag": "Observability",
      "doc_telemetry_intro": "OpenBalancer features built-in, zero-dependency observability endpoints natively exposing cluster telemetry in both structured JSON and standard Prometheus scrape formats.",
      "doc_status_api_desc": "Returns real-time cluster uptime, total proxied requests, selected algorithm, and per-node health status, latency, and circuit breaker trip counts.",
      "doc_prometheus_api_desc": "Compatible out of the box with Prometheus, VictoriaMetrics, and Grafana Agent without requiring an external exporter sidecar.",
      "doc_sec_tester_tag": "Live API Console",
      "doc_tester_intro": "Test OpenBalancer management and telemetry endpoints in real time. Choose an endpoint below and click Execute Request. If running locally, you can query your live instance, or use our high-fidelity simulated sandbox engine.",
      "doc_sec_deploy_tag": "Production",
      "doc_deploy_intro": "Deploying OpenBalancer in mission-critical environments with automatic restart policies, healthchecks, and resource constraints.",
      "doc_sec_reload_tag": "Zero-Downtime Ops",
      "doc_reload_p1": "OpenBalancer listens for POSIX SIGHUP signals. When received, the core re-reads config.json from disk, reconstructs upstream pools, updates routing weights, and adjusts probing intervals without dropping active client TCP connections or interrupting streaming responses.",
      "doc_sec_bench_tag": "Performance Metrics",
      "doc_bench_intro": "Measured on bare-metal Linux (AMD EPYC 7763, 64 Cores, 10GbE network link) running wrk -t16 -c1000 -d30s against 3 upstream nodes.",
      "doc_reproduce_bench_title": "Reproduce Benchmarks Locally:",
      "doc_reproduce_bench_desc": " Run bombardier -c 500 -n 100000 http://localhost:8080/ to verify local throughput and sub-millisecond response consistency.",
      "doc_sec_sla_tag": "Commercial Backing",
      "doc_sla_p1": "OpenBalancer is maintained and commercially backed by INCONTROL PLUS ЕООД. For production enterprise deployments requiring guaranteed uptime, sub-15 minute emergency incident escalation, and custom AI dispatcher integrations, we provide contractual B2B Master Services Agreements (MSAs).",
      "doc_sla_box_title": "Contractual 99.9% Uptime Guarantee",
      "doc_sla_box_desc": "Backed by formal contractual service credits for any monthly downtime below 99.9%. Net-14 corporate invoicing and instant Stripe Card checkout supported.",
      "doc_btn_request_sla": "Request Enterprise SLA Contract",
      "doc_btn_impressum": "Company Impressum & Verification",

      // Cookie Banner

      // Hero
      "hero_badge_new": "NEW",
      "hero_announcement": "<strong>v1.5.0 Enterprise AI Gateway:</strong> Non-blocking gRPC &amp; LLM Token Stream routing. Learn more &rarr;",
      "hero_tag": "Core Engine: Async Socket Event Loop • v1.5.0-stable • MIT License",
      "hero_title": "High-Throughput Asynchronous Load Balancer & Reverse Proxy",
      "hero_subtitle": "Distribute mission-critical API traffic, LLM token streams, and microservice workloads with sub-millisecond overhead, active health probing, and automated circuit breaking.",
      "hero_cta_simulator": "Launch Live Visualizer",
      "hero_cta_github": "View Source on GitHub",
      "hero_cta_audit": "Enterprise Architecture Audit",

      // Benchmarks
      "bench_req_sec": "Req / Sec Throughput",
      "bench_latency": "p99 Routing Latency",
      "bench_conns": "Max Concurrent Conns",
      "bench_rss": "Core RSS Footprint",

      // Terminal
      "terminal_copy": "Copy Snippet",
      "terminal_copied": "Copied!",

      // Architecture
      "arch_tag": "Kernel & Event Loop Architecture",
      "arch_title": "Engineered for High-Concurrency Protocols",
      "arch_subtitle": "Built from the ground up on non-blocking asynchronous sockets with zero external dependencies in the hot path.",
      "feat1_title": "Protocol Agnostic Routing",
      "feat1_desc": "Full support for HTTP/1.1, HTTP/2 multiplexing, long-lived WebSockets, Server-Sent Events (SSE), and gRPC streaming.",
      "feat2_title": "Active Circuit Breaking",
      "feat2_desc": "Detects consecutive 5xx errors or socket timeouts in milliseconds, instantly tripping degraded upstream backends out of the pool.",
      "feat3_title": "Multi-Algorithm Balancing",
      "feat3_desc": "Select between Weighted Round-Robin, Smooth Least Connections, and Consistent IP Hash Rings for session sticky routing.",

      // Simulator & Prometheus Telemetry
      "sim_tag": "Interactive Testbench",
      "sim_title": "Live Traffic & Failover Visualizer",
      "sim_subtitle": "Observe how OpenBalancer dynamically distributes socket requests and reroutes traffic when an upstream node fails.",
      "sim_chart_title": "Live Real-Time Ingress Telemetry (Prometheus Metric Stream)",
      "sim_chart_live": "LIVE STREAM",
      "sim_processed_reqs": "Processed Requests",
      "sim_observed_latency": "Observed Latency",
      "sim_dispatched_node": "Dispatched Node",
      "sim_stat_protocol": "Active Protocol",
      "sim_btn_outage": "Crash Node 2 (Failover)",
      "sim_btn_restore": "Restore Node 2 Health",
      "sim_btn_latency": "Inject 500ms Spike (Node 1)",
      "sim_btn_surge": "Surge (1k Req/s)",
      "sim_btn_reset": "Reset Cluster",
      "sim_btn_send": "Send Socket Request",
      "sim_event_baseline": "Cluster Status: All 3 upstream nodes online. Dynamic load distribution active.",
      "sim_event_outage": "Chaos Alert: Node 2 crashed (503). Traffic rerouted to Node 1 and Node 3 with 0 dropped packets.",
      "sim_event_latency": "Circuit Breaker: High latency detected on Node 1 (520ms). Shedding traffic to healthy peers.",
      "sim_event_surge": "Stress Test: 1,000 req/sec burst ingested. Asynchronous queue depth optimal.",
      "sim_event_reset": "Cluster Status: All nodes restored to healthy baseline (12ms latency).",
      "sim_client_ingress": "Client Ingestion",
      "sim_client_sub": "TCP Sockets & Webhooks",
      "sim_core_title": "OpenBalancer Core",
      "sim_core_sub": "Weighted Round-Robin",

      // Protocol Stream Selector
      "proto_label": "Active Protocol Stream:",
      "proto_http1_name": "HTTP/1.1",
      "proto_http1_desc": "REST & Keep-Alive",
      "proto_sse_name": "SSE LLM Stream",
      "proto_sse_desc": "Bufferless Token Pipe",
      "proto_ws_name": "WebSockets",
      "proto_ws_desc": "Duplex Socket Sync",
      "proto_grpc_name": "gRPC (HTTP/2)",
      "proto_grpc_desc": "Multiplexed Protobuf",

      // SSE Live Bufferless Inspector
      "sse_inspector_title": "SSE Live Bufferless Token Stream Inspector",
      "sse_tag_bufferless": "0ms Buffer Overhead",
      "sse_stat_ttft": "TTFT:",
      "sse_stat_rate": "Throughput:",
      "sse_stat_chunk": "Kernel Transfer:",
      "sse_pipe_mode": "Direct Zero-Copy Pipe",

      // Topology Canvas Legend & Tooltips
      "leg_healthy": "200 OK (Healthy)",
      "leg_latency": "500ms Latency Spike (Degraded)",
      "leg_outage": "Node Outage / Circuit Breaker Drop",
      "sim_circuit_tripped": "TRIPPED (503)",
      "sim_circuit_degraded": "DEGRADED (520ms)",
      "sim_circuit_healthy": "HEALTHY",
      "sim_click_hint": "Tip: Click canvas or trigger requests to spawn live particle streams",

      // Web Audio Micro-Feedback
      "sim_audio_toggle": "Sound FX: ON",
      "sim_audio_toggle_off": "Sound FX: MUTED",

      // Real-Time Latency Heatmap & Flamegraph
      "sim_heatmap_title": "Real-Time Latency Heatmap & Flamegraph",
      "sim_heatmap_live": "DYNAMIC 60FPS",
      "sim_tab_heatmap": "Distribution Heatmap",
      "sim_tab_flamegraph": "Flamegraph Waterfall",
      "bucket_green": "<10ms (Optimal)",
      "bucket_cyan": "10-50ms (Normal)",
      "bucket_yellow": "50-200ms (Spike)",
      "bucket_red": ">200ms (Degraded)",
      "fg_title": "Socket Pipeline Phase Execution & TTFB Breakdown",
      "fg_total_lbl": "Total Time:",
      "fg_phase_ingress": "01. Ingress Socket Parse",
      "fg_phase_ratelimit": "02. Token Bucket Rate Check",
      "fg_phase_routing": "03. Dispatch Routing Strategy",
      "fg_phase_tls": "04. Upstream TCP & TLS Pipe",
      "fg_phase_ttfb": "05. Upstream First Byte (TTFB)",
      "fg_phase_flush": "06. Zero-Copy Stream Flush",

      // Documentation Latency Section
      "doc_sec_heatmap_tag": "Real-Time Telemetry",
      "doc_heatmap_title": "Real-Time Latency Distribution Heatmap & Flamegraph",
      "doc_heatmap_intro": "Observe real-time latency distribution across 4 discrete threshold buckets (<10ms green, 10-50ms cyan, 50-200ms yellow, >200ms red) with live percentile calculations and execution waterfall stages.",
      "doc_btn_send_batch": "Send 50 Reqs",
      "doc_btn_spike": "Inject 500ms Spike",
      "doc_btn_fallback": "Simulate Outage Fallback",
      "doc_btn_reset_stream": "Reset Baseline",

      // Custom Error Page Studio (Interactive Tool)
      "doc_sec_error_tag": "Interactive Designer",
      "doc_error_title": "Custom Error Page Studio",
      "doc_error_intro": "Design, live-preview, and export branded, lightweight standalone HTML error pages for 429 Rate Limiting, 502 Bad Gateway, and 503 Outage scenarios. Zero external dependencies, automatic countdown retry logic, and pixel-perfect design.",
      "err_preset_lbl": "Select Error Scenario Preset:",
      "err_opt_429": "429 Too Many Requests (Rate Limited)",
      "err_opt_502": "502 Bad Gateway (Upstream Unreachable)",
      "err_opt_503": "503 Service Unavailable (Circuit Breaker Tripped)",
      "err_lbl_brand": "Brand / Product Name",
      "err_lbl_headline": "Custom Error Headline",
      "err_lbl_message": "Description / Guidance Message",
      "err_lbl_retry_sec": "Retry Countdown (Seconds)",
      "err_lbl_support": "Support Email or URL",
      "err_lbl_theme": "Color Theme Preset",
      "err_theme_cyber": "Cyber Midnight",
      "err_theme_matrix": "Matrix Terminal",
      "err_theme_crimson": "Crimson Alert",
      "err_theme_clean": "Clean Slate",
      "err_btn_copy_html": "Copy Standalone HTML",
      "err_btn_download": "Download .html File",
      "err_btn_test_retry": "Test Retry Action",
      "err_preview_badge": "LIVE INTERACTIVE PREVIEW",
      "err_preview_retry_btn": "Retry Connection Now",
      "err_preview_countdown_prefix": "Automatic reconnection in",
      "err_preview_sec": "seconds",
      "err_preview_ray_id": "Incident Ray ID:",
      "err_copied_toast": "HTML copied to clipboard!",

      // Comparison Matrix
      "matrix_tag": "Open Source Benchmark Matrix",
      "matrix_title": "OpenBalancer vs Traditional Edge Proxies",
      "matrix_subtitle": "Architected specifically for low-overhead async AI inference routing and mission-critical microservice clusters.",
      "col_feature": "Feature / Capability",
      "col_openbalancer": "OpenBalancer v1.4",
      "col_nginx": "NGINX Community",
      "col_haproxy": "HAProxy Community",
      "col_traefik": "Traefik Proxy",
      "m_f1": "Async Non-Blocking Core",
      "m_f2": "LLM Token Stream & SSE Passthrough",
      "m_f3": "Active Health Probing & Circuit Breaking",
      "m_f4": "Memory Footprint (RSS)",
      "m_f5": "Sub-millisecond p99 Routing Overhead",
      "m_f6": "Guaranteed B2B 99.9% Uptime SLA Backing",

      // Config Generator
      "cfg_tag": "Interactive Config Playground",
      "cfg_title": "Cluster Configuration Generator",
      "cfg_subtitle": "Customize your cluster parameters, upstream weights, and health probes with instant JSON validation and 1-click download.",
      "cfg_lbl_algo": "Routing Algorithm",
      "cfg_lbl_port": "Listen Port",
      "cfg_lbl_probe": "Health Check Interval",
      "cfg_lbl_cb": "Circuit Breaker Threshold",
      "cfg_lbl_timeout": "Socket Connection Timeout",
      "cfg_lbl_upstreams": "Configured Upstream Backends",
      "cfg_btn_add": "+ Add Backend Node",
      "cfg_btn_download": "Download openbalancer.json",
      "cfg_btn_copy": "Copy Config",
      "cfg_copied": "Copied!",

      // Enterprise
      "ent_tag": "Enterprise SLA Backing",
      "ent_title": "Production Infrastructure & SLA Management",
      "ent_p1": "OpenBalancer is backed and operated by <strong>INCONTROL PLUS ЕООД</strong>. We provide formal B2B Master Services Agreements (MSA), guaranteed 99.9% uptime SLAs, and sub-15 minute emergency incident response for corporate engineering teams.",
      "ent_highlight1_title": "99.9% Uptime Guarantee",
      "ent_highlight1_desc": "Contractual SLA with automated service credits for downtime under 99.9%.",
      "ent_highlight2_title": "Sub-15 Min Critical Incident SLA",
      "ent_highlight2_desc": "24/7 direct escalation hotline to senior infrastructure architects.",
      "ent_highlight3_title": "Net-14 Corporate Invoicing",
      "ent_highlight3_desc": "EU VAT compliant invoicing processed securely via Stripe Invoicing.",

      // Pricing
      "pricing_tag": "Pricing & Retainers",
      "pricing_title": "Transparent Licensing & B2B Support Tiers",
      "pricing_subtitle": "Deploy OpenBalancer for free under the MIT license, or partner with INCONTROL PLUS for guaranteed B2B SLAs.",
      
      "plan1_title": "Community Open-Source",
      "plan1_desc": "For developers and self-hosted environments.",
      "plan1_f1": "Full Core Routing Engine (MIT)",
      "plan1_f2": "Round-robin & Weighted Algorithms",
      "plan1_f3": "Active Health Probing & Metrics",
      "plan1_f4": "Docker Swarm & K8s Support",
      "plan1_btn": "Download Community Core",
      
      "plan2_popular": "Corporate SLA",
      "plan2_title": "B2B Pro SLA Retainer",
      "plan2_desc": "For high-availability production clusters.",
      "plan2_f1": "99.9% Contractual Uptime SLA",
      "plan2_f2": "Sub-15 Min Critical Incident SLA",
      "plan2_f3": "Hardened Multi-Node Configuration",
      "plan2_f4": "Official B2B Invoice via Stripe",
      "plan2_btn": "Request SLA Contract",
      
      "plan3_title": "Custom Enterprise SLA",
      "plan3_desc": "For multi-region and high-throughput systems.",
      "plan3_f1": "Custom Master Services Agreement (MSA)",
      "plan3_f2": "Custom AI LLM Dispatcher Plugins",
      "plan3_f3": "Dedicated Senior DevOps Lead",
      "plan3_f4": "Net-30 Corporate Terms",
      "plan3_btn": "Contact Sales",

      // FAQ
      "faq_tag": "Operational & B2B FAQ",
      "faq_title": "Frequently Asked Questions",
      "faq_subtitle": "Everything you need to know regarding licensing, SLA guarantees, invoicing, and technical deployment.",
      "faq_q1": "How does the contractual 99.9% uptime SLA compensation work?",
      "faq_a1": "Under our Master Services Agreement (MSA), if your cluster uptime falls below 99.9% in a calendar month, INCONTROL PLUS automatically applies contractual service credits calculated per minute of downtime, credited directly against your next Stripe invoice.",
      "faq_q2": "How are corporate EU VAT invoices and payments handled via Stripe?",
      "faq_a2": "All corporate retainers are invoiced securely through Stripe Invoicing with automated EU VAT reverse-charge calculation. We support SEPA B2B direct bank transfers, corporate cards (Visa, Mastercard, AMEX), and Net-14 payment terms.",
      "faq_q3": "How does OpenBalancer handle LLM token streams (SSE) without buffer bloat?",
      "faq_a3": "OpenBalancer streams chunks directly via zero-copy kernel socket piping and disables internal proxy response buffering for `text/event-stream` and `application/grpc` headers. Memory consumption remains strictly constant (O(1)) regardless of stream length.",
      "faq_q4": "Can we deploy OpenBalancer on-premises in isolated/air-gapped networks?",
      "faq_a4": "Yes. OpenBalancer is 100% self-contained and has zero external telemetry requirements. You can run it as a standalone Linux binary, a Docker container, or inside a Kubernetes cluster completely isolated from the public internet.",
      "faq_q5": "What is your refund and SLA cancellation policy?",
      "faq_a5": "We offer a 30-day initial trial window on SLA retainers. If our response times or failover performance do not meet your technical expectations, you can cancel with full refund of the current retainer period.",

      // Payment Trust Bar
      "trust_title": "Secured B2B Invoicing & Retainers",
      "trust_desc": "Encrypted 256-bit TLS payments processed via Stripe with Net-14 corporate invoicing terms.",

      // Footer
      "footer_desc": "OpenBalancer is an intelligent open-source load balancing and API reverse proxy system operated and supported by INCONTROL PLUS ЕООД.",
      "footer_col_arch": "Architecture",
      "footer_col_comp": "Compliance",
      "footer_col_entity": "Operating Entity",
      "footer_tos": "Terms of Service (ToS)",
      "footer_privacy": "Privacy Policy (GDPR)",
      "footer_refunds": "Refund & SLA Policy",
      "footer_verify": "Company Verification",
      "footer_rights": "© 2026 INCONTROL PLUS ЕООД. All rights reserved. OpenBalancer™ is a trademark of INCONTROL PLUS.",

      // Modal
      "modal_title": "Request Enterprise SLA & Invoicing",
      "modal_subtitle": "Direct engagement with <strong>INCONTROL PLUS ЕООД</strong>. Receive a formal B2B proposal and SLA terms within 2 hours.",
      "modal_lbl_company": "Company Legal Name *",
      "modal_lbl_vat": "VAT / Registry ID",
      "modal_lbl_email": "Work Email *",
      "modal_lbl_phone": "Corporate Phone",
      "modal_lbl_plan": "Selected Retainer / SLA *",
      "modal_lbl_scope": "Cluster Scope & Target Throughput",
      "modal_lbl_payment_method": "Preferred Billing & Payment Method",
      "modal_opt_invoice": "Corporate Net-14 Invoicing",
      "modal_opt_invoice_sub": "SEPA Bank Transfer / VAT Reverse Charge",
      "modal_opt_card": "Instant Stripe Card Checkout",
      "modal_opt_card_sub": "Corporate Credit / Debit Card & Apple Pay",
      "modal_btn_submit": "Submit B2B Inquiry & Request Invoicing",
      "modal_success_title": "Inquiry Registered Successfully",
      "modal_success_desc": "Our senior infrastructure lead at INCONTROL PLUS will review your specifications and send an official B2B proposal and Net-14 invoicing schedule to",

      // Blog
      "blog_back": "&larr; Back to all posts",
      "blog_release_lbl": "Release",
      "blog_date": "Aug 18, 2026",
      "blog_title": "Introducing OpenBalancer v1.5.0: The Enterprise AI Load Balancer",
      "blog_intro": "We built <strong>OpenBalancer v1.5.0</strong> because we needed a lightweight, zero-dependency async reverse proxy and load balancer specifically tailored for LLM token streaming (SSE / WebSockets chunking) and microservice routing where heavy config reloads and huge RAM footprints were overkill.",
      "blog_why_title": "Why another load balancer?",
      "blog_why_p1": "While battle-tested tools like NGINX, HAProxy, and Envoy are industry standards, setting them up for local LLM clusters (vLLM, Ollama, TGI) often involves complex buffering configurations, external health check sidecars, or high base memory overhead.",
      "blog_why_p2": "OpenBalancer was engineered around a few core priorities:",
      "blog_li1": "<strong style=\"color: var(--text-primary);\">Zero-Buffer SSE / Token Streaming:</strong> Powered by native Python <code>asyncio</code> stream pipelines, OpenBalancer streams tokens chunk-by-chunk with constant O(1) memory overhead (~18MB base RSS).",
      "blog_li2": "<strong style=\"color: var(--text-primary);\">AI Inference Failover &amp; Circuit Breaking:</strong> Automatically trips unhealthy backends when inference nodes run out of VRAM (OOM) or time out, instantly rerouting traffic in &lt;50ms without dropping active streaming clients.",
      "blog_li3": "<strong style=\"color: var(--text-primary);\">Dual Observability Out-of-the-Box:</strong> Clean JSON telemetry endpoint (<code>/openbalancer/status</code>) and Prometheus metrics exporter (<code>/metrics</code>).",
      "blog_li4": "<strong style=\"color: var(--text-primary);\">Adaptive Load Balancing Strategies:</strong> Round-Robin, Weighted Round-Robin, Least Connections, Consistent IP Hash, and Power-of-Two Random Choices (P2C).",
      "blog_li5": "<strong style=\"color: var(--text-primary);\">Zero-Dependency Quickstart:</strong> Run as a standalone Python CLI, PyPI package, or ultralight Alpine container (&lt;45MB).",
      "blog_qs_title": "🚀 10-Second Quickstart",
      "blog_outro1": "You can also try the interactive traffic simulator and visualizer directly in your browser on our <a href=\"index.html\" style=\"color: var(--primary);\">landing page</a> or read the <a href=\"docs.html\" style=\"color: var(--primary);\">documentation</a>.",
      "blog_outro2": "<strong>OpenBalancer v1.5.0 is 100% open-source under the MIT license.</strong> We’d love to hear your thoughts, feedback on our async event-loop architecture, HTTP/3 roadmap, and real-world AI inference routing use cases!",

      // Cookie Banner
      "cookie_text": "<strong>GDPR Notice:</strong> OpenBalancer uses strictly necessary cookies for telemetry routing and secure B2B session handling. See",
      "cookie_accept": "Accept All",
      "cookie_dismiss": "Essential Only"
    },

    bg: {
      // Accessibility & Navigation
      "skip_to_content": "Премини към съдържанието",
      "nav_benchmarks": "Бенчмаркове",
      "nav_parameters": "Параметри",
      "nav_architecture": "Архитектура",
      "nav_simulator": "Симулатор на живо",
      "nav_matrix": "Сравнителна матрица",
      "nav_config": "Конфигуратор",
      "nav_enterprise": "Enterprise SLA",
      "nav_pricing": "Цени & Планове",
      "nav_faq": "ЧЗВ",
      "nav_retainers": "Абонаменти",
      "nav_request_sla": "Заяви Enterprise SLA",
      "nav_docs": "Документация",
      "nav_theme_toggle": "Превключи режим на тема",
      "theme_btn_label": "Тема",
      "theme_dark": "Deep Space Тъмна",
      "theme_matrix": "Matrix Терминална конзола",

      // Documentation Portal
      "doc_header_title": "Техническа Документация",
      "doc_header_sub": "Пълно инженерно ръководство, сокет събитиен цикъл, конфигурационна схема, Prometheus метрики и интерактивни инструменти.",
      "doc_search_placeholder": "Търсене в документацията (напр. алгоритми, метрики, hot-reload)...",
      "doc_nav_grp_getstarted": "🚀 Начални стъпки",
      "doc_nav_grp_architecture": "🏗️ Архитектура",
      "doc_nav_grp_config": "⚙️ Конфигурация",
      "doc_nav_grp_observability": "📊 Телеметрия & APIs",
      "doc_nav_grp_operations": "🚀 Производство & Деплой",
      "doc_nav_grp_enterprise": "⚡ Производителност & SLA",
      "doc_nav_overview": "Общ преглед",
      "doc_nav_quickstart": "Бърз старт & Инсталация",
      "doc_nav_architecture": "Ядро & Сокет цикъл",
      "doc_nav_algorithms": "Алгоритми за балансиране",
      "doc_nav_config_schema": "Конфигурационна схема",
      "doc_nav_config_builder": "Интерактивен JSON генератор",
      "doc_nav_error_studio": "Студио за страници за грешки",
      "doc_nav_telemetry_api": "Статус & Prometheus API",
      "doc_nav_latency_heatmap": "Latency Heatmap & Flamegraph",
      "doc_nav_api_tester": "Интерактивен API Тестер",
      "doc_nav_deployment": "Docker & Kubernetes",
      "doc_nav_hot_reload": "Zero-Downtime Hot Reload",
      "doc_nav_benchmarks": "Бенчмаркове & Латентност",
      "doc_nav_enterprise_sla": "Enterprise SLA Поддръжка",
      "doc_sec_overview_tag": "Общ преглед",
      "doc_overview_p1": "OpenBalancer е ултра-бърз, асинхронен балансьор на натоварването и API reverse proxy, проектиран специално за високочестотни AI клъстери, микросървисни мрежи и критично маршрутизиране на API трафик. Изграден от основата върху неблокиращи Python asyncio сокети, OpenBalancer елиминира излишните междинни слоеве за постигане на подмилисекундно p99 забавяне.",
      "doc_callout_sovereignty_title": "100% Суверенитет на данните & Без зависимост от външни доставчици:",
      "doc_callout_sovereignty_desc": " OpenBalancer работи напълно самостоятелно без външни облачни зависимости, тракери или затворена телеметрия. Идеален за изолирани VPC мрежи, локални on-premise сървъри и инфраструктура по регламенти GDPR/HIPAA.",
      "doc_core_capabilities_title": "Основни архитектурни предимства",
      "doc_cap1_title": "Неблокиращ асинхронен сокет цикъл:",
      "doc_cap1_desc": "Пренасочва входящите клиентски заявки към upstream бекендите асинхронно чрез чисти TCP поточни четци и записвачи без блокиращи нишки.",
      "doc_cap2_title": "AI LLM Поточно предаване & SSE директен трансфер:",
      "doc_cap2_desc": "Нулево буфериране на отговорите за text/event-stream и application/grpc, гарантиращо мигновен токен-по-токен стрийминг с константна O(1) памет.",
      "doc_cap3_title": "Активен фонов Health Probing:",
      "doc_cap3_desc": "Непрекъснато тества здравето на бекенд възлите на конфигурируеми интервали с измерване на забавянето в милисекунди.",
      "doc_cap4_title": "Автоматичен Circuit Breaking:",
      "doc_cap4_desc": "Незабавно изолира отпадащи или деградиращи сървърни възли след поредни неуспешни проверки, предотвратявайки каскаден срив.",
      "doc_cap5_title": "Вградена Prometheus & JSON Телеметрия:",
      "doc_cap5_desc": "Директни вградени крайни точки на /openbalancer/status и /metrics за моментална интеграция с Grafana.",
      "doc_sec_quickstart_tag": "Бърз старт & Инсталация",
      "doc_quickstart_desc": "Стартирайте OpenBalancer за под 60 секунди чрез Docker, Docker Compose или чист Python.",
      "doc_sec_arch_tag": "Техническо устройство",
      "doc_arch_p1": "OpenBalancer използва еднонишков неблокиращ сокет събитиен цикъл чрез asyncio. Без блокиране на нишки и GIL колизии, той поддържа изключително лек отпечатък (~18MB RSS) при обслужване на десетки хиляди едновременни TCP връзки.",
      "doc_arch_stream_title": "Zero-Copy буферно-независим конвейер:",
      "doc_arch_stream_desc": " При проксиране на стрийминг отговори (напр. OpenAI/Claude SSE токени или gRPC парчета), OpenBalancer предава данните директно между сокет дескрипторите в реално време.",
      "doc_circuit_breaker_title": "Краен автомат за Circuit Breaker & Здравни проверки",
      "doc_circuit_breaker_desc": "Всеки конфигуриран upstream възел преминава през надежден краен автомат:",
      "doc_sec_algo_tag": "Стратегии за маршрутизиране",
      "doc_algo_intro": "OpenBalancer предоставя 6 производствени алгоритми за балансиране, превключваеми в реално време или през конфигурация:",
      "doc_sec_schema_tag": "Спецификация",
      "doc_schema_intro": "OpenBalancer чете топологията от config.json. Всички параметри могат да се презареждат без прекъсване чрез SIGHUP.",
      "doc_env_overrides_title": "Презаписване чрез променливи на средата",
      "doc_env_overrides_desc": "За контейнерни среди и Twelve-Factor съвместимост, основните настройки могат да се задават чрез системни променливи:",
      "doc_sec_builder_tag": "Интерактивен инструмент",
      "doc_builder_desc": "Конфигурирайте параметрите на вашия клъстер визуално. Схемата се обновява в реално време с копиране и сваляне на готов JSON файл.",
      "doc_sec_telemetry_tag": "Наблюдаемост & Метрики",
      "doc_telemetry_intro": "OpenBalancer разполага с вградени телеметрични крайни точки в структуриран JSON и стандартен Prometheus формат без нужда от външни експортери.",
      "doc_status_api_desc": "Връща ъптайм в реално време, брой обработени заявки, избран алгоритъм и статус/латентност за всеки възел поотделно.",
      "doc_prometheus_api_desc": "Директно съвместим с Prometheus, VictoriaMetrics и Grafana Agent за непрекъснато събиране на метрики.",
      "doc_sec_tester_tag": "API Конзола на живо",
      "doc_tester_intro": "Тествайте крайните точки на OpenBalancer в реално време. Изберете крайна точка и натиснете бутона за изпълнение на заявката.",
      "doc_sec_deploy_tag": "Производствено внедряване",
      "doc_deploy_intro": "Разгръщане на OpenBalancer в критични работни среди с автоматично рестартиране, здравни проверки и ресурсни ограничения.",
      "doc_sec_reload_tag": "Zero-Downtime операции",
      "doc_reload_p1": "OpenBalancer приема POSIX SIGHUP сигнали. При получаване, ядрото презарежда config.json от диска и обновява пула от сървъри без да прекъсва активни клиентски връзки или текущи LLM токен потоци.",
      "doc_sec_bench_tag": "Резултати от производителността",
      "doc_bench_intro": "Измерено на физически Linux сървър (AMD EPYC 7763, 64 ядра, 10GbE мрежа) с wrk -t16 -c1000 -d30s срещу 3 бекенд възела.",
      "doc_reproduce_bench_title": "Възпроизведете бенчмарка локално:",
      "doc_reproduce_bench_desc": " Стартирайте bombardier -c 500 -n 100000 http://localhost:8080/ за тестване на локалната производителност.",
      "doc_sec_sla_tag": "Търговско обезпечение",
      "doc_sla_p1": "OpenBalancer се поддържа и гарантира от INCONTROL PLUS ЕООД. За корпоративни системи предоставяме договори за ниво на обслужване (SLA) с 99.9% гарантиран ъптайм и реакция при инциденти до 15 минути.",
      "doc_sla_box_title": "Договорен 99.9% Ъптайм Гаранция",
      "doc_sla_box_desc": "Обезпечен с финансови компенсации за прекъсване под 99.9%. Поддържат се плащания по фактура (Net-14) и незабавно картово плащане през Stripe.",
      "doc_btn_request_sla": "Заяви Enterprise SLA Договор",
      "doc_btn_impressum": "Фирмена верификация & Импресум",

      // Cookie Banner

      // Hero
      "hero_badge_new": "НОВО",
      "hero_announcement": "<strong>v1.5.0 Enterprise AI Gateway:</strong> Неблокиращ gRPC &amp; LLM Token Stream роутинг. Научете повече &rarr;",
      "hero_tag": "Ядро: Асинхронен сокет цикъл • v1.5.0-stable • MIT Лиценз",
      "hero_title": "Високопроизводителен асинхронен балансьор на натоварването & Reverse Proxy",
      "hero_subtitle": "Разпределяйте критичен API трафик, LLM токен потоци и микросървиси с подмилисекундно забавяне, активен health probing и автоматичен circuit breaker.",
      "hero_cta_simulator": "Стартирай симулатора",
      "hero_cta_github": "Виж кода в GitHub",
      "hero_cta_audit": "Одит на архитектурата",

      // Benchmarks
      "bench_req_sec": "Заявки / сек. капацитет",
      "bench_latency": "p99 Латентност на маршрутизация",
      "bench_conns": "Макс. едновременни връзки",
      "bench_rss": "RSS памет на ядрото",

      // Terminal
      "terminal_copy": "Копирай кода",
      "terminal_copied": "Копирано!",

      // Architecture
      "arch_tag": "Архитектура на сокети & събитиен цикъл",
      "arch_title": "Проектиран за високочестотни протоколи",
      "arch_subtitle": "Изграден от основата върху неблокиращи асинхронни сокети без външни зависимости в критичния път.",
      "feat1_title": "Протоколно-независимо маршрутизиране",
      "feat1_desc": "Пълна поддръжка за HTTP/1.1, HTTP/2 мултиплексиране, постоянни WebSockets, Server-Sent Events (SSE) и gRPC streaming.",
      "feat2_title": "Активен Circuit Breaking",
      "feat2_desc": "Засича поредни 5xx грешки или сокет таймаути за милисекунди и незабавно изолира компрометираните възли от пула.",
      "feat3_title": "Многоалгоритмично балансиране",
      "feat3_desc": "Избор между Weighted Round-Robin, Smooth Least Connections и Consistent IP Hash Ring за сесионна консистентност.",

      // Simulator & Prometheus Telemetry
      "sim_tag": "Интерактивен тестов стенд",
      "sim_title": "Симулатор на трафик & отпадане на възел в реално време",
      "sim_subtitle": "Наблюдавайте как OpenBalancer динамично разпределя сокет заявките и премаршрутира трафика при отпадане на възел.",
      "sim_chart_title": "Телеметрия на трафика в реално време (Prometheus Metric Stream)",
      "sim_chart_live": "НА ЖИВО",
      "sim_processed_reqs": "Обработени заявки",
      "sim_observed_latency": "Измерена латентност",
      "sim_dispatched_node": "Маршрутизиран възел",
      "sim_stat_protocol": "Активен протокол",
      "sim_btn_outage": "Срив на Node 2 (Failover)",
      "sim_btn_restore": "Възстанови Node 2",
      "sim_btn_latency": "Инжектирай 500ms латентност (Възел 1)",
      "sim_btn_surge": "Трафик пик (1k Заявки/сек)",
      "sim_btn_reset": "Рестартирай клъстера",
      "sim_btn_send": "Изпрати сокет заявка",
      "sim_event_baseline": "Статус на клъстера: Всички 3 възела са активни. Динамичното балансиране работи.",
      "sim_event_outage": "Chaos Симулация: Възел 2 прекъсна (503). Трафикът е пренасочен към Възел 1 и 3 с 0 загубени пакети.",
      "sim_event_latency": "Circuit Breaker: Засечена висока латентност на Възел 1 (520ms). Натоварването се преразпределя.",
      "sim_event_surge": "Стрес тест: 1,000 заявки/сек приети. Асинхронната опашка се обработва без забавяне.",
      "sim_event_reset": "Статус на клъстера: Всички възли са възстановени към базово състояние (12ms латентност).",
      "sim_client_ingress": "Входящ трафик",
      "sim_client_sub": "TCP Сокети & Webhooks",
      "sim_core_title": "OpenBalancer Ядро",
      "sim_core_sub": "Претеглен Round-Robin",

      // Protocol Stream Selector
      "proto_label": "Активен протоколен поток:",
      "proto_http1_name": "HTTP/1.1",
      "proto_http1_desc": "REST & Keep-Alive",
      "proto_sse_name": "SSE LLM Поток",
      "proto_sse_desc": "Безбуферен токен канал",
      "proto_ws_name": "WebSockets",
      "proto_ws_desc": "Дуплексна сокет синхронизация",
      "proto_grpc_name": "gRPC (HTTP/2)",
      "proto_grpc_desc": "Мултиплексиран Protobuf",

      // SSE Live Bufferless Inspector
      "sse_inspector_title": "SSE Инспектор на живо за безбуферен токен поток",
      "sse_tag_bufferless": "0ms Буферно забавяне",
      "sse_stat_ttft": "TTFT (Първи токен):",
      "sse_stat_rate": "Капацитет:",
      "sse_stat_chunk": "Трансфер на ядрото:",
      "sse_pipe_mode": "Директен Zero-Copy сокет канал",

      // Topology Canvas Legend & Tooltips
      "leg_healthy": "200 OK (Здрав възел)",
      "leg_latency": "500ms Латентен пик (Забавен)",
      "leg_outage": "Отпаднал възел / Прекъсвач (503)",
      "sim_circuit_tripped": "ПРЕКЪСВАЧ (503)",
      "sim_circuit_degraded": "ЗАБАВЕН (520ms)",
      "sim_circuit_healthy": "ЗДРАВ",
      "sim_click_hint": "Съвет: Кликнете върху картата или изпратете заявка за визуализация на потока от частици",

      // Web Audio Micro-Feedback
      "sim_audio_toggle": "Звукови ефекти: ВКЛ",
      "sim_audio_toggle_off": "Звукови ефекти: ИЗКЛ",

      // Real-Time Latency Heatmap & Flamegraph
      "sim_heatmap_title": "Времева карта на латентността & Flamegraph на живо",
      "sim_heatmap_live": "ДИНАМИЧНО 60FPS",
      "sim_tab_heatmap": "Карта на разпределението",
      "sim_tab_flamegraph": "Flamegraph Водопад",
      "bucket_green": "<10ms (Оптимално)",
      "bucket_cyan": "10-50ms (Нормално)",
      "bucket_yellow": "50-200ms (Пик)",
      "bucket_red": ">200ms (Забавено)",
      "fg_title": "Етапи на изпълнение на сокет пайплайна & TTFB разбивка",
      "fg_total_lbl": "Общо време:",
      "fg_phase_ingress": "01. Парсване на входен сокет",
      "fg_phase_ratelimit": "02. Rate Limit проверка",
      "fg_phase_routing": "03. Алгоритъм за маршрутизация",
      "fg_phase_tls": "04. Връзка с бекенд & TLS пайп",
      "fg_phase_ttfb": "05. Първи байт от бекенда (TTFB)",
      "fg_phase_flush": "06. Zero-Copy предаване към клиента",

      // Documentation Latency Section
      "doc_sec_heatmap_tag": "Телеметрия в реално време",
      "doc_heatmap_title": "Времева карта на латентността & Flamegraph на живо",
      "doc_heatmap_intro": "Визуализирайте динамичното разпределение на латентността в 4 прагови диапазона (<10ms зелено, 10-50ms циан, 50-200ms жълто, >200ms червено) с изчисляване на персентили и етапи на сокет пайплайна в реално време.",
      "doc_btn_send_batch": "Изпрати 50 заявки",
      "doc_btn_spike": "Инжектирай 500ms пик",
      "doc_btn_fallback": "Симулирай отпадане",
      "doc_btn_reset_stream": "Нулирай потока",

      // Custom Error Page Studio (Interactive Tool)
      "doc_sec_error_tag": "Интерактивен дизайн",
      "doc_error_title": "Студио за персонализирани страници за грешки",
      "doc_error_intro": "Проектирайте, тествайте в реално време и експортирайте брандирани, самостоятелни HTML страници за грешки (429 Rate Limit, 502 Bad Gateway, 503 Outage). Без външни библиотеки, с вграден таймер за повторен опит и първокласен дизайн.",
      "err_preset_lbl": "Изберете сценарий за грешка:",
      "err_opt_429": "429 Too Many Requests (Надвишен лимит)",
      "err_opt_502": "502 Bad Gateway (Недостъпен сървър)",
      "err_opt_503": "503 Service Unavailable (Сработила защита)",
      "err_lbl_brand": "Име на бранд / продукт",
      "err_lbl_headline": "Заглавие на грешката",
      "err_lbl_message": "Обяснение и насоки",
      "err_lbl_retry_sec": "Таймер за повторен опит (сек)",
      "err_lbl_support": "Имейл за поддръжка или линк",
      "err_lbl_theme": "Цветова тема",
      "err_theme_cyber": "Кибер полунощ",
      "err_theme_matrix": "Матричен терминал",
      "err_theme_crimson": "Червена тревога",
      "err_theme_clean": "Изчистен графит",
      "err_btn_copy_html": "Копирай готов HTML код",
      "err_btn_download": "Изтегли .html файл",
      "err_btn_test_retry": "Тествай повторен опит",
      "err_preview_badge": "ПРЕГЛЕД НА ЖИВО",
      "err_preview_retry_btn": "Опитай връзка отново",
      "err_preview_countdown_prefix": "Автоматично свързване след",
      "err_preview_sec": "секунди",
      "err_preview_ray_id": "Идентификатор на инцидента:",
      "err_copied_toast": "HTML кодът е копиран в клипборда!",

      // Comparison Matrix
      "matrix_tag": "Сравнителна матрица с отворен код",
      "matrix_title": "OpenBalancer спрямо традиционните Edge проксита",
      "matrix_subtitle": "Проектиран специфично за ниско-латентно асинхронно маршрутизиране на AI инференс и микросървисни клъстери.",
      "col_feature": "Функционалност / Възможност",
      "col_openbalancer": "OpenBalancer v1.4",
      "col_nginx": "NGINX Community",
      "col_haproxy": "HAProxy Community",
      "col_traefik": "Traefik Proxy",
      "m_f1": "Асинхронно неблокиращо ядро",
      "m_f2": "LLM Token Stream & SSE Passthrough",
      "m_f3": "Активен Health Probing & Circuit Breaking",
      "m_f4": "Памет в покой (RSS)",
      "m_f5": "Подмилисекундно p99 забавяне",
      "m_f6": "Гарантиран B2B 99.9% Ъптайм SLA договор",

      // Config Generator
      "cfg_tag": "Интерактивен генератор на конфигурации",
      "cfg_title": "Генератор на клъстерна конфигурация",
      "cfg_subtitle": "Настройте параметрите на вашия клъстер, теглата на възлите и проверките за здраве с валидация в реално време и сваляне с 1 клик.",
      "cfg_lbl_algo": "Алгоритъм за маршрутизиране",
      "cfg_lbl_port": "Слушащ порт",
      "cfg_lbl_probe": "Интервал на здравна проверка",
      "cfg_lbl_cb": "Праг на Circuit Breaker (грешки)",
      "cfg_lbl_timeout": "Таймаут на сокет връзка",
      "cfg_lbl_upstreams": "Конфигурирани Upstream сървъри",
      "cfg_btn_add": "+ Добави сървърен възел",
      "cfg_btn_download": "Свали openbalancer.json",
      "cfg_btn_copy": "Копирай конфигурацията",
      "cfg_copied": "Копирано!",

      // Enterprise
      "ent_tag": "Гарантирана Enterprise SLA поддръжка",
      "ent_title": "Производствена инфраструктура & SLA управление",
      "ent_p1": "OpenBalancer се поддържа и оперира от <strong>ИНКОНТРОЛ ПЛЮС ЕООД</strong>. Предоставяме официални B2B договори за услуги (MSA), гарантиран 99.9% ъптайм SLA и реакция при критични инциденти под 15 минути.",
      "ent_highlight1_title": "99.9% Гарантиран Ъптайм",
      "ent_highlight1_desc": "Договорен SLA с автоматични кредити за услуги при ъптайм под 99.9%.",
      "ent_highlight2_title": "Под 15 мин. реакция при инцидент",
      "ent_highlight2_desc": "24/7 директна линия за ескалация към старши инфраструктурни архитекти.",
      "ent_highlight3_title": "Net-14 Корпоративно фактуриране",
      "ent_highlight3_desc": "ДДС-съвместимо B2B фактуриране, обработвано сигурно чрез Stripe Invoicing.",

      // Pricing
      "pricing_tag": "Цени & Абонаменти",
      "pricing_title": "Прозрачно лицензиране & B2B планове за поддръжка",
      "pricing_subtitle": "Внедрете OpenBalancer безплатно под MIT лиценз или сключете партньорство с ИНКОНТРОЛ ПЛЮС за гарантиран SLA.",
      
      "plan1_title": "Community с отворен код",
      "plan1_desc": "За разработчици и самостоятелно хоствани среди.",
      "plan1_f1": "Пълно софтуерно маршрутизиращо ядро (MIT)",
      "plan1_f2": "Round-robin & Претеглени алгоритми",
      "plan1_f3": "Активен Health Probing & Метрики",
      "plan1_f4": "Docker Swarm & Kubernetes поддръжка",
      "plan1_btn": "Свали Community Core",
      
      "plan2_popular": "Корпоративен SLA",
      "plan2_title": "B2B Pro SLA Абонамент",
      "plan2_desc": "За високодостъпни производствени клъстери.",
      "plan2_f1": "99.9% Договорно гарантиран Ъптайм SLA",
      "plan2_f2": "Под 15 минути реакция при инцидент",
      "plan2_f3": "Защитена мулти-възлова конфигурация",
      "plan2_f4": "Официална B2B фактура през Stripe",
      "plan2_btn": "Заяви SLA Договор",
      
      "plan3_title": "Персонализиран Enterprise SLA",
      "plan3_desc": "За мулти-регионални и високочестотни системи.",
      "plan3_f1": "Индивидуален Master Services Agreement (MSA)",
      "plan3_f2": "Персонализирани AI LLM диспечер плъгини",
      "plan3_f3": "Специализиран старши DevOps архитект",
      "plan3_f4": "Net-30 Корпоративно плащане",
      "plan3_btn": "Свържи се с нас",

      // FAQ
      "faq_tag": "Оперативни & B2B ЧЗВ",
      "faq_title": "Често задавани въпроси",
      "faq_subtitle": "Всичко, което трябва да знаете относно лицензиране, SLA гаранции, фактуриране и разгръщане.",
      "faq_q1": "Как работи компенсацията при нарушение на 99.9% SLA?",
      "faq_a1": "Според нашия Master Services Agreement (MSA), ако месечният ъптайм на вашия клъстер падне под 99.9%, ИНКОНТРОЛ ПЛЮС автоматично начислява компенсаторни кредити за услуги за всяка минута престой, които се приспадат от следващата фактура в Stripe.",
      "faq_q2": "Как се издават фактурите по ДДС и корпоративните плащания през Stripe?",
      "faq_a2": "Всички корпоративни абонаменти се фактурират официално през Stripe Invoicing с автоматично изчисляване на ДДС и обратно начисляване за фирми от ЕС. Поддържат се директни банкови преводи по SEPA, фирмени карти (Visa, Mastercard, AMEX) и Net-14 условия.",
      "faq_q3": "Как OpenBalancer се справя с дълги LLM токен стриймове (SSE) без изтичане на памет?",
      "faq_a3": "OpenBalancer препраща пакетите директно през нулев сокет буфер (zero-copy socket piping) и деактивира прокси буферирането за `text/event-stream` и `application/grpc`. Консумацията на памет остава стриктно константна (O(1)) независимо от дължината на стрийма.",
      "faq_q4": "Може ли OpenBalancer да бъде разгърнат on-premise в изолирана корпоративна мрежа?",
      "faq_a4": "Да. OpenBalancer е 100% самостоятелен и не изисква изходящ интернет достъп за телеметрия. Може да се изпълнява като самостоятелен Linux бинарен файл, Docker контейнер или в Kubernetes клъстер в напълно изолирана (air-gapped) банкова или държавна среда.",
      "faq_q5": "Каква е политиката за анулиране и възстановяване на средства?",
      "faq_a5": "Предоставяме 30-дневен пробен период за корпоративни SLA абонаменти. Ако времето за реакция или техническото представяне не отговарят на договорните параметри, можете да анулирате абонамента с пълно възстановяване на сумата за текущия период.",

      // Payment Trust Bar
      "trust_title": "Сигурно B2B Фактуриране & Абонаменти",
      "trust_desc": "Криптирани 256-bit TLS плащания, обработвани чрез Stripe с Net-14 корпоративни условия.",

      // Footer
      "footer_desc": "OpenBalancer е високопроизводителна система за балансиране на натоварването и API reverse proxy, оперирана и поддържана от ИНКОНТРОЛ ПЛЮС ЕООД.",
      "footer_col_arch": "Архитектура",
      "footer_col_comp": "Правни & Политики",
      "footer_col_entity": "Опериращо дружество",
      "footer_tos": "Общи условия (ToS)",
      "footer_privacy": "Политика за поверителност (GDPR)",
      "footer_refunds": "Политика за възстановяване & SLA",
      "footer_verify": "Фирмена идентификация",
      "footer_rights": "© 2026 ИНКОНТРОЛ ПЛЮС ЕООД. Всички права запазени. OpenBalancer™ е търговска марка на ИНКОНТРОЛ ПЛЮС.",

      // Modal
      "modal_title": "Запитване за Enterprise SLA & Фактуриране",
      "modal_subtitle": "Директен контакт с <strong>ИНКОНТРОЛ ПЛЮС ЕООД</strong>. Получете официална B2B оферта и SLA условия до 2 часа.",
      "modal_lbl_company": "Юридическо име на фирмата *",
      "modal_lbl_vat": "ЕИК / ДДС Номер",
      "modal_lbl_email": "Служебен имейл *",
      "modal_lbl_phone": "Служебен телефон",
      "modal_lbl_plan": "Избран абонаментен план / SLA *",
      "modal_lbl_scope": "Мащаб на клъстера & Целеви трафик",
      "modal_lbl_payment_method": "Предпочитан метод за плащане и фактуриране",
      "modal_opt_invoice": "Корпоративно Net-14 фактуриране",
      "modal_opt_invoice_sub": "SEPA банков превод / Обратно начисляване на ДДС",
      "modal_opt_card": "Моментално плащане с карта през Stripe",
      "modal_opt_card_sub": "Фирмена кредитна/дебитна карта & Apple Pay",
      "modal_btn_submit": "Изпрати B2B запитване за фактуриране",
      "modal_success_title": "Запитването е регистрирано успешно",
      "modal_success_desc": "Нашият старши инфраструктурен екип в ИНКОНТРОЛ ПЛЮС ще прегледа спецификациите и ще изпрати официално B2B предложение и график за фактуриране на",

      // Blog
      "blog_back": "&larr; Назад към всички публикации",
      "blog_release_lbl": "Версия",
      "blog_date": "18 Август 2026",
      "blog_title": "Представяме OpenBalancer v1.5.0: Enterprise AI Балансьор",
      "blog_intro": "Създадохме <strong>OpenBalancer v1.5.0</strong>, защото имахме нужда от лек, асинхронен reverse proxy и балансьор на натоварването без външни зависимости, специално пригоден за LLM токен стрийминг (SSE / WebSockets) и микросървисно маршрутизиране, където тежките презареждания и огромният разход на RAM бяха излишни.",
      "blog_why_title": "Защо още един балансьор?",
      "blog_why_p1": "Въпреки че доказани инструменти като NGINX, HAProxy и Envoy са индустриални стандарти, тяхното конфигуриране за локални LLM клъстери (vLLM, Ollama, TGI) често включва сложни настройки за буфериране, външни sidecar контейнери за health check или висок базов разход на памет.",
      "blog_why_p2": "OpenBalancer беше конструиран около няколко основни приоритета:",
      "blog_li1": "<strong style=\"color: var(--text-primary);\">Безбуферен SSE / Токен стрийминг:</strong> Захранван от нейтив Python <code>asyncio</code> поточни канали, OpenBalancer предава токените парче-по-парче с константен O(1) разход на памет (~18MB базов RSS).",
      "blog_li2": "<strong style=\"color: var(--text-primary);\">AI Инферентен Failover &amp; Circuit Breaking:</strong> Автоматично изолира нездрави бекенди, когато възлите за инференция останат без VRAM (OOM) или изтече таймаутът им, мигновено пренасочвайки трафика за &lt;50ms без да прекъсва активните стрийминг клиенти.",
      "blog_li3": "<strong style=\"color: var(--text-primary);\">Двойна Наблюдаемост (Out-of-the-Box):</strong> Изчистена JSON телеметрия (<code>/openbalancer/status</code>) и Prometheus експортер за метрики (<code>/metrics</code>).",
      "blog_li4": "<strong style=\"color: var(--text-primary);\">Адаптивни Стратегии за Балансиране:</strong> Round-Robin, Weighted Round-Robin, Least Connections, Consistent IP Hash и Power-of-Two Random Choices (P2C).",
      "blog_li5": "<strong style=\"color: var(--text-primary);\">Бърз старт без зависимости:</strong> Стартирайте като самостоятелен Python CLI, PyPI пакет или ултралек Alpine контейнер (&lt;45MB).",
      "blog_qs_title": "🚀 10-Секунден Бърз Старт",
      "blog_outro1": "Можете също да изпробвате интерактивния симулатор на трафик и визуализатор директно в браузъра си на нашата <a href=\"index.html\" style=\"color: var(--primary);\">начална страница</a> или да прочетете <a href=\"docs.html\" style=\"color: var(--primary);\">документацията</a>.",
      "blog_outro2": "<strong>OpenBalancer v1.5.0 е 100% с отворен код под MIT лиценз.</strong> Ще се радваме да чуем вашите мисли, обратна връзка за нашата асинхронна архитектура, плановете за HTTP/3 и реални случаи на употреба при маршрутизиране на AI инференция!",

      // Cookie Banner
      "cookie_text": "<strong>GDPR Известие:</strong> OpenBalancer използва строго необходими бисквитки за маршрутизация и сигурни B2B сесии. Вижте",
      "cookie_accept": "Приеми всички",
      "cookie_dismiss": "Само необходими"
    }
  };

  let currentLang = 'bg';
  try {
    const saved = localStorage.getItem('openbalancer_lang');
    if (saved && (saved === 'en' || saved === 'bg')) {
      currentLang = saved;
    } else {
      currentLang = 'bg';
    }
  } catch (e) {
    console.warn('Storage access not available', e);
  }

  function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;

    try {
      localStorage.setItem('openbalancer_lang', lang);
    } catch (e) {}

    document.documentElement.lang = lang;

    // Update switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Apply translations
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });

    // Apply placeholder translations
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });
  }

  function bindEvents() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.onclick = function (e) {
        if (e) e.preventDefault();
        const targetLang = this.getAttribute('data-lang');
        setLanguage(targetLang);
      };
    });
    setLanguage(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEvents);
  } else {
    bindEvents();
  }

  window.setLanguage = setLanguage;
  window.initLanguageSwitcher = bindEvents;
  window.openbalancer_i18n = {
    setLanguage,
    getLanguage: () => currentLang,
    translations
  };
})();
