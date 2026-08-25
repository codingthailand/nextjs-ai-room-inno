import prisma from "@/lib/prisma";
import { FULFILLED_ORDER_STATUSES, getAdminSession, unauthorized } from "@/lib/admin";

const PERIODS = { "7d": 7, "30d": 30, "90d": 90 } as const;
type PeriodKey = keyof typeof PERIODS;

// Prisma reads MySQL DATETIME as UTC (wall-clock preserved), so UTC components
// give the same day buckets regardless of server timezone.
function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const raw = new URL(request.url).searchParams.get("period") ?? "30d";
  const period: PeriodKey = raw in PERIODS ? (raw as PeriodKey) : "30d";
  const days = PERIODS[period];

  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));

  const orders = await prisma.orders.findMany({
    where: {
      date: { gte: start },
      status: { in: FULFILLED_ORDER_STATUSES },
    },
    select: { date: true, total_amount: true },
  });

  const byDay = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    byDay.set(dateKey(d), 0);
  }
  for (const o of orders) {
    if (!o.date) continue;
    const key = dateKey(o.date);
    byDay.set(key, (byDay.get(key) ?? 0) + Number(o.total_amount ?? 0));
  }

  const daily = [...byDay.entries()].map(([date, revenue]) => ({ date, revenue }));
  const total = daily.reduce((sum, d) => sum + d.revenue, 0);

  return Response.json({ period, total, daily });
}
