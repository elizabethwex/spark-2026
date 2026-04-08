export type LoginStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

/** Passed to `/login` via React Router to open the wizard at a given step (e.g. account linking). */
export type LoginRouteState = { initialStep?: LoginStep }
