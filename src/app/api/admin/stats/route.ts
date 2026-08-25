import prisma from "@/lib/prisma";
import { FULFILLED_ORDER_STATUSES, getAdminSession, unauthorized } from "@/lib/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const [totalOrders, totalCustomers, totalProducts, revenueAgg] =
    await Promise.all([
      prisma.orders.count(),
      prisma.customers.count(),
      prisma.products.count(),
      prisma.orders.aggregate({
        _sum: { total_amount: true },
        where: { status: { in: FULFILLED_ORDER_STATUSES } },
      }),
    ]);

  return Response.json({
    totalRevenue: Number(revenueAgg._sum.total_amount ?? 0),
    totalOrders,
    totalCustomers,
    totalProducts,
  });
}
