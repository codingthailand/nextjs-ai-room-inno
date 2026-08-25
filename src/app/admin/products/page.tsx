import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin";
import ProductsClient from "./products-client";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function ProductsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  return <ProductsClient />;
}
