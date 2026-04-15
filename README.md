# CXR-UX-WEX - Consumer Experience Application

A modern React application for WEX Health Benefits consumer experience, built with TypeScript, React 19, and the ben-ui-kit component library. This application provides a comprehensive interface for consumers to manage their health savings accounts (HSA), claims, reimbursements, messages, and profile information.

## 🚀 Features

- **HSA Management**: Enrollment, profile review, beneficiaries, and dependents management
- **Claims & Reimbursements**: View claims, submit reimbursements, and track reimbursement status
- **Message Center**: Secure messaging with filtering and pagination
- **Profile Management**: Update personal information, communication preferences, and account settings
- **Account Overview**: View account summaries, recent transactions, and account documents
- **Responsive Design**: Mobile-first approach with adaptive layouts

## 🛠️ Tech Stack

- **Framework**: React 19.2.0 with TypeScript
- **UI Components**: [@wexinc-healthbenefits/ben-ui-kit](https://www.npmjs.com/package/@wexinc-healthbenefits/ben-ui-kit) v0.3.4
- **Styling**: Tailwind CSS with design tokens
- **Routing**: React Router v7
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite 7
- **Icons**: Lucide React

## 📦 Key Dependencies

- `@wexinc-healthbenefits/ben-ui-kit` - Component library
- `@wex/design-tokens` - Design system tokens
- `react-router-dom` - Client-side routing
- `react-hook-form` - Form management
- `zod` - Schema validation
- `date-fns` - Date utilities
- `lucide-react` - Icon library

## 🏃 Getting Started

### Prerequisites

- Node.js (version specified in `.nvmrc` or via nvm)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/wex-benefits/cxr-ux.git

# Navigate to the project directory
cd CXR-UX-WEX

# Install dependencies
npm install
```

### Conference prototype (optional)

| Variable | Description |
|----------|-------------|
| `VITE_MOBILE_APP_FIGMA_URL` | URL for the mobile app prototype (Figma or other); opens in a new tab from the header and footer. If unset, a default design file URL is used. |

**Theme export JSON** (Appearance) may include `cardShadow` (`subtle` \| `medium` \| `elevated`), `cardBorder`, `aiAgent`, and legacy `cardShadow` values `flat` / `shadow` (auto-migrated on import). **Publish** saves to the portal prototype and reloads.

### Development

```bash
# Start the development server
npm run dev

# The application will be available at http://localhost:5175 (configured in vite.config.ts; another port if 5175 is in use)
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
  pages/                        # Route-level pages
    Login.tsx
    HomePage.tsx                 # Consumer dashboard
    fsa-account/FsaAccountPage.tsx
    MessageCenter.tsx
    MyProfile.tsx
    Claims.tsx
    Resources.tsx
    AccountDocuments.tsx
    hsa/                         # HSA enrollment flow pages
    reimburse/                   # Reimbursement flow pages
  components/
    layout/                      # Navigation and footer
      ConsumerNavigation.tsx
      Footer.tsx
    sections/                    # Dashboard sections (used by HomePage)
      AccountsSection.tsx
      AIChatSection.tsx
      MessageCenterWidget.tsx
      ...
    LightModeBoundary.tsx        # Light mode wrapper
    ProtectedRoute.tsx           # Auth-gated route wrapper
    ScrollToTop.tsx              # Scroll restoration
    UnderConstruction.tsx        # Placeholder for WIP pages
    QuestionOptionCard.tsx       # HSA question card
    ClaimDetailSheet.tsx         # Claim detail panel
    WexTag.tsx                   # Tag component
  context/
    AuthContext.tsx               # Authentication state
  hooks/
    use-mobile.tsx               # Mobile breakpoint hook
  lib/
    utils.ts                     # Utility functions (cn)
  requirements/
    theming-variables.md         # Theming contract (admin vars + system locks)
    uxt-theme-value-mapping.md   # UXT design guide summary (C1–C6, N, shadows, OKLCH)
  data/
    mockData.ts                  # Mock data for all pages
    messageCenterUtils.ts        # Message center helpers
  assets/
    construction-image.png
    empty-state-illustration.svg
  routes.tsx                     # Application routes
  App.tsx                        # Root component
  main.tsx                       # Entry point
  index.css                      # Global styles
packages/
  design-tokens/                 # WEX design tokens
```

## 🎨 Design System

This application uses **ben-ui-kit** and **@wex/design-tokens** for consistent styling:

- **Components**: All UI components come from `@wexinc-healthbenefits/ben-ui-kit`
- **Design Tokens**: Colors, spacing, and typography use design tokens
- **Accessibility**: Components meet WCAG 2.1 AA standards

### Component Usage

```tsx
import { Button, Card, Dialog, FloatLabel, Switch } from '@wexinc-healthbenefits/ben-ui-kit';
```

### Styling Guidelines

1. **Use Design Tokens**: Prefer design tokens over hardcoded values
2. **No Inline Styles**: Avoid inline `style` attributes
3. **No !important Overrides**: Do not use `!important` overrides on ben-ui-kit components
4. **Preserve Background Colors**: Specific background colors (e.g., `#F1FAFE`) are preserved for brand consistency

### Design Token Usage

```tsx
// ✅ Good - Using design tokens
<div className="bg-background text-foreground border-border">
  <Button variant="primary">Submit</Button>
</div>

// ❌ Avoid - Hardcoded colors
<div className="bg-[#F1FAFE] text-[#243746]">
```

### Form Handling

Forms use React Hook Form with Zod validation:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Vite |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## 🧩 Key Routes

| Route | Page |
|-------|------|
| `/` | Home / Dashboard |
| `/login` | Login |
| `/fsa-account` | FSA account dashboard |
| `/message-center` | Message Center |
| `/my-profile` | My Profile |
| `/claims` | Claims |
| `/resources` | Resources |
| `/account-documents` | Account Documents |
| `/reimburse/*` | Reimbursement Flow |
| `/hsa-enrollment/*` | HSA Enrollment Flow |

## 📚 Documentation

- [ben-ui-kit Documentation](https://github.com/wexinc-healthbenefits/ben-ui-kit) - Component library documentation
- [Design Tokens](./packages/design-tokens/README.md) - Design token reference

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes following the development guidelines
3. Ensure all tests pass
4. Submit a pull request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain accessibility standards
- Write self-documenting code

## 📄 License

This project is proprietary and confidential.

## 🔗 Related Projects

- [ben-ui-kit](https://github.com/wexinc-healthbenefits/ben-ui-kit) - Component library
- [Design Tokens](https://github.com/wexinc-healthbenefits/design-tokens) - Design system tokens

---

**Built with ❤️ by the WEX Health Benefits team**
