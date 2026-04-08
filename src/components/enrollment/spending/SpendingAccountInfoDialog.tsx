
import { WexDialog } from "@wex/components-react/overlays";
import { WexButton } from "@wex/components-react/actions";
import { WexSeparator } from "@wex/components-react/layout";
import type { SpendingAccountId } from "@/lib/spendingAccountsStorage";

type AccountInfo = {
  title: string;
  subtitle: string;
  body: string;
};

const ACCOUNT_INFO: Record<SpendingAccountId, AccountInfo> = {
  hsa: {
    title: "HSA",
    subtitle: "Health Savings Account",
    body: "A Health Savings Account lets you set aside pre-tax money for qualified healthcare expenses, including doctor visits, prescriptions, and other eligible medical costs. To enroll, you must be covered by a qualified high-deductible health plan. Your balance rolls over from year to year, and the account stays with you even if you change jobs or health plans.",
  },
  fsa: {
    title: "FSA",
    subtitle: "Flexible Spending Account",
    body: "A Flexible Spending Account lets you contribute pre-tax money from your paycheck to pay for eligible out-of-pocket healthcare expenses, such as copays, prescriptions, and certain medical, dental, and vision services. FSAs are typically tied to the plan year, so unused funds may not fully roll over depending on your employer's plan rules.",
  },
  lpfsa: {
    title: "LPFSA",
    subtitle: "Limited Purpose Flexible Spending Account",
    body: "A Limited Purpose Flexible Spending Account is similar to an FSA, but it can only be used for eligible dental and vision expenses. This type of account is often paired with an HSA because it helps you save on those expenses while preserving HSA eligibility.",
  },
  dcfsa: {
    title: "DCFSA",
    subtitle: "Dependent Care Flexible Spending Account",
    body: "A Dependent Care Flexible Spending Account lets you use pre-tax money for eligible dependent care expenses, such as daycare, preschool, before- and after-school care, or care for an adult dependent. It can help reduce the cost of care you need so you can work or attend school.",
  },
  hra: {
    title: "HRA",
    subtitle: "Health Reimbursement Arrangement",
    body: "A Health Reimbursement Arrangement is an employer-funded account that helps reimburse eligible healthcare expenses. You do not contribute your own money to this account — only your employer funds it. Reimbursement rules and eligible expenses vary by plan, so the amount you can use depends on your employer's program.",
  },
};

type SpendingAccountInfoDialogProps = {
  accountId: SpendingAccountId | null;
  onClose: () => void;
};

export function SpendingAccountInfoDialog({
  accountId,
  onClose,
}: SpendingAccountInfoDialogProps) {
  const info = accountId ? ACCOUNT_INFO[accountId] : null;

  return (
    <WexDialog open={accountId !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <WexDialog.Content size="md" className="p-0 overflow-hidden gap-0" aria-describedby={undefined}>
        {info && (
          <>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 pr-14">
              <WexDialog.Header>
                <WexDialog.Title className="text-[20px] font-bold leading-7 tracking-[-0.3px]">
                  {info.title}
                </WexDialog.Title>
                <p className="text-[13px] leading-5 text-muted-foreground mt-0.5">
                  {info.subtitle}
                </p>
              </WexDialog.Header>
            </div>

            <WexSeparator />

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-[14px] leading-6 tracking-[-0.084px] text-foreground">
                {info.body}
              </p>
            </div>

            <WexSeparator />

            {/* Footer */}
            <div className="px-6 py-4 flex justify-end">
              <WexButton
                variant="outline"
                intent="secondary"
                onClick={onClose}
              >
                Close
              </WexButton>
            </div>
          </>
        )}
      </WexDialog.Content>
    </WexDialog>
  );
}