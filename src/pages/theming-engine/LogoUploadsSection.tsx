import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@wexinc-healthbenefits/ben-ui-kit";
import { Upload } from "lucide-react";
import type { ThemingEngineFormValues } from "./schema";

const LOGO_ACCEPT = "image/png,image/svg+xml,.png,.svg";

export function LogoUploadsSection() {
  const { control, watch } = useFormContext<ThemingEngineFormValues>();
  const primary = watch("headerLogoFile");
  const secondary = watch("secondaryLogoFile");

  return (
    <div className="space-y-6">
      <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-4">
        <Label className="text-sm font-medium text-foreground">Primary logo</Label>
        {primary instanceof File ? (
          <p className="text-xs text-muted-foreground">{primary.name}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No logo uploaded yet.</p>
        )}
        <Controller
          name="headerLogoFile"
          control={control}
          render={({ field: { onChange, value: _v, ref } }) => (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-muted/50 w-fit">
              <Upload className="h-4 w-4" />
              Upload
              <input
                ref={ref}
                type="file"
                accept={LOGO_ACCEPT}
                className="sr-only"
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
        />
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-muted/10 p-4">
        <Label className="text-sm font-medium text-foreground">Secondary logo</Label>
        {secondary instanceof File ? (
          <p className="text-xs text-muted-foreground">{secondary.name}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No logo uploaded yet.</p>
        )}
        <Controller
          name="secondaryLogoFile"
          control={control}
          render={({ field: { onChange, value: _v, ref } }) => (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-muted/50 w-fit">
              <Upload className="h-4 w-4" />
              Upload
              <input
                ref={ref}
                type="file"
                accept={LOGO_ACCEPT}
                className="sr-only"
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
              />
            </label>
          )}
        />
      </div>
    </div>
  );
}
