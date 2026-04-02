import { Card } from "@wexinc-healthbenefits/ben-ui-kit";
import { cn } from "@/lib/utils";
import { usePrototype } from "@/context/PrototypeContext";

interface GlassCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  hoverable?: boolean;
}

export function GlassCard({
  className,
  hoverable = false,
  children,
  ...props
}: GlassCardProps) {
  const { homepageMode } = usePrototype();
  const isPartnerSafe = homepageMode === "partner-safe";

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[24px]",
        isPartnerSafe 
          ? "border-border shadow-sm bg-card" 
          : "border-white/60 bg-white/60 backdrop-blur-2xl shadow-md",
        hoverable &&
          "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        className,
      )}
      style={{ borderRadius: '24px' }}
      {...props}
    >
      {children}
    </Card>
  );
}
