"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RiRefreshLine } from "@remixicon/react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
};

type Revenue = {
  period: string;
  total: number;
  daily: { date: string; revenue: number }[];
};type Order = {
  id: number;
  date: string | null;
  status: "processing" | "received" | "delivered" | null;
  totalAmount: number;
  customerName: string;
};

const PERIODS = [
  { key: "7d", label: "7 วัน" },
  { key: "30d", label: "30 วัน" },
  { key: "90d", label: "90 วัน" },
] as const;
type PeriodKey = (typeof PERIODS)[number]["key"];

const STATUS_LABEL: Record<Order["status"] & string, string> = {
  processing: "กำลังดำเนินการ",
  received: "รับสินค้าแล้ว",
  delivered: "จัดส่งแล้ว",
};

const thb = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const thbCompact = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  notation: "compact",
  maximumFractionDigits: 1,
});

const dateShort = new Intl.DateTimeFormat("th-TH", {
  day: "numeric",
  month: "short",
});

const dateFull = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeStyle: "short",
});

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function formatDateKey(value: string) {
  return dateShort.format(new Date(`${value}T00:00:00`));
}

function usePolling<T>(fetcher: () => Promise<T>, intervalMs: number | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetcher, reload]);

  useEffect(() => {
    if (intervalMs === null) return;
    const id = setInterval(() => setReload((r) => r + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { data, loading, error, retry: () => setReload((r) => r + 1) };
}

function SectionError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <p className="text-sm text-muted-foreground">
        {message ?? "โหลดข้อมูลไม่สำเร็จ"}
      </p>
      <Button size="sm" onClick={onRetry}>
        <RiRefreshLine /> ลองใหม่
      </Button>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="flex items-center justify-center py-10 text-muted-foreground">
      <Spinner className="size-5" />
    </div>
  );
}

function KpiCards() {
  const fetcher = useCallback(
    () => fetchJson<Stats>("/api/admin/stats"),
    []
  );
  const { data, loading, error, retry } = usePolling(fetcher, 30_000);

  if (!data && loading) return <SectionSkeleton />;
  if (!data) return <SectionError message={error} onRetry={retry} />;

  const cards = [
    { label: "ยอดขายรวม", value: thb.format(data.totalRevenue) },
    { label: "คำสั่งซื้อ", value: String(data.totalOrders) },
    { label: "ลูกค้า", value: String(data.totalCustomers) },
    { label: "สินค้า", value: String(data.totalProducts) },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} size="sm">
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-2xl">{card.value}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function RevenueChart() {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const fetcher = useCallback(
    () => fetchJson<Revenue>(`/api/admin/revenue?period=${period}`),
    [period]
  );
  const { data, loading, error, retry } = usePolling(fetcher, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>รายได้</CardTitle>
        <CardDescription>ยอดขายรายวัน</CardDescription>
        <CardAction>
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <Button
                key={p.key}
                size="sm"
                variant={period === p.key ? "default" : "outline"}
                onClick={() => setPeriod(p.key)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        {!data && loading ? (
          <SectionSkeleton />
        ) : !data ? (
          <SectionError message={error} onRetry={retry} />
        ) : (
          <div>
            <div className="mb-4 text-2xl font-semibold">
              {thb.format(data.total)}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data.daily} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDateKey}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tickFormatter={(v) => thbCompact.format(Number(v))}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  width={72}
                />
                <Tooltip
                  labelFormatter={(label) => formatDateKey(String(label))}
                  formatter={(value) => thb.format(Number(value))}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="รายได้"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentOrders() {
  const fetcher = useCallback(
    () => fetchJson<{ orders: Order[] }>("/api/admin/orders?limit=5"),
    []
  );
  const { data, loading, error, retry } = usePolling(fetcher, 30_000);

  if (!data && loading) return <SectionSkeleton />;
  if (!data) return <SectionError message={error} onRetry={retry} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
      </CardHeader>
      <CardContent>
        {data.orders.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            ยังไม่มีคำสั่งซื้อ
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {data.orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    #{order.id} · {order.customerName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.date ? dateFull.format(new Date(order.date)) : "-"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold">
                    {thb.format(order.totalAmount)}
                  </span>
                  <span
                    className={cn(
                      "rounded-sm px-1.5 py-0.5 text-xs",
                      order.status === "processing" && "bg-accent text-accent-foreground",
                      order.status === "received" && "bg-emerald-100 text-emerald-800",
                      order.status === "delivered" && "bg-primary/10 text-primary"
                    )}
                  >
                    {order.status ? STATUS_LABEL[order.status] : "-"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardClient() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            ภาพรวมร้านค้า (อัปเดตอัตโนมัติทุก 30 วินาที)
          </p>
        </div>
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">
          ← กลับหน้าร้านค้า
        </Link>
      </header>
      <KpiCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <RecentOrders />
      </div>
    </main>
  );
}
