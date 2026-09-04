#!/bin/bash
# CareFlow AI - macOS Terminal Runner
echo "============================================"
echo "      CareFlow AI — macOS Workstation       "
echo "============================================"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../.." >/dev/null 2>&1 && pwd )"
MAC_HTML="$DIR/careflow-mac.html"

if [ -f "$MAC_HTML" ]; then
  echo "Opening macOS single-file application..."
  open "$MAC_HTML"
else
  echo "Opening CareFlow web..."
  open "http://localhost:5173"
fi
