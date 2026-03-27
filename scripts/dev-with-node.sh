#!/bin/bash
# Force Node.js version from .nvmrc before running dev server

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the version from .nvmrc
if [ -f .nvmrc ]; then
  nvm use > /dev/null 2>&1
fi

# Run vite
exec vite "$@"

