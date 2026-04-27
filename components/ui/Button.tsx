import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "dark" | "white" | "glovo" | "uber" | "gold";
type Size = "sm" | "md" | "xl";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 font-black uppercase tracking-wide " +
  "rounded-full border-[3px] border-galos-black transition-transform " +
  "hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed " +
  "whitespace-nowrap text-center";

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs border-2",
  md: "px-5 py-3 text-sm",
  xl: "px-7 py-4 text-base shadow-hard",
};

const variants: Record<Variant, string> = {
  primary: "bg-galos-red text-white hover:bg-galos-red-dark",
  ghost: "bg-transparent text-galos-black hover:bg-galos-black hover:text-white",
  dark: "bg-galos-black text-white hover:bg-neutral-800",
  white: "bg-white text-galos-red hover:bg-galos-gold hover:text-galos-black",
  glovo: "bg-[#FFC244] text-galos-black hover:brightness-95",
  uber: "bg-[#06C167] text-galos-black hover:brightness-95",
  gold: "bg-galos-gold text-galos-black hover:bg-galos-gold-dark",
};

type AnchorProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps> & {
    href: string;
    external?: boolean;
  };
type ButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };

export function Button(props: AnchorProps | ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(base, sizes[size], variants[variant], className);

  if ("href" in rest && rest.href) {
    const { href, external, ...anchorRest } = rest as AnchorProps;
    if (external || href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as ComponentPropsWithoutRef<"button">)}>
      {children}
    </button>
  );
}
