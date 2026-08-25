import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin";
import AdminNavbar from "./admin-navbar";
import AdminSidebar from "./admin-sidebar";

export default async function AdminShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNavbar userName={session.user.name} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
