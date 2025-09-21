#!/bin/bash
# Completely isolated environment
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export HOME="/Users/sylasp"
export USER="sylasp"
export SHELL="/bin/bash"
unset ZDOTDIR
unset ZSH_CONFIG
unset ZSH
cd /Users/sylasp/ask-ai-legal-work-4
echo "Starting server in isolated environment..."
exec npm run dev
