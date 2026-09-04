#!/bin/bash

# ==============================================================================
# CareFlow AI — macOS Native Application Desktop Launcher
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
TARGET_URL="http://localhost:5173/careflow-mac.html"
FALLBACK_FILE="file://$DIR/careflow-mac.html"

echo "🏥 Starting CareFlow AI for macOS..."

# Check if Google Chrome exists for dedicated app window mode
if [ -d "/Applications/Google Chrome.app" ]; then
    echo "⚡ Launching CareFlow AI via Google Chrome App Mode..."
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --app="$TARGET_URL" || open -a "Google Chrome" "$FALLBACK_FILE"
elif [ -d "/Applications/Brave Browser.app" ]; then
    echo "⚡ Launching CareFlow AI via Brave Browser App Mode..."
    /Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser --app="$TARGET_URL" || open -a "Brave Browser" "$FALLBACK_FILE"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
    echo "⚡ Launching CareFlow AI via Microsoft Edge App Mode..."
    /Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --app="$TARGET_URL" || open -a "Microsoft Edge" "$FALLBACK_FILE"
else
    echo "🍎 Launching CareFlow AI in Apple Safari..."
    open -a Safari "$FALLBACK_FILE"
fi

echo "✓ CareFlow AI macOS Workstation Active!"
