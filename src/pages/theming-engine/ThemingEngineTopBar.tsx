import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Separator, toast } from "@wexinc-healthbenefits/ben-ui-kit";
import { RotateCcw, Download, FileUp } from "lucide-react";
import type { ThemingEngineFormValues, ThemingEngineExportPayload } from "./schema";
import { defaultThemingEngineValues, themingEngineImportSchema } from "./schema";
import { savePortalTheme } from "@/lib/portalTheme";

const EDITING_THEME_FOR = "Acme Corp (Employer Instance)";
const THEME_EXPORT_FILENAME = "theme-export.json";

export function ThemingEngineTopBar() {
  const { handleSubmit, reset, getValues } = useFormContext<ThemingEngineFormValues>();
  const navigate = useNavigate();
  const importInputRef = useRef<HTMLInputElement>(null);

  const onReset = () => {
    reset(defaultThemingEngineValues);
  };

  const onPublishToPortal = (data: ThemingEngineFormValues) => {
    const payload: ThemingEngineExportPayload = {
      ...data,
      headerLogoFile: null,
      secondaryLogoFile: null,
    };
    savePortalTheme(payload);
    toast.success("Theme published and applied to the portal prototype.");
    window.setTimeout(() => window.location.reload(), 450);
  };

  const onExport = () => {
    const values = getValues();
    const payload: ThemingEngineExportPayload = {
      ...values,
      headerLogoFile: null,
      secondaryLogoFile: null,
    };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = THEME_EXPORT_FILENAME;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text) as unknown;
        const result = themingEngineImportSchema.safeParse(parsed);
        if (!result.success) {
          toast.error("Invalid theme file. Please use a valid theme export JSON.");
          return;
        }
        reset({
          ...result.data,
          headerLogoFile: undefined,
          secondaryLogoFile: undefined,
        });
        toast.success("Theme imported successfully.");
      } catch {
        toast.error("Invalid theme file. Could not parse JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="shrink-0 border-b border-border bg-background px-6 py-3">
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        aria-hidden
        onChange={onImportFile}
      />
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-display font-bold tracking-tight text-foreground">
            Appearance
          </h1>
          <Badge intent="default" className="w-fit text-xs font-medium text-muted-foreground">
            Editing Theme for: {EDITING_THEME_FOR}
          </Badge>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-muted-foreground"
            title="Reset form to system default"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => importInputRef.current?.click()}
            className="gap-1.5 text-muted-foreground"
            title="Upload a theme JSON file"
          >
            <FileUp className="h-4 w-4" />
            Upload theme
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="gap-1.5 text-muted-foreground"
            title="Download theme as JSON"
          >
            <Download className="h-4 w-4" />
            Download theme
          </Button>

          <Separator orientation="vertical" className="mx-1 h-5" />

          <Button type="button" variant="outline" size="sm" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            intent="primary"
            onClick={handleSubmit(onPublishToPortal)}
            title="Validate, save to portal prototype, and reload"
          >
            Publish
          </Button>
        </div>
      </div>
    </header>
  );
}
