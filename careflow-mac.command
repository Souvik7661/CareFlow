#!/bin/bash

# ==============================================================================
# CareFlow AI — macOS Native Application Desktop Launcher
# ==============================================================================

TARGET_URL="http://localhost:5173"

echo "🏥 Starting CareFlow AI for macOS..."

# Check if Google Chrome exists for dedicated app window mode
if [ -d "/Applications/Google Chrome.app" ]; then
    echo "⚡ Launching CareFlow AI via Google Chrome App Mode..."
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --app="$TARGET_URL" || open "$TARGET_URL"
elif [ -d "/Applications/Brave Browser.app" ]; then
    echo "⚡ Launching CareFlow AI via Brave Browser App Mode..."
    /Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser --app="$TARGET_URL" || open "$TARGET_URL"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
    echo "⚡ Launching CareFlow AI via Microsoft Edge App Mode..."
    /Applications/Microsoft\ Edge.app/Contents/MacOS/Microsoft\ Edge --app="$TARGET_URL" || open "$TARGET_URL"
else
    echo "🍎 Launching CareFlow AI in Apple Safari..."
    open -a Safari "$TARGET_URL"
fi

echo "✓ CareFlow AI macOS Workstation Active!"
