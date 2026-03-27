#!/bin/bash
# Ensure correct Node.js version before running commands

if [ -f .nvmrc ]; then
  REQUIRED_VERSION=$(cat .nvmrc | tr -d '[:space:]')
  CURRENT_VERSION=$(node --version 2>/dev/null | tr -d 'v' || echo "")
  
  if [ -z "$CURRENT_VERSION" ] || [ "$CURRENT_VERSION" != "$REQUIRED_VERSION" ]; then
    # Try to load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Try to use the version from .nvmrc
    if command -v nvm &> /dev/null || type nvm &> /dev/null; then
      nvm use > /dev/null 2>&1
    fi
  fi
fi

# Execute the command passed as arguments
exec "$@"
