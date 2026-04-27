import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "halal" | "new" | "top" | "spicy" | "promo" | "ghost";

const variants: Record<Variant, string> = {
  default: "bg-galos-gold text-galos-black border-galos-black",
  halal: "bg-galos-gold text-galos-black border-galos-black",
  new: "bg-galos-red text-white border-galos-black",
  top: "bg-galos-black text-galos-gold border-galos-black",
  spicy: "bg-orange-500 text-white border-galos-black",
  promo: "bg-galos-gold text-galos-black border-galos-black",
  ghost: "bg-black/35 text-white border-white/40",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full border-2 text-[10px] font-black uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
