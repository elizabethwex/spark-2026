/**
 * WEX Design Tokens - Tailwind CSS Preset
 * 
 * This preset provides WEX brand colors, typography, spacing, and animations
 * for use with Tailwind CSS. It's designed to work with shadcn/ui (React) 
 * and Spartan UI (Angular).
 * 
 * Usage:
 *   // tailwind.config.js
 *   const wexPreset = require("@wex/design-tokens/tailwind-preset");
 *   module.exports = {
 *     presets: [wexPreset],
 *     content: ["./src/**\/*.{js,ts,jsx,tsx,html}"],
 *   };
 * 
 * @see https://tailwindcss.com/docs/presets
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        
        // Brand
        brand: {
          red: "hsl(var(--brand-red) / <alpha-value>)",
        },
        
        // Card
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        
        // Popover
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        
        // Primary (interactive elements)
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          hover: "hsl(var(--primary-hover) / <alpha-value>)",
        },
        
        // Link (for text links)
        link: {
          DEFAULT: "hsl(var(--link) / <alpha-value>)",
          hover: "hsl(var(--link-hover) / <alpha-value>)",
          active: "hsl(var(--link-active) / <alpha-value>)",
        },
        
        // Secondary
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          hover: "hsl(var(--secondary-hover) / <alpha-value>)",
        },
        
        // Muted (subtle backgrounds, disabled states)
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        
        // Accent (hover states, highlights)
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        
        // Destructive (errors, delete actions)
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          hover: "hsl(var(--destructive-hover) / <alpha-value>)",
        },
        
        // Success
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
          hover: "hsl(var(--success-hover) / <alpha-value>)",
        },
        
        // Warning
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
          hover: "hsl(var(--warning-hover) / <alpha-value>)",
        },
        
        // Info
        info: {
          DEFAULT: "hsl(var(--info) / <alpha-value>)",
          foreground: "hsl(var(--info-foreground) / <alpha-value>)",
          hover: "hsl(var(--info-hover) / <alpha-value>)",
        },
        
        // Borders & Inputs
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        
        // Sidebar
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          primary: "hsl(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "hsl(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
        },
        
        // Chart colors
        chart: {
          1: "hsl(var(--chart-1) / <alpha-value>)",
          2: "hsl(var(--chart-2) / <alpha-value>)",
          3: "hsl(var(--chart-3) / <alpha-value>)",
          4: "hsl(var(--chart-4) / <alpha-value>)",
          5: "hsl(var(--chart-5) / <alpha-value>)",
        },

        // ============================================================
        // WEX Component Slot Utilities (Layer 3)
        // ============================================================
        wex: {
          button: {
            primary: {
              bg: "hsl(var(--wex-component-button-primary-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-primary-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-button-primary-border) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-primary-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-primary-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-primary-focus-ring) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-primary-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-primary-disabled-fg) / <alpha-value>)",
              "disabled-border": "hsl(var(--wex-component-button-primary-disabled-border) / <alpha-value>)",
              "outline-fg": "hsl(var(--wex-component-button-primary-outline-fg) / <alpha-value>)",
              "outline-border": "hsl(var(--wex-component-button-primary-outline-border) / <alpha-value>)",
              "outline-hover-bg": "hsl(var(--wex-component-button-primary-outline-hover-bg) / <alpha-value>)",
              "outline-active-bg": "hsl(var(--wex-component-button-primary-outline-active-bg) / <alpha-value>)",
              "outline-disabled-fg": "hsl(var(--wex-component-button-primary-outline-disabled-fg) / <alpha-value>)",
              "outline-disabled-border": "hsl(var(--wex-component-button-primary-outline-disabled-border) / <alpha-value>)",
            },
            secondary: {
              bg: "hsl(var(--wex-component-button-secondary-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-secondary-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-button-secondary-border) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-secondary-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-secondary-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-secondary-focus-ring) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-secondary-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-secondary-disabled-fg) / <alpha-value>)",
              "disabled-border": "hsl(var(--wex-component-button-secondary-disabled-border) / <alpha-value>)",
              "outline-fg": "hsl(var(--wex-component-button-secondary-outline-fg) / <alpha-value>)",
              "outline-border": "hsl(var(--wex-component-button-secondary-outline-border) / <alpha-value>)",
              "outline-hover-bg": "hsl(var(--wex-component-button-secondary-outline-hover-bg) / <alpha-value>)",
              "outline-active-bg": "hsl(var(--wex-component-button-secondary-outline-active-bg) / <alpha-value>)",
              "outline-disabled-fg": "hsl(var(--wex-component-button-secondary-outline-disabled-fg) / <alpha-value>)",
              "outline-disabled-border": "hsl(var(--wex-component-button-secondary-outline-disabled-border) / <alpha-value>)",
            },
            destructive: {
              bg: "hsl(var(--wex-component-button-destructive-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-destructive-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-button-destructive-border) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-destructive-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-destructive-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-destructive-focus-ring) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-destructive-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-destructive-disabled-fg) / <alpha-value>)",
              "disabled-border": "hsl(var(--wex-component-button-destructive-disabled-border) / <alpha-value>)",
              "outline-fg": "hsl(var(--wex-component-button-destructive-outline-fg) / <alpha-value>)",
              "outline-border": "hsl(var(--wex-component-button-destructive-outline-border) / <alpha-value>)",
              "outline-hover-bg": "hsl(var(--wex-component-button-destructive-outline-hover-bg) / <alpha-value>)",
              "outline-active-bg": "hsl(var(--wex-component-button-destructive-outline-active-bg) / <alpha-value>)",
              "outline-disabled-fg": "hsl(var(--wex-component-button-destructive-outline-disabled-fg) / <alpha-value>)",
              "outline-disabled-border": "hsl(var(--wex-component-button-destructive-outline-disabled-border) / <alpha-value>)",
            },
            tertiary: {
              fg: "hsl(var(--wex-component-button-tertiary-fg) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-tertiary-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-tertiary-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-tertiary-focus-ring) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-tertiary-disabled-fg) / <alpha-value>)",
            },
            success: {
              bg: "hsl(var(--wex-component-button-success-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-success-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-button-success-border) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-success-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-success-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-success-focus-ring) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-success-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-success-disabled-fg) / <alpha-value>)",
              "outline-fg": "hsl(var(--wex-component-button-success-outline-fg) / <alpha-value>)",
              "outline-border": "hsl(var(--wex-component-button-success-outline-border) / <alpha-value>)",
              "outline-hover-bg": "hsl(var(--wex-component-button-success-outline-hover-bg) / <alpha-value>)",
              "outline-active-bg": "hsl(var(--wex-component-button-success-outline-active-bg) / <alpha-value>)",
              "outline-disabled-fg": "hsl(var(--wex-component-button-success-outline-disabled-fg) / <alpha-value>)",
              "outline-disabled-border": "hsl(var(--wex-component-button-success-outline-disabled-border) / <alpha-value>)",
            },
            info: {
              bg: "hsl(var(--wex-component-button-info-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-info-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-button-info-border) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-info-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-info-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-info-focus-ring) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-info-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-info-disabled-fg) / <alpha-value>)",
              "outline-fg": "hsl(var(--wex-component-button-info-outline-fg) / <alpha-value>)",
              "outline-border": "hsl(var(--wex-component-button-info-outline-border) / <alpha-value>)",
              "outline-hover-bg": "hsl(var(--wex-component-button-info-outline-hover-bg) / <alpha-value>)",
              "outline-active-bg": "hsl(var(--wex-component-button-info-outline-active-bg) / <alpha-value>)",
              "outline-disabled-fg": "hsl(var(--wex-component-button-info-outline-disabled-fg) / <alpha-value>)",
              "outline-disabled-border": "hsl(var(--wex-component-button-info-outline-disabled-border) / <alpha-value>)",
            },
            warning: {
              bg: "hsl(var(--wex-component-button-warning-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-warning-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-button-warning-border) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-warning-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-warning-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-warning-focus-ring) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-warning-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-warning-disabled-fg) / <alpha-value>)",
              "outline-fg": "hsl(var(--wex-component-button-warning-outline-fg) / <alpha-value>)",
              "outline-border": "hsl(var(--wex-component-button-warning-outline-border) / <alpha-value>)",
              "outline-hover-bg": "hsl(var(--wex-component-button-warning-outline-hover-bg) / <alpha-value>)",
              "outline-active-bg": "hsl(var(--wex-component-button-warning-outline-active-bg) / <alpha-value>)",
              "outline-disabled-fg": "hsl(var(--wex-component-button-warning-outline-disabled-fg) / <alpha-value>)",
              "outline-disabled-border": "hsl(var(--wex-component-button-warning-outline-disabled-border) / <alpha-value>)",
            },
            help: {
              bg: "hsl(var(--wex-component-button-help-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-help-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-button-help-border) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-help-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-help-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-help-focus-ring) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-help-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-help-disabled-fg) / <alpha-value>)",
              "outline-fg": "hsl(var(--wex-component-button-help-outline-fg) / <alpha-value>)",
              "outline-border": "hsl(var(--wex-component-button-help-outline-border) / <alpha-value>)",
              "outline-hover-bg": "hsl(var(--wex-component-button-help-outline-hover-bg) / <alpha-value>)",
              "outline-active-bg": "hsl(var(--wex-component-button-help-outline-active-bg) / <alpha-value>)",
              "outline-disabled-fg": "hsl(var(--wex-component-button-help-outline-disabled-fg) / <alpha-value>)",
              "outline-disabled-border": "hsl(var(--wex-component-button-help-outline-disabled-border) / <alpha-value>)",
            },
            contrast: {
              bg: "hsl(var(--wex-component-button-contrast-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-button-contrast-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-button-contrast-border) / <alpha-value>)",
              "hover-bg": "hsl(var(--wex-component-button-contrast-hover-bg) / <alpha-value>)",
              "active-bg": "hsl(var(--wex-component-button-contrast-active-bg) / <alpha-value>)",
              "focus-ring": "hsl(var(--wex-component-button-contrast-focus-ring) / <alpha-value>)",
              "disabled-bg": "hsl(var(--wex-component-button-contrast-disabled-bg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-contrast-disabled-fg) / <alpha-value>)",
              "outline-fg": "hsl(var(--wex-component-button-contrast-outline-fg) / <alpha-value>)",
              "outline-border": "hsl(var(--wex-component-button-contrast-outline-border) / <alpha-value>)",
              "outline-hover-bg": "hsl(var(--wex-component-button-contrast-outline-hover-bg) / <alpha-value>)",
              "outline-active-bg": "hsl(var(--wex-component-button-contrast-outline-active-bg) / <alpha-value>)",
              "outline-disabled-fg": "hsl(var(--wex-component-button-contrast-outline-disabled-fg) / <alpha-value>)",
              "outline-disabled-border": "hsl(var(--wex-component-button-contrast-outline-disabled-border) / <alpha-value>)",
            },
            link: {
              fg: "hsl(var(--wex-component-button-link-fg) / <alpha-value>)",
              "hover-fg": "hsl(var(--wex-component-button-link-hover-fg) / <alpha-value>)",
              "active-fg": "hsl(var(--wex-component-button-link-active-fg) / <alpha-value>)",
              "disabled-fg": "hsl(var(--wex-component-button-link-disabled-fg) / <alpha-value>)",
            },
          },
          input: {
            bg: "hsl(var(--wex-component-input-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-input-fg) / <alpha-value>)",
            placeholder: "hsl(var(--wex-component-input-placeholder) / <alpha-value>)",
            border: "hsl(var(--wex-component-input-border) / <alpha-value>)",
            "border-hover": "hsl(var(--wex-component-input-border-hover) / <alpha-value>)",
            "border-focus": "hsl(var(--wex-component-input-border-focus) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-input-focus-ring) / <alpha-value>)",
            "disabled-bg": "hsl(var(--wex-component-input-disabled-bg) / <alpha-value>)",
            "disabled-fg": "hsl(var(--wex-component-input-disabled-fg) / <alpha-value>)",
            "disabled-border": "hsl(var(--wex-component-input-disabled-border) / <alpha-value>)",
          },
          floatlabel: {
            "label-fg": "hsl(var(--wex-component-floatlabel-label-fg) / <alpha-value>)",
            "label-focus-fg": "hsl(var(--wex-component-floatlabel-label-focus-fg) / <alpha-value>)",
            "label-filled-fg": "hsl(var(--wex-component-floatlabel-label-filled-fg) / <alpha-value>)",
          },
          select: {
            "trigger-bg": "hsl(var(--wex-component-select-trigger-bg) / <alpha-value>)",
            "trigger-fg": "hsl(var(--wex-component-select-trigger-fg) / <alpha-value>)",
            "trigger-border": "hsl(var(--wex-component-select-trigger-border) / <alpha-value>)",
            "trigger-focus-ring": "hsl(var(--wex-component-select-trigger-focus-ring) / <alpha-value>)",
            "content-bg": "hsl(var(--wex-component-select-content-bg) / <alpha-value>)",
            "item-hover-bg": "hsl(var(--wex-component-select-item-hover-bg) / <alpha-value>)",
            "item-selected-bg": "hsl(var(--wex-component-select-item-selected-bg) / <alpha-value>)",
            "item-selected-fg": "hsl(var(--wex-component-select-item-selected-fg) / <alpha-value>)",
          },
          table: {
            "header-bg": "hsl(var(--wex-component-table-header-bg) / <alpha-value>)",
            "header-fg": "hsl(var(--wex-component-table-header-fg) / <alpha-value>)",
            "row-bg": "hsl(var(--wex-component-table-row-bg) / <alpha-value>)",
            "row-alt-bg": "hsl(var(--wex-component-table-row-alt-bg) / <alpha-value>)",
            "row-hover-bg": "hsl(var(--wex-component-table-row-hover-bg) / <alpha-value>)",
            border: "hsl(var(--wex-component-table-border) / <alpha-value>)",
            "selected-bg": "hsl(var(--wex-component-table-selected-bg) / <alpha-value>)",
            "selected-fg": "hsl(var(--wex-component-table-selected-fg) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-table-focus-ring) / <alpha-value>)",
            "cell-fg": "hsl(var(--wex-component-table-cell-fg) / <alpha-value>)",
          },
          card: {
            bg: "hsl(var(--wex-component-card-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-card-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-card-border) / <alpha-value>)",
            "header-fg": "hsl(var(--wex-component-card-header-fg) / <alpha-value>)",
            "footer-fg": "hsl(var(--wex-component-card-footer-fg) / <alpha-value>)",
          },
          dialog: {
            bg: "hsl(var(--wex-component-dialog-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-dialog-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-dialog-border) / <alpha-value>)",
            "header-fg": "hsl(var(--wex-component-dialog-header-fg) / <alpha-value>)",
            "footer-fg": "hsl(var(--wex-component-dialog-footer-fg) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-dialog-focus-ring) / <alpha-value>)",
            "close-hover-bg": "hsl(var(--wex-component-dialog-close-hover-bg) / <alpha-value>)",
          },
          badge: {
            neutral: {
              bg: "hsl(var(--wex-component-badge-neutral-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-badge-neutral-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-badge-neutral-border) / <alpha-value>)",
            },
            info: {
              bg: "hsl(var(--wex-component-badge-info-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-badge-info-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-badge-info-border) / <alpha-value>)",
            },
            success: {
              bg: "hsl(var(--wex-component-badge-success-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-badge-success-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-badge-success-border) / <alpha-value>)",
            },
            warning: {
              bg: "hsl(var(--wex-component-badge-warning-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-badge-warning-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-badge-warning-border) / <alpha-value>)",
            },
            destructive: {
              bg: "hsl(var(--wex-component-badge-destructive-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-badge-destructive-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-badge-destructive-border) / <alpha-value>)",
            },
          },
          alert: {
            default: {
              bg: "hsl(var(--wex-component-alert-default-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-alert-default-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-alert-default-border) / <alpha-value>)",
              icon: "hsl(var(--wex-component-alert-default-icon) / <alpha-value>)",
            },
            info: {
              bg: "hsl(var(--wex-component-alert-info-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-alert-info-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-alert-info-border) / <alpha-value>)",
              icon: "hsl(var(--wex-component-alert-info-icon) / <alpha-value>)",
            },
            success: {
              bg: "hsl(var(--wex-component-alert-success-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-alert-success-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-alert-success-border) / <alpha-value>)",
              icon: "hsl(var(--wex-component-alert-success-icon) / <alpha-value>)",
            },
            warning: {
              bg: "hsl(var(--wex-component-alert-warning-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-alert-warning-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-alert-warning-border) / <alpha-value>)",
              icon: "hsl(var(--wex-component-alert-warning-icon) / <alpha-value>)",
            },
            destructive: {
              bg: "hsl(var(--wex-component-alert-destructive-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-alert-destructive-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-alert-destructive-border) / <alpha-value>)",
              icon: "hsl(var(--wex-component-alert-destructive-icon) / <alpha-value>)",
            },
          },
          toast: {
            info: {
              bg: "hsl(var(--wex-component-toast-info-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-toast-info-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-toast-info-border) / <alpha-value>)",
              icon: "hsl(var(--wex-component-toast-info-icon) / <alpha-value>)",
            },
            success: {
              bg: "hsl(var(--wex-component-toast-success-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-toast-success-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-toast-success-border) / <alpha-value>)",
              icon: "hsl(var(--wex-component-toast-success-icon) / <alpha-value>)",
            },
            destructive: {
              bg: "hsl(var(--wex-component-toast-destructive-bg) / <alpha-value>)",
              fg: "hsl(var(--wex-component-toast-destructive-fg) / <alpha-value>)",
              border: "hsl(var(--wex-component-toast-destructive-border) / <alpha-value>)",
              icon: "hsl(var(--wex-component-toast-destructive-icon) / <alpha-value>)",
            },
            "close-hover-bg": "hsl(var(--wex-component-toast-close-hover-bg) / <alpha-value>)",
          },
          tabs: {
            "trigger-fg": "hsl(var(--wex-component-tabs-trigger-fg) / <alpha-value>)",
            "trigger-hover-bg": "hsl(var(--wex-component-tabs-trigger-hover-bg) / <alpha-value>)",
            "trigger-active-fg": "hsl(var(--wex-component-tabs-trigger-active-fg) / <alpha-value>)",
            indicator: "hsl(var(--wex-component-tabs-indicator) / <alpha-value>)",
            divider: "hsl(var(--wex-component-tabs-divider) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-tabs-focus-ring) / <alpha-value>)",
          },
          checkbox: {
            bg: "hsl(var(--wex-component-checkbox-bg) / <alpha-value>)",
            border: "hsl(var(--wex-component-checkbox-border) / <alpha-value>)",
            "checked-bg": "hsl(var(--wex-component-checkbox-checked-bg) / <alpha-value>)",
            "checked-fg": "hsl(var(--wex-component-checkbox-checked-fg) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-checkbox-focus-ring) / <alpha-value>)",
          },
          radio: {
            bg: "hsl(var(--wex-component-radio-bg) / <alpha-value>)",
            border: "hsl(var(--wex-component-radio-border) / <alpha-value>)",
            "checked-bg": "hsl(var(--wex-component-radio-checked-bg) / <alpha-value>)",
            "checked-fg": "hsl(var(--wex-component-radio-checked-fg) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-radio-focus-ring) / <alpha-value>)",
          },
          switch: {
            bg: "hsl(var(--wex-component-switch-bg) / <alpha-value>)",
            "checked-bg": "hsl(var(--wex-component-switch-checked-bg) / <alpha-value>)",
            thumb: "hsl(var(--wex-component-switch-thumb) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-switch-focus-ring) / <alpha-value>)",
          },
          slider: {
            "track-bg": "hsl(var(--wex-component-slider-track-bg) / <alpha-value>)",
            "range-bg": "hsl(var(--wex-component-slider-range-bg) / <alpha-value>)",
            "thumb-bg": "hsl(var(--wex-component-slider-thumb-bg) / <alpha-value>)",
            "thumb-border": "hsl(var(--wex-component-slider-thumb-border) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-slider-focus-ring) / <alpha-value>)",
          },
          textarea: {
            bg: "hsl(var(--wex-component-textarea-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-textarea-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-textarea-border) / <alpha-value>)",
            placeholder: "hsl(var(--wex-component-textarea-placeholder) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-textarea-focus-ring) / <alpha-value>)",
          },
          inputotp: {
            bg: "hsl(var(--wex-component-inputotp-bg) / <alpha-value>)",
            border: "hsl(var(--wex-component-inputotp-border) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-inputotp-focus-ring) / <alpha-value>)",
            caret: "hsl(var(--wex-component-inputotp-caret) / <alpha-value>)",
          },
          progress: {
            "track-bg": "hsl(var(--wex-component-progress-track-bg) / <alpha-value>)",
            "indicator-bg": "hsl(var(--wex-component-progress-indicator-bg) / <alpha-value>)",
          },
          menu: {
            "content-bg": "hsl(var(--wex-component-menu-content-bg) / <alpha-value>)",
            "content-border": "hsl(var(--wex-component-menu-content-border) / <alpha-value>)",
            "item-fg": "hsl(var(--wex-component-menu-item-fg) / <alpha-value>)",
            "item-hover-bg": "hsl(var(--wex-component-menu-item-hover-bg) / <alpha-value>)",
            "item-focus-bg": "hsl(var(--wex-component-menu-item-focus-bg) / <alpha-value>)",
            separator: "hsl(var(--wex-component-menu-separator) / <alpha-value>)",
            "shortcut-fg": "hsl(var(--wex-component-menu-shortcut-fg) / <alpha-value>)",
          },
          menubar: {
            bg: "hsl(var(--wex-component-menubar-bg) / <alpha-value>)",
            border: "hsl(var(--wex-component-menubar-border) / <alpha-value>)",
            "trigger-hover-bg": "hsl(var(--wex-component-menubar-trigger-hover-bg) / <alpha-value>)",
            "trigger-focus-bg": "hsl(var(--wex-component-menubar-trigger-focus-bg) / <alpha-value>)",
          },
          navmenu: {
            "trigger-hover-bg": "hsl(var(--wex-component-navmenu-trigger-hover-bg) / <alpha-value>)",
            "trigger-focus-bg": "hsl(var(--wex-component-navmenu-trigger-focus-bg) / <alpha-value>)",
            "content-bg": "hsl(var(--wex-component-navmenu-content-bg) / <alpha-value>)",
            "link-hover-bg": "hsl(var(--wex-component-navmenu-link-hover-bg) / <alpha-value>)",
            indicator: "hsl(var(--wex-component-navmenu-indicator) / <alpha-value>)",
          },
          command: {
            bg: "hsl(var(--wex-component-command-bg) / <alpha-value>)",
            border: "hsl(var(--wex-component-command-border) / <alpha-value>)",
            "input-placeholder": "hsl(var(--wex-component-command-input-placeholder) / <alpha-value>)",
            "item-hover-bg": "hsl(var(--wex-component-command-item-hover-bg) / <alpha-value>)",
            "item-selected-bg": "hsl(var(--wex-component-command-item-selected-bg) / <alpha-value>)",
            separator: "hsl(var(--wex-component-command-separator) / <alpha-value>)",
            "group-heading": "hsl(var(--wex-component-command-group-heading) / <alpha-value>)",
            "empty-fg": "hsl(var(--wex-component-command-empty-fg) / <alpha-value>)",
          },
          sheet: {
            bg: "hsl(var(--wex-component-sheet-bg) / <alpha-value>)",
            border: "hsl(var(--wex-component-sheet-border) / <alpha-value>)",
            "close-hover-bg": "hsl(var(--wex-component-sheet-close-hover-bg) / <alpha-value>)",
          },
          drawer: {
            bg: "hsl(var(--wex-component-drawer-bg) / <alpha-value>)",
            border: "hsl(var(--wex-component-drawer-border) / <alpha-value>)",
            "handle-bg": "hsl(var(--wex-component-drawer-handle-bg) / <alpha-value>)",
          },
          alertdialog: {
            bg: "hsl(var(--wex-component-alertdialog-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-alertdialog-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-alertdialog-border) / <alpha-value>)",
            "action-bg": "hsl(var(--wex-component-alertdialog-action-bg) / <alpha-value>)",
            "action-fg": "hsl(var(--wex-component-alertdialog-action-fg) / <alpha-value>)",
            "cancel-bg": "hsl(var(--wex-component-alertdialog-cancel-bg) / <alpha-value>)",
            "cancel-fg": "hsl(var(--wex-component-alertdialog-cancel-fg) / <alpha-value>)",
          },
          toggle: {
            bg: "hsl(var(--wex-component-toggle-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-toggle-fg) / <alpha-value>)",
            "hover-bg": "hsl(var(--wex-component-toggle-hover-bg) / <alpha-value>)",
            "hover-fg": "hsl(var(--wex-component-toggle-hover-fg) / <alpha-value>)",
            "pressed-bg": "hsl(var(--wex-component-toggle-pressed-bg) / <alpha-value>)",
            "pressed-fg": "hsl(var(--wex-component-toggle-pressed-fg) / <alpha-value>)",
            "focus-ring": "hsl(var(--wex-component-toggle-focus-ring) / <alpha-value>)",
          },
          accordion: {
            border: "hsl(var(--wex-component-accordion-border) / <alpha-value>)",
            "trigger-fg": "hsl(var(--wex-component-accordion-trigger-fg) / <alpha-value>)",
            "trigger-hover-bg": "hsl(var(--wex-component-accordion-trigger-hover-bg) / <alpha-value>)",
            "icon-fg": "hsl(var(--wex-component-accordion-icon-fg) / <alpha-value>)",
          },
          pagination: {
            "item-bg": "hsl(var(--wex-component-pagination-item-bg) / <alpha-value>)",
            "item-fg": "hsl(var(--wex-component-pagination-item-fg) / <alpha-value>)",
            "item-hover-bg": "hsl(var(--wex-component-pagination-item-hover-bg) / <alpha-value>)",
            "active-bg": "hsl(var(--wex-component-pagination-active-bg) / <alpha-value>)",
            "active-fg": "hsl(var(--wex-component-pagination-active-fg) / <alpha-value>)",
          },
          breadcrumb: {
            "link-fg": "hsl(var(--wex-component-breadcrumb-link-fg) / <alpha-value>)",
            "link-hover-fg": "hsl(var(--wex-component-breadcrumb-link-hover-fg) / <alpha-value>)",
            "separator-fg": "hsl(var(--wex-component-breadcrumb-separator-fg) / <alpha-value>)",
            "current-fg": "hsl(var(--wex-component-breadcrumb-current-fg) / <alpha-value>)",
          },
          popover: {
            bg: "hsl(var(--wex-component-popover-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-popover-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-popover-border) / <alpha-value>)",
          },
          hovercard: {
            bg: "hsl(var(--wex-component-hovercard-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-hovercard-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-hovercard-border) / <alpha-value>)",
          },
          tooltip: {
            bg: "hsl(var(--wex-component-tooltip-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-tooltip-fg) / <alpha-value>)",
          },
          skeleton: {
            bg: "hsl(var(--wex-component-skeleton-bg) / <alpha-value>)",
          },
          separator: {
            bg: "hsl(var(--wex-component-separator-bg) / <alpha-value>)",
          },
          kbd: {
            bg: "hsl(var(--wex-component-kbd-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-kbd-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-kbd-border) / <alpha-value>)",
          },
          avatar: {
            bg: "hsl(var(--wex-component-avatar-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-avatar-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-avatar-border) / <alpha-value>)",
            "fallback-bg": "hsl(var(--wex-component-avatar-fallback-bg) / <alpha-value>)",
            "fallback-fg": "hsl(var(--wex-component-avatar-fallback-fg) / <alpha-value>)",
          },
          calendar: {
            bg: "hsl(var(--wex-component-calendar-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-calendar-fg) / <alpha-value>)",
            "header-fg": "hsl(var(--wex-component-calendar-header-fg) / <alpha-value>)",
            "nav-button-bg": "hsl(var(--wex-component-calendar-nav-button-bg) / <alpha-value>)",
            "nav-button-hover-bg": "hsl(var(--wex-component-calendar-nav-button-hover-bg) / <alpha-value>)",
            "day-fg": "hsl(var(--wex-component-calendar-day-fg) / <alpha-value>)",
            "day-hover-bg": "hsl(var(--wex-component-calendar-day-hover-bg) / <alpha-value>)",
            "day-selected-bg": "hsl(var(--wex-component-calendar-day-selected-bg) / <alpha-value>)",
            "day-selected-fg": "hsl(var(--wex-component-calendar-day-selected-fg) / <alpha-value>)",
            "day-today-bg": "hsl(var(--wex-component-calendar-day-today-bg) / <alpha-value>)",
            "day-today-fg": "hsl(var(--wex-component-calendar-day-today-fg) / <alpha-value>)",
            "day-outside-fg": "hsl(var(--wex-component-calendar-day-outside-fg) / <alpha-value>)",
            "day-disabled-fg": "hsl(var(--wex-component-calendar-day-disabled-fg) / <alpha-value>)",
            "day-range-bg": "hsl(var(--wex-component-calendar-day-range-bg) / <alpha-value>)",
            "day-range-fg": "hsl(var(--wex-component-calendar-day-range-fg) / <alpha-value>)",
          },
          "sidebar-component": {
            bg: "hsl(var(--wex-component-sidebar-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-sidebar-fg) / <alpha-value>)",
            border: "hsl(var(--wex-component-sidebar-border) / <alpha-value>)",
            "item-fg": "hsl(var(--wex-component-sidebar-item-fg) / <alpha-value>)",
            "item-hover-bg": "hsl(var(--wex-component-sidebar-item-hover-bg) / <alpha-value>)",
            "item-hover-fg": "hsl(var(--wex-component-sidebar-item-hover-fg) / <alpha-value>)",
            "item-active-bg": "hsl(var(--wex-component-sidebar-item-active-bg) / <alpha-value>)",
            "item-active-fg": "hsl(var(--wex-component-sidebar-item-active-fg) / <alpha-value>)",
            "header-fg": "hsl(var(--wex-component-sidebar-header-fg) / <alpha-value>)",
          },
          field: {
            "label-fg": "hsl(var(--wex-component-field-label-fg) / <alpha-value>)",
            "description-fg": "hsl(var(--wex-component-field-description-fg) / <alpha-value>)",
            "error-fg": "hsl(var(--wex-component-field-error-fg) / <alpha-value>)",
            "required-fg": "hsl(var(--wex-component-field-required-fg) / <alpha-value>)",
          },
          empty: {
            bg: "hsl(var(--wex-component-empty-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-empty-fg) / <alpha-value>)",
            "icon-fg": "hsl(var(--wex-component-empty-icon-fg) / <alpha-value>)",
            "title-fg": "hsl(var(--wex-component-empty-title-fg) / <alpha-value>)",
          },
          item: {
            bg: "hsl(var(--wex-component-item-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-item-fg) / <alpha-value>)",
            "hover-bg": "hsl(var(--wex-component-item-hover-bg) / <alpha-value>)",
            "hover-fg": "hsl(var(--wex-component-item-hover-fg) / <alpha-value>)",
            "selected-bg": "hsl(var(--wex-component-item-selected-bg) / <alpha-value>)",
            "selected-fg": "hsl(var(--wex-component-item-selected-fg) / <alpha-value>)",
            "disabled-fg": "hsl(var(--wex-component-item-disabled-fg) / <alpha-value>)",
          },
          inputgroup: {
            "addon-bg": "hsl(var(--wex-component-inputgroup-addon-bg) / <alpha-value>)",
            "addon-fg": "hsl(var(--wex-component-inputgroup-addon-fg) / <alpha-value>)",
            "addon-border": "hsl(var(--wex-component-inputgroup-addon-border) / <alpha-value>)",
          },
          "chart-component": {
            bg: "hsl(var(--wex-component-chart-bg) / <alpha-value>)",
            fg: "hsl(var(--wex-component-chart-fg) / <alpha-value>)",
            "grid-fg": "hsl(var(--wex-component-chart-grid-fg) / <alpha-value>)",
            "axis-fg": "hsl(var(--wex-component-chart-axis-fg) / <alpha-value>)",
            "tooltip-bg": "hsl(var(--wex-component-chart-tooltip-bg) / <alpha-value>)",
            "tooltip-fg": "hsl(var(--wex-component-chart-tooltip-fg) / <alpha-value>)",
            "tooltip-border": "hsl(var(--wex-component-chart-tooltip-border) / <alpha-value>)",
          },
          datatable: {
            "toolbar-bg": "hsl(var(--wex-component-datatable-toolbar-bg) / <alpha-value>)",
            "toolbar-fg": "hsl(var(--wex-component-datatable-toolbar-fg) / <alpha-value>)",
            "filter-bg": "hsl(var(--wex-component-datatable-filter-bg) / <alpha-value>)",
            "filter-border": "hsl(var(--wex-component-datatable-filter-border) / <alpha-value>)",
          },
          text: {
            success: "hsl(var(--wex-component-text-success) / <alpha-value>)",
            destructive: "hsl(var(--wex-component-text-destructive) / <alpha-value>)",
            info: "hsl(var(--wex-component-text-info) / <alpha-value>)",
            warning: "hsl(var(--wex-component-text-warning) / <alpha-value>)",
          },
        },
      },
      
      // Border radius
      borderRadius: {
        lg: "calc(var(--radius) + 2px)",
        md: "var(--radius)",
        sm: "calc(var(--radius) - 2px)",
      },
      
      // Typography
      fontFamily: {
        sans: ["var(--wex-font-sans)"],
        display: ["var(--wex-font-display)"],
      },
      
      // Accessibility: minimum touch target sizes (44px)
      minHeight: {
        target: "var(--wex-min-target)",
      },
      minWidth: {
        target: "var(--wex-min-target)",
      },
      
      // Animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    // Note: Consumer must install tailwindcss-animate separately
    // require("tailwindcss-animate"),
  ],
};
