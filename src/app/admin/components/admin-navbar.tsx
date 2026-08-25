import { Store } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/logout-button";

export default function AdminNavbar({ userName }: { userName: string }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
      <Link
        href="/admin"
        className="flex items-center gap-2 lg:hidden"
        aria-label="Admin Dashboard"
      >
        <span className="flex size-9 items-center justify-center rounded-md border border-border-strong bg-warm text-primary">
          <Store className="size-5" />
        </span>
        <span className="font-heading text-lg font-bold text-foreground">
          COSCI<span className="text-primary">.</span>
        </span>
      </Link>
      <p className="hidden text-sm text-muted-foreground lg:block">
        ระบบจัดการร้านค้า
      </p>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">
          สวัสดี,{" "}
          <span className="font-semibold text-foreground">{userName}</span>
        </span>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <Button asChild variant="ghost" size="sm">
          <Link href="/">กลับหน้าร้านค้า</Link>
        </Button>
        <LogoutButton />
      </div>
    </header>
  );
}
