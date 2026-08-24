import Link from "next/link";
import AppLoading from "../components/app-loading";
import { Suspense } from "react";
import { ArrowLeft, HeartHandshake, Leaf, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

async function ApiVersion() {
  const response = await fetch("https://api.codingthailand.com/api/version");
  const apiInfo = await response.json();

  return (
    <p className="font-mono text-sm text-muted-foreground">
      API Version:{" "}
      <span className="font-semibold text-foreground">
        {apiInfo.data.version}
      </span>
    </p>
  );
}

const values = [
  {
    icon: HeartHandshake,
    title: "ชุมชนมาก่อน",
    body: "เราสร้างพื้นที่ให้ผู้พัฒนาและผู้ซื้อได้รู้จักกัน ไม่ใช่แค่แลกเปลี่ยนเงินกับสินค้า",
  },
  {
    icon: Leaf,
    title: "คุณภาพที่ยั่งยืน",
    body: "สินค้าทุกชิ้นถูกคัดสรรและตรวจสอบก่อนวางขาย เพื่อคุณภาพที่คุ้มค่าในระยะยาว",
  },
  {
    icon: Users,
    title: "โปร่งใสเสมอ",
    body: "ผู้ขายต้องเปิดเผยตัวตนและที่มา ไม่มีการปิดบังที่มาของสินค้า",
  },
];

// http://localhost:3000/about
export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.09em] text-primary">
            เกี่ยวกับเรา
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight tracking-[0.005em] sm:text-5xl">
            ตลาดที่เชื่อมคนสร้าง กับคนที่ชื่นชอบงานฝีมือ
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            COSCI Marketplace เป็นตลาดกลางสำหรับสินค้าเทคโนโลยีที่สร้างโดยคนตัวจริง
            เรามุ่งเน้นเรื่องราวของผู้สร้าง คุณภาพของชิ้นงาน และความโปร่งใส
            เพื่อให้ทุกการซื้อขายคือการสนับสนุนฝีมืออย่างแท้จริง
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-xl justify-center">
          <div className="w-full rounded-md border-2 border-border-strong bg-warm p-6">
            <Suspense fallback={<AppLoading />}>
              <ApiVersion />
            </Suspense>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-md border-2 border-border-strong bg-warm p-6 transition-colors hover:border-[#a8a29e]"
            >
              <div className="flex size-10 items-center justify-center rounded-sm border border-border-strong bg-card text-primary">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-4 font-heading text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="size-4" /> กลับหน้าหลัก
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
