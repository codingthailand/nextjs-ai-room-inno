import Link from "next/link";
import { ArrowUpRight, Bot, Code2, Palette, PlayCircle, TerminalSquare, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const categories = [
  { label: "AI Tools", icon: Bot },
  { label: "Web App", icon: Code2 },
  { label: "Design", icon: Palette },
  { label: "Dev Tools", icon: TerminalSquare },
];

const stories = [
  {
    icon: Rocket,
    title: "ทุกชิ้นมีเรื่องราว",
    body: "สินค้าแต่ละชิ้นมาจากผู้พัฒนาที่อธิบายแรงบันดาลใจ กระบวนการ และสิ่งที่ทำให้มันพิเศษ",
  },
  {
    icon: PlayCircle,
    title: "รู้จักผู้สร้าง",
    body: "โปรไฟล์ผู้ขายพร้อมประวัติและที่อยู่ ทำให้คุณมั่นใจว่ากำลังซื้อจากคนตัวจริง",
  },
  {
    icon: Code2,
    title: "คุณภาพที่ตรวจสอบได้",
    body: "ตัวอย่างโค้ด สกรีนช็อต และรีวิวจากผู้ใช้จริงช่วยให้ตัดสินใจได้อย่างมั่นใจ",
  },
];

export default function Hero() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(212,163,115,0.25),transparent_65%)]" />

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="relative z-10 text-center">
          <Badge
            asChild
            variant="secondary"
            className="rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-[0.09em]"
          >
            <Link href="/product">
              ตลาดเทคโนโลยีจากผู้สร้างตัวจริง <ArrowUpRight className="size-3.5" />
            </Link>
          </Badge>

          <h1 className="mx-auto mt-8 max-w-3xl font-heading text-[2.5rem] font-bold leading-[1.15] tracking-[0.01em] text-foreground sm:text-6xl">
            ซอฟต์แวร์และสินค้าเทคโนโลยี
            <br />
            <span className="text-primary">สร้างด้วยมือ</span> ใส่ใจทุกรายละเอียด
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            ทุกชิ้นงานมาจากผู้พัฒนาที่ตั้งใจสร้างสรรค์ พร้อมเรื่องราว ตัวตน และคุณภาพ
            ที่คุณสัมผัสได้ — ไม่ใช่แค่สินค้าแต่คือฝีมือของคนจริง
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/product">
                เริ่มช้อปสินค้า <ArrowUpRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/course">
                <PlayCircle className="size-4" /> ดูหลักสูตร
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {categories.map(({ label, icon: Icon }) => (
              <Link
                key={label}
                href="/product"
                className="inline-flex h-8 items-center gap-2 rounded-sm border border-border-strong bg-card px-3.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-primary hover:bg-warm"
              >
                <Icon className="size-3.5 text-primary" />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:mt-20 sm:grid-cols-3">
          {stories.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-md border-2 border-border-strong bg-warm p-6 transition-colors hover:border-[#a8a29e]"
            >
              <div className="flex size-10 items-center justify-center rounded-sm border border-border-strong bg-card text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
