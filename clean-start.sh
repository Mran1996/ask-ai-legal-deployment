#!/bin/bash
# Completely clean environment - no .zshrc loading
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
unset ZDOTDIR
unset ZSH_CONFIG
cd /Users/sylasp/ask-ai-legal-work-4
echo "Starting server with clean environment..."
npm run dev
