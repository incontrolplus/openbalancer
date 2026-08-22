#!/usr/bin/env bash
set -euo pipefail

BUNDLE_PATH="/tmp/obsidian_vault.bundle"
REMOTE_TARGET="diokarabaz2@100.70.181.127:/Volumes/PHILIPS_SSD/Obsidian_Vault_Backup/obsidian_vault_20260822.bundle"
SSH_KEY="$HOME/.ssh/id_ed25519"

echo "🚀 Starting resilient mesh sync to macmini-secondary (PHILIPS_SSD)..."

MAX_RETRIES=15
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if rsync -avzP --partial --inplace --timeout=30 -e "ssh -o ConnectTimeout=10 -o ServerAliveInterval=5 -o ServerAliveCountMax=6 -i $SSH_KEY" "$BUNDLE_PATH" "$REMOTE_TARGET"; then
        echo "✅ Transfer completed successfully!"
        exit 0
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo "⚠️ Transfer interrupted. Auto-resuming in 3 seconds (Attempt $RETRY_COUNT/$MAX_RETRIES)..."
        sleep 3
    fi
done

echo "❌ Failed to complete transfer after $MAX_RETRIES attempts."
exit 1
