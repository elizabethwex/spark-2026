import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation";
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground";
import { useReimbursement } from "./ReimbursementContext";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Alert,
  AlertDescription,
  Separator,
  Label,
  Badge,
} from "@wexinc-healthbenefits/ben-ui-kit";
import { Info, Upload, ExternalLink, X, FileText, Check } from "lucide-react";

export default function ReimburseDocs() {
  const navigate = useNavigate();
  const { state, updateState } = useReimbursement();
  const [autoAnalyze, setAutoAnalyze] = useState(state.autoAnalyze ?? true);
  const [uploads, setUploads] = useState<Array<{ name: string; size: string; status: "uploaded"; date: string }>>(
    (state.uploadedFiles || []).map((file) => ({ ...file, status: file.status ?? "uploaded" }))
  );

  const hasUploads = uploads.length > 0;

  const handleRemove = (name: string) => {
    const newUploads = uploads.filter((file) => file.name !== name);
    setUploads(newUploads);
    updateState({ uploadedFiles: newUploads });
  };

  const handleMockUpload = () => {
    // Mock upload - add a file when button is clicked
    const newFile = { name: "Document.pdf", size: "184 KB", status: "uploaded" as const, date: "Jan 16" };
    const newUploads = [...uploads, newFile];
    setUploads(newUploads);
    updateState({ uploadedFiles: newUploads });
  };

  const handleNext = () => {
    updateState({ autoAnalyze });
    if (autoAnalyze) {
      navigate("/reimburse/analyze");
    } else {
      navigate("/reimburse/review");
    }
  };

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />

      <div className="mx-auto max-w-[1440px] px-8 py-8">
        <div className="mx-auto max-w-[1376px] space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Reimburse Myself</h1>

          <Card>
            <CardContent className="space-y-8 p-6 md:p-8">
              <div>
                <p className="text-sm font-semibold text-foreground">Available Balance</p>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    Medical FSA
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xl font-semibold text-foreground">$2,734.76</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-foreground">Supporting documentation</h2>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>

                <Button
                  intent="primary"
                  variant="link"
                  className="flex items-center gap-1 text-sm font-medium h-auto p-0"
                >
                  What information is required? <ExternalLink className="h-3.5 w-3.5" />
                </Button>

                <div className="rounded-lg border border-dashed bg-card p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Button intent="secondary" className="min-w-[200px]" onClick={handleMockUpload}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Valid Documentation
                      </Button>
                    </div>
                  </div>
                  {!hasUploads ? (
                    <p className="mt-3 text-sm text-muted-foreground">Drag and drop files here to upload.</p>
                  ) : (
                    <div className="mt-4 space-y-2">
                      {uploads.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center justify-between rounded-lg border bg-muted px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium text-foreground">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {file.size} • Added {file.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge intent="success" className="flex items-center gap-1 text-xs">
                              <Check className="h-3.5 w-3.5" />
                              Uploaded
                            </Badge>
                            <Button variant="ghost" size="sm" onClick={() => handleRemove(file.name)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="auto-analyze"
                      checked={autoAnalyze}
                      onCheckedChange={(checked) => setAutoAnalyze(Boolean(checked))}
                    />
                    <Label htmlFor="auto-analyze" className="flex items-center gap-1 text-sm text-foreground">
                      Auto-analyze my claims info <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We are unable to auto-analyze multiple documents.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button variant="ghost" onClick={() => navigate("/")}>
                    Cancel
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button intent="secondary" onClick={() => navigate("/reimburse")}>
                      Previous
                    </Button>
                    <Button intent="primary" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert intent="default" className="bg-transparent p-0 text-xs text-muted-foreground">
            <AlertDescription>
              We collect information about the use of this portal (for example, how long you are on the
              portal, the pages you visit, etc.) so that we can understand and improve user experience.
              For more information about our privacy practices, click here.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

