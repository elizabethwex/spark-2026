# Recent Changes — ngb-enrollment & spark-2026

## April 17, 2026

### Lint Cleanup — ngb-enrollment branch
- Removed unused `POST_ENROLLMENT_MODES` constant from `PrototypeToggle.tsx`
- Prefixed unused `hasSubmission` prop with `_` in `PrototypeToggle.tsx` to satisfy ESLint
- Removed unused `Sparkles` import from `DecisionSupportOptInPage.tsx`
- Removed unused `Sparkles` import from `EnrollmentHomePage.tsx`
- Removed unused `Sparkles` import and `BRAND_LINEAR_GRADIENT` constant from `EnrollmentLayout.tsx`
- All 6 `@typescript-eslint/no-unused-vars` errors resolved; ESLint exits clean (0 errors)

### Spark — AnimatedNumber Fixes (`abb1160`, `5841960`)
- Restored count-up animation on homepage account card balances (`SparkAccountsSection`)
- Added missing `fmtUsd` and `parseUsd` helper functions required by `AnimatedNumber` component

### Enrollment — Account Cards & Progress (`9260e1d`)
- Updated enrollment account cards with progress bars showing YTD spend vs. election
- Added filing period and contribution deadline details to each spending account card

### Enrollment — UI Flow & Component Updates (`6730c98`)
- Updated enrollment UI flow routing and step sequencing
- Polished `EnrollmentLayout`, stepper navigation, and footer action bar
- Added `DecisionSupportOptInPage` for AI-assisted plan recommendation opt-in
- Added `PlansCheckpointPage`, `SpendingAccountsCheckpointPage`, and `ReviewSubmitPage`
- Added `AccidentInsurancePage` and `HospitalIndemnityPage` for voluntary benefits
- Added `BeneficiariesPage` and `DependentsPage` with modal flows (`AddBeneficiaryModal`, `AddDependentModal`)
- Added `EnrollmentStatementPage` for final submission confirmation
- Updated `PlanCard` with improved selection UX and disabled-state handling
- Updated `AccountSelectCard` with election amount input and rules acknowledgment
- Added `AssistantIQHero` component to `EnrollmentHomePage` post-enrollment view

---

## Prior Commits (ngb-enrollment branch history)

| SHA | Description |
|-----|-------------|
| `0a869b5` | Merge main, resolve conflicts, fix unused variables, and add recent changes log |
| `db8aa47` | Merge pull request #70 — FSA button update |
| `1cfb02c` | fix: update FSA store promo banner text and URL |
| `917598b` | Merge pull request #69 — delight effects |
| `62c68f2` | feat: add delight effects and polish UI components |
| `2bb45ff` | Merge pull request #68 — app profile update |
| `3110daf` | fix: remove unused navigate variable |
| `abc8329` | feat: updates to mobile UI and AI AssistIQ |
| `11f190c` | fix(spark): link Healthcare FSA View Details to /fsa-account |
| `bd490f4` | fix(app): stabilize Messages scroll and mobile list padding |
| `0b24fb2` | Merge pull request #63 — Wexly use cases |
| `11cf1e5` | fix(message-center): restore primary active state on sidebar nav |
| `921d870` | fix: remove unused isDenied var, let → const for formatDateOfService |
| `953048f` | Tie document library to claims, add letters tab, and claims page polish |
| `ae8abd4` | Persist state across refresh and add AssistIQ to partner-safe home |
| `517ce45` | Update AssistIQ modal, TaskCardStack, and add UploadFlowComponents |
| `08e02f4` | feat: add floating sparkle button to resume pending chat |
| `4ed64be` | feat: spark accounts nav, app shell chrome, FSA route, profile dependents |
