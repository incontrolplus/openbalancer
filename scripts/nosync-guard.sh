#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Open Balancer / Dev Environment .nosync Shield Guard
# Automatically prevents iCloud from tracking node_modules and build caches
# ==============================================================================

SEARCH_DIRS=(
    "$HOME/Documents"
    "$HOME/Desktop"
    "$HOME/Library/Mobile Documents/com~apple~CloudDocs/05_Dev"
    "$HOME/Library/Mobile Documents/com~apple~CloudDocs/SSOT"
)

echo "🛡️  Scanning directories for unshielded node_modules..."

COUNT=0
for BASE in "${SEARCH_DIRS[@]}"; do
    if [ ! -d "$BASE" ]; then
        continue
    fi
    
    while IFS= read -r DIR; do
        if [[ "$DIR" == *".nosync"* ]]; then
            continue
        fi
        PARENT=$(dirname "$DIR")
        BASE_NAME=$(basename "$DIR")
        NOSYNC_DIR="${DIR}.nosync"
        
        echo "🔒 Shielding: $DIR -> ${BASE_NAME}.nosync + symlink"
        mv "$DIR" "$NOSYNC_DIR"
        ln -s "${BASE_NAME}.nosync" "$DIR"
        COUNT=$((COUNT + 1))
    done < <(find "$BASE" -type d -name "node_modules" ! -type l 2>/dev/null)
done

echo "✅ Done! Shielded $COUNT node_modules directories with .nosync."

# ==============================================================================
# Gatekeeper De-Quarantine Phase
# ==============================================================================
echo "🔓 Removing Gatekeeper com.apple.quarantine attributes from dev/bin paths..."
find "$HOME/.local/bin" "$HOME/Developer" "$HOME/orca/projects" "$HOME/.agents" "$HOME/.openclaw" "$HOME/Wallestars" \
    -maxdepth 4 -exec xattr -d com.apple.quarantine {} + 2>/dev/null || true
echo "✅ Gatekeeper de-quarantine guard active."
