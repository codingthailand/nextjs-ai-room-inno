import { Store } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <Link
    href="/"
    className={cn("group inline-flex items-center gap-2", className)}
    aria-label="COSCI Market"
  >
    <span className="flex size-9 items-center justify-center rounded-md border border-border-strong bg-warm text-primary transition-colors group-hover:border-primary">
      <Store className="size-5" />
    </span>
    <span className="font-heading text-xl font-bold tracking-tight text-foreground">
      COSCI<span className="text-primary">.</span>
    </span>
  </Link>
);
