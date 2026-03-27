#!/bin/bash

# Auto-switch to Node.js version specified in .nvmrc
if [ -f .nvmrc ]; then
  if command -v nvm &> /dev/null; then
    source "$(brew --prefix nvm)/nvm.sh" 2>/dev/null || [ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
    nvm use
  fi
fi

# Run the dev server
npm run dev

