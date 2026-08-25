import { headers } from "next/headers";

import { auth } from "./auth";
import { orders_status } from "../../generated/prisma/enums";

export const FULFILLED_ORDER_STATUSES = [
  orders_status.received,
  orders_status.delivered,
];

export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user.role !== "admin") return null;
  return session;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
