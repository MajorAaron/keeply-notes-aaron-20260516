#!/bin/zsh
cd /Users/aaronmajor/Documents/Codex/2026-05-16-keep-working-on-keeply-add-a || exit 1
exec /opt/homebrew/bin/python3 -m http.server 4174 --bind 127.0.0.1
