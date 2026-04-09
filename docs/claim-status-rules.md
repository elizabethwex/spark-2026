# Claim Status Rules

Canonical reference for how each claim status behaves across the Claims UI: badge color, table visibility, inline toast, "What Happens Next" timeline, and available actions.

---

## Global Conventions

### Timeline variants

Every claim originates in one of two ways, which determines the **first step** of its timeline:

| Variant | First step label | When used |
|---------|-----------------|-----------|
| **Card** | Card Payment | A WEX benefits card was swiped at point of sale |
| **Manual** | Claim Submitted | A claim was manually submitted in the portal or app |

In all timeline diagrams below, `[first step]` is a placeholder for whichever variant applies.

### "Now" indicator

- The **last step** in every active-state timeline is tagged **Now**.
- **Final states** (Denied, Paid) have **no Now tag** — the claim has reached its end state and no further progress is expected unless the member takes action (e.g. Appeal).

### Badge color palette

| Color | Semantic meaning | Statuses |
|-------|-----------------|----------|
| Red / Critical | Requires immediate action by the member | Documentation Needed, Repayment Due |
| Yellow / Warning | Noteworthy — limited or no member action available | Hold, Denied |
| Blue / Info | In progress — no action needed | Submitted, Documentation Review, Payment Processing |
| Green / Success | Positive resolution | Approved, Paid |
| Gray / Neutral | Draft — not yet in the claims pipeline | Not Submitted |

### Button variants reference

| Variant label | Usage |
|---------------|-------|
| `primary solid` | Primary call to action (Submit Claim, Upload Documentation, Repay) |
| `primary outline` | Secondary call to action with equal visual weight to destructive (Edit, Appeal on Repayment Due) |
| `secondary` | Low-emphasis action (Appeal on Denied) |
| `destructive outline` | Irreversible or negative action (Cancel Claim) |

### Inline toast structure

Toasts appear directly below the provider/amount header in the detail sheet. When a toast is present, the status badge and date are hidden — the toast itself conveys the status context.

Fields:

```
Headline
Subtext (date or contextual info)
Tag (optional — e.g. "28 Days Remaining")
────────────────────────────────────
Body copy
```

Statuses with a toast: Documentation Needed, Repayment Due, Hold, Denied.
Statuses without a toast show the status badge and date below the header as normal.

### Details tab fields

The Details tab shows the following fields for every claim, with no truncation:

| Field | Source | Notes |
|-------|--------|-------|
| Pay from | `account` | The FSA/HSA account the funds are drawn from |
| Pay to | `bankAccount` | Member's bank account on file (e.g. "Chase Checking ••••4523") |
| Recipient | `recipient` | Full name expanded from initials — ES → Emily Smith, JS → Julia Smith |
| Date of Service | `dateOfService` | As entered on the claim |
| Category & Type | `category — categoryType` | e.g. "Medical — Office Visit", "Dental — Dental Exam" |
| Provider | `provider` | Full provider/service name |
| Amount | `amount` | Claim amount |

---

## Status Reference

### 1. Not Submitted

> The claim has been started but not yet submitted. It exists only as a draft.

| Field | Value |
|-------|-------|
| Badge | Gray / Neutral |
| Tables | Drafts, All Claims |
| Toast | None |

**Timeline**

```
Claim Draft Created  [Now]
```

**Actions**

| Button | Variant |
|--------|---------|
| Edit | primary outline |
| Submit Claim | primary solid |

---

### 2. Submitted

> The claim has been submitted and is waiting to be reviewed.

| Field | Value |
|-------|-------|
| Badge | Blue / Info |
| Tables | In Progress, All Claims |
| Toast | None |

**Timeline**

```
[first step]  ──►  Under Review  [Now]
```

**Actions**

| Button | Variant |
|--------|---------|
| Cancel Claim | destructive outline |
| Upload Documentation | primary solid |

---

### 3. Approved

> The claim passed review and is preparing for payment.

| Field | Value |
|-------|-------|
| Badge | Green / Success |
| Tables | All Claims |
| Toast | None |

**Timeline**

```
[first step]  ──►  Reviewed  ──►  Approved  [Now]
                                  └─ Your claim is preparing for payment processing.
```

**Actions**

None.

---

### 4. Hold

> The claim has been paused pending internal review or additional information.

| Field | Value |
|-------|-------|
| Badge | Yellow / Warning |
| Tables | All Claims |
| Toast | See below |

**Toast**

```
Claim On Hold
Placed on hold [date]
────────────────────────────────────
[hold reason from system]
```

**Timeline**

```
[first step]  ──►  Under Review  ──►  Hold  [Now]
                                      └─ [hold reason]
```

**Actions**

None.

---

### 5. Documentation Needed

> The claim requires the member to upload supporting documentation before it can continue.

| Field | Value |
|-------|-------|
| Badge | Red / Critical |
| Tables | Action Required, All Claims |
| Toast | See below |

**Toast**

```
Documentation Needed
Requested [date]
Tag: [N] Days Remaining
────────────────────────────────────
Document is missing Date of Service. Please upload new documentation
that includes all required info.
```

**Timeline**

```
[first step]  ──►  Reviewed  ──►  Documentation Needed  [Now]
```

**Actions**

| Button | Variant |
|--------|---------|
| Cancel Claim | destructive outline |
| Upload Documentation | primary solid |

---

### 6. Documentation Review

> The member has uploaded documentation and it is now being reviewed.

| Field | Value |
|-------|-------|
| Badge | Blue / Info |
| Tables | All Claims |
| Toast | None |

**Timeline**

```
[first step]  ──►  Documentation Needed  ──►  Documentation Review  [Now]
```

**Actions**

| Button | Variant |
|--------|---------|
| Cancel Claim | destructive outline |
| Upload Documentation | primary solid |

---

### 7. Denied

> The claim has been reviewed and is not eligible under the member's plan. This is a final state.

| Field | Value |
|-------|-------|
| Badge | Yellow / Warning |
| Tables | All Claims |
| Toast | See below |

**Toast**

```
Claim Denied
Denied on [date]
Tag: [N] Days to Appeal
────────────────────────────────────
[denial reason from system]
```

**Timeline** *(no Now — final state)*

```
[first step]  ──►  Reviewed  ──►  Documentation Needed  ──►  Documentation Review  ──►  Denied
                                                                                          └─ [denial reason]
```

> The Denied step is rendered as complete (green/filled) rather than active, reflecting that the decision has been made.

**Actions**

The Appeal button is displayed inline beneath the Denied step in the timeline, not in the sheet footer.

| Button | Variant |
|--------|---------|
| Appeal | secondary |

---

### 8. Payment Processing

> The claim has been approved and payment is actively being processed. Manual-submit variant only — card payments skip directly to Paid once approved.

| Field | Value |
|-------|-------|
| Badge | Blue / Info |
| Tables | All Claims |
| Toast | None |

**Timeline** *(manual variant only)*

```
Claim Submitted  ──►  Reviewed  ──►  Approved  ──►  Payment Processing  [Now]
```

**Actions**

None.

---

### 9. Paid

> Payment has been issued. This is a final state.

| Field | Value |
|-------|-------|
| Badge | Green / Success |
| Tables | All Claims |
| Toast | None |

**Timeline** *(no Now — final state)*

```
[first step]  ──►  Reviewed  ──►  Approved  ──►  Payment Processing  ──►  Paid
```

**Actions**

None.

---

### 10. Repayment Due

> A previously approved and paid claim has been re-reviewed and deemed ineligible. The member must repay the disbursed amount.

| Field | Value |
|-------|-------|
| Badge | Red / Critical |
| Tables | Action Required, All Claims |
| Toast | See below |

**Toast**

```
Repayment Due
Requested [date]
Tag: [N] Days Remaining
────────────────────────────────────
Your previously approved claim has been reviewed and deemed ineligible
under your plan rules. Please repay the claim amount of [amount] by [date].
```

**Timeline**

```
[first step]  ──►  Reviewed  ──►  Approved  ──►  Payment Processing  ──►  Paid  ──►  Denied  ──►  Repayment Due  [Now]
                                                                                      └─ [denial reason]           └─ Repay [amount] by [date]
```

**Actions**

| Button | Variant |
|--------|---------|
| Appeal | primary outline |
| Repay | primary solid |

> **Design / Engineering note — Repayment lifecycle:** A repayment obligation arises when a claim is paid out (or a card swipe is approved) but is later re-reviewed and found to be ineligible under plan rules. This is uncommon but is a real scenario in FSA/HSA claims adjudication. The Denied step in the Repayment Due timeline represents this re-review decision, not the original adjudication.

---

## Status Summary Table

| # | Status | Badge | Action Required | Drafts | In Progress | All Claims | Toast | Actions |
|---|--------|-------|:--------------:|:------:|:-----------:|:----------:|-------|---------|
| 1 | Not Submitted | Gray / Neutral | — | ✓ | — | ✓ | — | Edit, Submit Claim |
| 2 | Submitted | Blue / Info | — | — | ✓ | ✓ | — | Cancel Claim, Upload Documentation |
| 3 | Approved | Green / Success | — | — | — | ✓ | — | — |
| 4 | Hold | Yellow / Warning | — | — | — | ✓ | ✓ | — |
| 5 | Documentation Needed | Red / Critical | ✓ | — | — | ✓ | ✓ | Cancel Claim, Upload Documentation |
| 6 | Documentation Review | Blue / Info | — | — | — | ✓ | — | Cancel Claim, Upload Documentation |
| 7 | Denied | Yellow / Warning | — | — | — | ✓ | ✓ | Appeal |
| 8 | Payment Processing | Blue / Info | — | — | — | ✓ | — | — |
| 9 | Paid | Green / Success | — | — | — | ✓ | — | — |
| 10 | Repayment Due | Red / Critical | ✓ | — | — | ✓ | ✓ | Appeal, Repay |
