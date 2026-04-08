#!/bin/bash

# 1. src/components/login/AccountLinkingIntro.tsx
git checkout --theirs src/components/login/AccountLinkingIntro.tsx

# 2. src/components/login/AccountLinkingVerifyAccess.tsx
git checkout --theirs src/components/login/AccountLinkingVerifyAccess.tsx

# 3. src/components/login/ConfirmAccountLinking.tsx
git checkout --theirs src/components/login/ConfirmAccountLinking.tsx

# 4. src/components/login/SelectPrimaryAccount.tsx
git checkout --theirs src/components/login/SelectPrimaryAccount.tsx

# 5. src/components/login/accountLinkingShared.tsx
git checkout --theirs src/components/login/accountLinkingShared.tsx

# 6. src/components/sections/AIChatSection.tsx
git checkout --ours src/components/sections/AIChatSection.tsx

# 7. src/components/spark/SparkAiForwardHero.tsx
git checkout --ours src/components/spark/SparkAiForwardHero.tsx

# 8. src/components/ui/ai-chat-input.tsx
git checkout --ours src/components/ui/ai-chat-input.tsx

# 10. src/pages/HomePagePartnerSafe.tsx
git checkout --ours src/pages/HomePagePartnerSafe.tsx

# 11. src/pages/Login.tsx
git checkout --theirs src/pages/Login.tsx

# 12. src/pages/app/AppHome.tsx
git checkout --ours src/pages/app/AppHome.tsx

# 13. src/routes.tsx
git checkout --theirs src/routes.tsx
