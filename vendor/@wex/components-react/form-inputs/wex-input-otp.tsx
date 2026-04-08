import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import {
  InputOTPGroup as InputOTPGroupBase,
  InputOTPSlot as InputOTPSlotBase,
  InputOTPSeparator as InputOTPSeparatorBase,
} from "@/components/ui/input-otp";
import { cn } from "../lib/utils";

/**
 * WexInputOTP - WEX Design System One-Time Password Input Component
 *
 * Input for one-time passwords and verification codes.
 * Uses namespace pattern: WexInputOTP.Group, WexInputOTP.Slot, WexInputOTP.Separator
 *
 * @example
 * <WexInputOTP maxLength={6}>
 *   <WexInputOTP.Group>
 *     <WexInputOTP.Slot index={0} />
 *     <WexInputOTP.Slot index={1} />
 *     <WexInputOTP.Slot index={2} />
 *   </WexInputOTP.Group>
 *   <WexInputOTP.Separator />
 *   <WexInputOTP.Group>
 *     <WexInputOTP.Slot index={3} />
 *     <WexInputOTP.Slot index={4} />
 *     <WexInputOTP.Slot index={5} />
 *   </WexInputOTP.Group>
 * </WexInputOTP>
 */

const WexInputOTPRoot = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-[var(--wex-component-inputotp-disabled-opacity)]",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
WexInputOTPRoot.displayName = "WexInputOTP";

const WexInputOTPGroup = React.forwardRef<
  React.ElementRef<typeof InputOTPGroupBase>,
  React.ComponentPropsWithoutRef<typeof InputOTPGroupBase>
>(({ className, ...props }, ref) => (
  <InputOTPGroupBase ref={ref} className={className} {...props} />
));
WexInputOTPGroup.displayName = "WexInputOTP.Group";

const WexInputOTPSlot = React.forwardRef<
  React.ElementRef<typeof InputOTPSlotBase>,
  React.ComponentPropsWithoutRef<typeof InputOTPSlotBase>
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-wex-inputotp-border bg-wex-inputotp-bg text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-wex-inputotp-focus-ring",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-wex-inputotp-caret duration-1000" />
        </div>
      )}
    </div>
  );
});
WexInputOTPSlot.displayName = "WexInputOTP.Slot";

const WexInputOTPSeparator = React.forwardRef<
  React.ElementRef<typeof InputOTPSeparatorBase>,
  React.ComponentPropsWithoutRef<typeof InputOTPSeparatorBase>
>(({ ...props }, ref) => (
  <InputOTPSeparatorBase ref={ref} {...props} />
));
WexInputOTPSeparator.displayName = "WexInputOTP.Separator";

export const WexInputOTP = Object.assign(WexInputOTPRoot, {
  Group: WexInputOTPGroup,
  Slot: WexInputOTPSlot,
  Separator: WexInputOTPSeparator,
});

