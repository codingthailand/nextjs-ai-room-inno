import { redirect } from "next/navigation";
import { connection } from "next/server";

import { getAdminSession } from "@/lib/admin";
import DashboardClient from "./dashboard-client";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function AdminPage() {
  await connection();
  if (!(await getAdminSession())) {
    redirect("/login");
  }

  return <DashboardClient />;
}
