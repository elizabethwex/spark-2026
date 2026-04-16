/** Home nav row: 56px content + 8px bottom padding in AppNavBar */
export const APP_NAV_HOME_INNER_H = 64;

/** Standard page nav inner row height */
export const APP_NAV_PAGE_INNER_H = 52;

/** Bottom padding for scrollable list regions so the last row clears the fixed AppTabBar. */
export const APP_TABBAR_END_SCROLL_PADDING =
  "calc(var(--app-tabbar-height, 95px) + env(safe-area-inset-bottom, 0px) + 16px)";
