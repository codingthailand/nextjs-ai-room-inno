import { LayoutDashboard, Package, Store } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-background lg:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="flex items-center gap-2" aria-label="Admin Dashboard">
          <span className="flex size-9 items-center justify-center rounded-md border border-border-strong bg-warm text-primary">
            <Store className="size-5" />
          </span>
          <span className="font-heading text-lg font-bold text-foreground">
            COSCI<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          เมนู
        </p>
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-warm hover:text-foreground"
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-warm hover:text-foreground"
        >
          <Package className="size-4" />
          สินค้า
        </Link>
      </nav>

      <div className="border-t border-border p-4">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href="/">กลับหน้าร้านค้า</Link>
        </Button>
      </div>
    </aside>
  );
}
