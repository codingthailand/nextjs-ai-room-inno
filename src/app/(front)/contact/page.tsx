import Link from "next/link";
import { ArrowLeft, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const channels = [
  {
    icon: MapPin,
    title: "ที่อยู่",
    lines: ["123 ถนนตัวอย่าง แขวงบางรัก", "เขตบางรัก กรุงเทพมหานคร 10500"],
  },
  {
    icon: Mail,
    title: "อีเมล",
    lines: ["contact@cosci.com"],
  },
  {
    icon: Phone,
    title: "โทรศัพท์",
    lines: ["02-123-4567"],
  },
  {
    icon: Clock,
    title: "เวลาทำการ",
    lines: ["จันทร์ - ศุกร์ 09:00 - 18:00 น.", "เสาร์ - อาทิตย์ หยุด"],
  },
];

// http://localhost:3000/contact
export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.09em] text-primary">
          ติดต่อเรา
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight tracking-[0.005em] sm:text-5xl">
          พูดคุยกับทีมงาน
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          สอบถามข้อมูลเพิ่มเติมหรือติดต่อทีมงานของเรา เรายินดีตอบทุกข้อสงสัย
          ภายในเวลาทำการ
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
        {channels.map(({ icon: Icon, title, lines }) => (
          <div
            key={title}
            className="rounded-md border border-border bg-card p-6 transition-colors hover:border-border-strong"
          >
            <div className="flex size-10 items-center justify-center rounded-sm border border-border-strong bg-warm text-primary">
              <Icon className="size-5" />
            </div>
            <h2 className="mt-4 font-heading text-lg font-semibold">{title}</h2>
            {lines.map((line) => (
              <p key={line} className="mt-1 text-sm text-muted-foreground">
                {line}
              </p>
            ))}
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
  );
}
