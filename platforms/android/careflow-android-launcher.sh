#!/bin/sh
# CareFlow AI - Android CLI & Emulation Launcher
# Launch inside Android Termux or emulator
echo "Starting CareFlow AI Android Service..."
if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url "http://localhost:5173"
elif command -v am >/dev/null 2>&1; then
  am start -a android.intent.action.VIEW -d "http://localhost:5173"
else
  echo "Open http://localhost:5173 or install CareFlow.apk"
fi
