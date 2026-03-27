import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { useReimbursement } from "./ReimbursementContext";
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Checkbox,
  Alert,
  Separator,
  Label,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { Info, Pencil, ShoppingCart, CheckCircle2, X, ChevronDown, ChevronRight } from "lucide-react";

export default function ReimburseConfirm() {
  const navigate = useNavigate();
  const { state, updateState } = useReimbursement();
  const [acceptedTerms, setAcceptedTerms] = useState(state.acceptedTerms || false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const handleSubmit = () => {
    if (acceptedTerms) {
      setShowSuccessBanner(true);
      updateState({ acceptedTerms: true });
    }
  };

  const toggleRow = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  // Get form data from state
  const accountLabel = state.account === "medical-fsa" ? "Medical FSA" : state.account === "dependent-care-fsa" ? "Dependent Care FSA" : "HSA";
  const recipientLabel = state.category === "me" ? "Me" : state.category === "provider" ? "Provider" : "Dependent";
  const expenseLabel = state.category || "Office Visit";
  const amount = state.amount || "$150.00";
  const approvedAmount = amount;

  return (
    <div className="min-h-screen bg-[#F1FAFE]">
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[1376px] space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-foreground">Reimburse Myself</h1>
          </div>

          {showSuccessBanner && (
            <Alert intent="success" className="w-full">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="text-success font-semibold text-sm mb-1">Claim Approved!</div>
                    <div className="text-foreground text-sm">
                      Great news! Your claim has been approved. You will be paid out according to account setup.
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 text-success hover:text-success hover:bg-success/10 shrink-0"
                  onClick={() => setShowSuccessBanner(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Alert>
          )}

          <Card>
            <CardContent className="space-y-8 p-6 md:p-8">
              <div>
                <p className="text-sm font-semibold text-foreground">Available Balance</p>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    Medical FSA <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-semibold text-foreground">$2,734.76</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">Transaction Summary</h2>
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-medium">From</TableHead>
                        <TableHead className="text-xs font-medium">To</TableHead>
                        <TableHead className="text-xs font-medium">Expense</TableHead>
                        <TableHead className="text-right text-xs font-medium">Amount</TableHead>
                        <TableHead className="text-right text-xs font-medium">Approved Amount</TableHead>
                        {!showSuccessBanner && (
                          <TableHead className="text-right text-xs font-medium">Actions</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <>
                        <TableRow>
                          <TableCell>
                            <Button
                              variant="ghost"
                              onClick={() => toggleRow("claim-1")}
                              className="flex items-center gap-2 hover:opacity-80 transition-opacity h-auto p-0"
                            >
                              {expandedRow === "claim-1" ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span>{accountLabel}</span>
                            </Button>
                          </TableCell>
                          <TableCell>{recipientLabel}</TableCell>
                          <TableCell>{expenseLabel}</TableCell>
                          <TableCell className="text-right">{amount}</TableCell>
                          <TableCell className="text-right">{approvedAmount}</TableCell>
                          {!showSuccessBanner && (
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-3">
                                <Button intent="primary" variant="link" className="text-xs h-auto p-0 text-destructive hover:underline">
                                  Remove
                                </Button>
                                <Button intent="secondary" size="sm" className="h-7 px-3">
                                  <Pencil className="h-3.5 w-3.5" />
                                  Edit
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                        {expandedRow === "claim-1" && (
                          <TableRow>
                            <TableCell colSpan={showSuccessBanner ? 5 : 6} className="bg-muted">
                              <div className="px-4 py-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground mb-1">Provider</p>
                                    <p className="font-medium text-foreground">{state.provider || "Dr. Jorge Doe"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1">Date of Service</p>
                                    <p className="font-medium text-foreground">{state.serviceDate || "06/20/2026"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1">Category</p>
                                    <p className="font-medium text-foreground">{state.category || "Medical"}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground mb-1">Type</p>
                                    <p className="font-medium text-foreground">Office Visit</p>
                                  </div>
                                  <div className="col-span-2">
                                    <p className="text-muted-foreground mb-1">Description</p>
                                    <p className="font-medium text-foreground">Office visit for routine checkup</p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    </TableBody>
                  </Table>
                </div>
                {!showSuccessBanner && (
                  <Button intent="secondary" className="w-fit">
                    + Add Another
                  </Button>
                )}
              </div>

              {!showSuccessBanner && (
                <>
                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-foreground">Claims Terms and Conditions</h3>
                    <Card>
                      <CardContent className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(checked) => {
                              const newValue = Boolean(checked);
                              setAcceptedTerms(newValue);
                              updateState({ acceptedTerms: newValue });
                            }}
                          />
                          <Label htmlFor="terms" className="text-sm text-foreground leading-relaxed">
                            I have read, understand, and agree to the{" "}
                            <Button intent="primary" variant="link" className="h-auto p-0 underline-offset-2">
                              Terms and Conditions
                            </Button>
                            .
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button intent="secondary" onClick={() => navigate("/reimburse/review")}>
                      Previous
                    </Button>
                    <div className="flex gap-3">
                      <Button variant="ghost">
                        <ShoppingCart className="h-4 w-4" />
                        Save for Later
                      </Button>
                      <Button variant="ghost" onClick={() => navigate("/")}>
                        Cancel
                      </Button>
                      <Button intent="primary" disabled={!acceptedTerms} onClick={handleSubmit}>
                        Submit
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

