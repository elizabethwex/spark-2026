# @wex/components-react

WEX Design System React components - theme-agnostic UI components built on Radix UI and shadcn/ui primitives.

## Architecture

WEX components wrap shadcn/ui components, which are built on Radix UI primitives. This layered approach means:

- **Radix UI** provides accessibility, keyboard navigation, and ARIA attributes
- **shadcn/ui** provides styled components with Tailwind CSS
- **WEX components** add WEX-specific branding, props, and features

**Important:** WEX components import UI components from your application's `src/components/ui/` directory (installed via shadcn CLI). This allows you to control Radix and shadcn versions independently.

## Installation

### 1. Install Packages

```bash
npm install @wex/components-react @wex/design-tokens
```

### 2. Install UI Components (shadcn/ui)

WEX components require shadcn/ui components to be installed in your application. Install them via shadcn CLI:

```bash
# Initialize shadcn (if not already done)
npx shadcn@latest init

# Install required UI components
npx shadcn@latest add button card dialog input select checkbox switch textarea label form
# ... add other components as needed
```

**What happens when you run `shadcn add`:**
1. ✅ **Component files** are copied to `src/components/ui/` (or your configured location)
2. ✅ **Radix UI dependencies** are automatically installed via npm
3. ✅ **Other dependencies** (like `class-variance-authority`, `clsx`, `tailwind-merge`) are automatically installed

**Example:** When you run `npx shadcn@latest add accordion`, it will:
- Copy `accordion.tsx` to `src/components/ui/accordion.tsx`
- Automatically run `npm install @radix-ui/react-accordion` for you
- The component file imports from `@radix-ui/react-accordion` (already installed)

### 3. Radix UI Dependencies (Automatic)

**Good news:** shadcn CLI automatically installs Radix UI dependencies when you add components. You don't need to manually install them!

However, if you want to control Radix versions or install them manually (e.g., before adding components):

```bash
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover \
  @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs \
  # ... install other @radix-ui packages as needed
```

**Note:** Check `@wex/components-react` peerDependencies for recommended Radix versions, but you can use newer versions if compatible. The shadcn CLI will install compatible versions automatically.

### 4. Configure Path Aliases

**Critical:** `@wex/components-react` imports shadcn/ui components using the `@/components/ui/*` path alias. You must configure this alias in both TypeScript and your bundler to point to wherever you install shadcn components.

#### Understanding the Path Alias

`@wex/components-react` imports from `@/components/ui/*`. This path resolves based on your `@/*` alias configuration:

- **Default (shadcn CLI):** `@/*` → `./src/*` means `@/components/ui/*` → `./src/components/ui/*`
- **Custom location:** If you install shadcn to `lib/components/ui/`, configure `@/*` → `./lib/*` so `@/components/ui/*` → `./lib/components/ui/*`
- **Root-level:** If you install to `components/ui/`, configure `@/*` → `./` so `@/components/ui/*` → `./components/ui/*`

**Key point:** As long as `@/components/ui/*` resolves to your shadcn installation location via the `@/*` alias, it will work regardless of where you install shadcn.

#### TypeScript Configuration

shadcn CLI automatically configures path aliases, but verify your `tsconfig.json` matches where you installed components:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // Adjust this to match your shadcn installation location
    }
  }
}
```

**Examples for different installation locations:**
- Components in `src/components/ui/`: `"@/*": ["./src/*"]` ✅ (default)
- Components in `lib/components/ui/`: `"@/*": ["./lib/*"]`
- Components in `components/ui/`: `"@/*": ["./"]`
- Components in `app/components/ui/`: `"@/*": ["./app/*"]`

#### Bundler Configuration

Configure the same alias in your bundler (Vite, Webpack, etc.):

```typescript
// vite.config.ts
import path from 'path';

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Match your tsconfig path
    },
  },
};
```

**Why this matters:** `@wex/components-react` imports from `@/components/ui/*`, which resolves to wherever you installed shadcn components. This allows you to control shadcn and Radix UI versions independently and install components in any location you prefer.

### 5. Import Theme CSS

In your main entry file (e.g., `main.tsx` or `index.tsx`):

```tsx
// Import the WEX theme (required for components to be styled)
import '@wex/design-tokens/css';

// Your app
import App from './App';
```

### 6. Configure Tailwind

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import wexComponentsPreset from '@wex/components-react/tailwind-preset';
import wexDesignTokensPreset from '@wex/design-tokens/tailwind-preset';

export default {
  presets: [wexDesignTokensPreset, wexComponentsPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Include the component library source for Tailwind to scan
    './node_modules/@wex/components-react/**/*.{ts,tsx}',
  ],
} satisfies Config;
```

### 7. Use Components

```tsx
import { WexButton, WexInput, WexCard, WexDialog } from '@wex/components-react';

function MyForm() {
  return (
    <WexCard>
      <WexCard.Header>
        <WexCard.Title>Contact Form</WexCard.Title>
      </WexCard.Header>
      <WexCard.Content>
        <WexInput placeholder="Enter your name" />
        <WexButton intent="primary">Submit</WexButton>
      </WexCard.Content>
    </WexCard>
  );
}
```

## How It Works

### Import Resolution Flow

1. **WEX components** import from `@/components/ui/*` (path alias)
   - Example: `import { Button } from "@/components/ui/button"`
2. **Your bundler resolves** `@/components/ui/*` → `src/components/ui/*` (your app's shadcn components)
   - This happens via the `@/*` → `./src/*` alias you configured
3. **ShadCn UI components** import from `@radix-ui/*` (installed automatically by shadcn CLI)
   - Example: `import * as AccordionPrimitive from "@radix-ui/react-accordion"`
   - These Radix packages are installed in your app's `node_modules` when you run `shadcn add`
4. **Everything builds together** in your application

**The complete dependency chain:**
- `@wex/components-react` → imports from → `@/components/ui/*` (shadcn components)
- `@/components/ui/*` → imports from → `@radix-ui/*` (Radix primitives, auto-installed)
- `@radix-ui/*` → provides → accessibility, keyboard navigation, ARIA attributes

### Path Alias Configuration

**In this monorepo (development):**
- Root `tsconfig.json`: `@/*` → `./src/*`
- `packages/wex-components-react/tsconfig.json`: `baseUrl: "../.."`, `@/*` → `./src/*` (relative to repo root)
- `@/components/ui/*` resolves via `@/*` → `./src/components/ui/*`

**In consuming applications:**
- `tsconfig.json`: `@/*` → `[your-shadcn-installation-root]` (required)
  - Default: `@/*` → `./src/*` (if shadcn installed to `src/components/ui/`)
  - Custom: `@/*` → `./lib/*` (if shadcn installed to `lib/components/ui/`)
  - Root: `@/*` → `./` (if shadcn installed to `components/ui/`)
- Bundler config: `@` → `[same-path-as-tsconfig]` (required)
- `@/components/ui/*` automatically resolves via the `@/*` alias to wherever shadcn is installed

**Important:** 
- You only need `@/*` → `[your-installation-root]`. The `@/components/ui/*` path is automatically covered by the `@/*` wildcard alias.
- The `@/*` alias must point to the directory that contains your `components/ui/` folder (or wherever you configured shadcn to install).
- If you customize shadcn's installation location via `components.json`, adjust your `@/*` alias accordingly.

This architecture gives you:
- ✅ Full control over Radix UI versions
- ✅ Ability to customize UI components (they're in your repo)
- ✅ Standard shadcn/ui pattern
- ✅ WEX branding and features on top

## Component Categories

### Form Components
- `WexInput` - Text input field
- `WexTextarea` - Multi-line text input
- `WexCheckbox` - Checkbox control
- `WexSwitch` - Toggle switch
- `WexSlider` - Range slider
- `WexRadioGroup` - Radio button group
- `WexSelect` - Dropdown select
- `WexCombobox` - Searchable select with autocomplete
- `WexDatePicker` - Date selection
- `WexCalendar` - Calendar display
- `WexInputOTP` - One-time password input
- `WexInputGroup` - Input with addons
- `WexField` - Form field wrapper with label/error
- `WexForm` - Form container with validation

### Button Components
- `WexButton` - Primary action button with intents (primary, secondary, destructive, success, info, warning, help, contrast, ghost, outline, link)
- `WexButtonGroup` - Group of related buttons
- `WexToggle` - Toggle button
- `WexToggleGroup` - Group of toggle buttons

### Overlay Components
- `WexDialog` - Modal dialog
- `WexAlertDialog` - Confirmation dialog
- `WexSheet` - Side panel overlay
- `WexDrawer` - Bottom/side drawer
- `WexPopover` - Floating content
- `WexTooltip` - Hover tooltip
- `WexHoverCard` - Rich hover content

### Menu Components
- `WexDropdownMenu` - Dropdown menu
- `WexContextMenu` - Right-click menu
- `WexMenubar` - Application menubar
- `WexNavigationMenu` - Navigation links
- `WexCommand` - Command palette

### Layout Components
- `WexCard` - Content container
- `WexTable` - Data table
- `WexDataTable` - Advanced data table with sorting/filtering
- `WexTabs` - Tabbed content
- `WexAccordion` - Collapsible sections
- `WexSeparator` - Visual divider
- `WexScrollArea` - Scrollable container
- `WexResizable` - Resizable panels
- `WexAspectRatio` - Fixed aspect ratio container
- `WexCollapsible` - Collapsible content
- `WexSidebar` - Navigation sidebar

### Navigation Components
- `WexBreadcrumb` - Breadcrumb navigation
- `WexPagination` - Page navigation

### Display Components
- `WexAvatar` - User avatar
- `WexBadge` - Status badge
- `WexAlert` - Alert message
- `WexProgress` - Progress indicator
- `WexSkeleton` - Loading placeholder
- `WexSpinner` - Loading spinner
- `WexCarousel` - Image carousel
- `WexEmpty` - Empty state
- `WexItem` - List item
- `WexKbd` - Keyboard shortcut display

### Feedback Components
- `WexToaster` - Toast container
- `wexToast` - Toast notification function

### Data Visualization
- `WexChart` - Chart component (wraps Recharts)

## Requirements

### Required Setup

1. **UI Components**: Must be installed via shadcn CLI in `src/components/ui/`
2. **Path Alias**: `@/components/ui/*` must resolve to `./src/components/ui/*`
3. **Radix Packages**: Must be installed as peer dependencies (you control versions)
4. **Theme**: `@wex/design-tokens` CSS must be imported

### Why This Architecture?

- **Version Control**: You control Radix and shadcn versions independently
- **Customization**: UI components are in your repo, so you can modify them
- **Standard Pattern**: Follows shadcn/ui's standard installation pattern
- **Flexibility**: Update dependencies without waiting for package updates

## Theme Requirement

**Important:** Components are theme-agnostic and require a theme package to be styled.

Without importing a theme:
- Components will render with browser defaults
- Colors, spacing, and typography will be unstyled
- CSS variables like `--wex-primary` will be undefined

### Using the WEX Theme

```tsx
import '@wex/design-tokens/css';
```

### Creating a Custom Theme (White-Label)

1. Copy the `@wex/design-tokens` package
2. Rename to your brand (e.g., `@acme/design-tokens`)
3. Modify `tokens.css` with your brand colors
4. Components automatically use your new theme

## Peer Dependencies

This package requires:
- `react` ^18.0.0 or ^19.0.0
- `react-dom` ^18.0.0 or ^19.0.0
- `tailwindcss` ^3.4.0

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import { WexButton, type WexButtonProps } from '@wex/components-react';

const MyButton: React.FC<WexButtonProps> = (props) => (
  <WexButton {...props} />
);
```

## License

UNLICENSED - Internal WEX use only.

