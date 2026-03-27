import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from '@wexinc-healthbenefits/ben-ui-kit'
// Kit styles first; local tokens last so design-tokens.json output wins for :root / .dark variables.
import './index.css'
import '@wex/design-tokens'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProviders
        defaultTheme="light"
        enableSystem={false}
        storageKey="ben-ui-kit-theme"
      >
        <App />
      </AppProviders>
    </BrowserRouter>
  </StrictMode>,
)
