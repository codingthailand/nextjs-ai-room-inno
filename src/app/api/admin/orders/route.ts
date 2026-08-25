import prisma from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/admin";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const rawLimit = parseInt(
    new URL(request.url).searchParams.get("limit") ?? "5",
    10
  );
  const limit = Math.min(
    Math.max(Number.isFinite(rawLimit) ? rawLimit : 5, 1),
    50
  );

  const orders = await prisma.orders.findMany({
    orderBy: { date: "desc" },
    take: limit,
    include: { customers: true },
  });

  return Response.json({
    orders: orders.map((o) => ({
      id: o.id,
      date: o.date,
      status: o.status,
      totalAmount: Number(o.total_amount ?? 0),
      customerName: o.customers?.name ?? "ไม่ระบุ",
    })),
  });
}
