/** Home nav row: 56px content + 8px bottom padding in AppNavBar */
export const APP_NAV_HOME_INNER_H = 64;

/** Standard page nav inner row height */
export const APP_NAV_PAGE_INNER_H = 52;

/** Bottom padding for scrollable list regions so the last row clears the fixed AppTabBar. */
export const APP_TABBAR_END_SCROLL_PADDING =
  "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px) + 16px)";

/**
 * Real-mobile {@link AppShell} already wraps the outlet with tab bar + safe-area bottom padding.
 * Use this for in-page list padding only so the last row is not double-offset.
 */
export const APP_LIST_SCROLL_END_PADDING_MOBILE = "16px";
