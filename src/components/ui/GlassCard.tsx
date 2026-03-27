import { Card } from "@wexinc-healthbenefits/ben-ui-kit";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  hoverable?: boolean;
}

export function GlassCard({
  className,
  hoverable = false,
  children,
  ...props
}: GlassCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border border-white/60 bg-white/60 backdrop-blur-2xl shadow-md",
        hoverable &&
          "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
