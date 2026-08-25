import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  RiArrowDownSLine,
  RiFacebookFill,
  RiInstagramFill,
  RiLineFill,
  RiMailFill,
  RiMapPinFill,
  RiPhoneFill,
  RiTimeFill,
  RiTwitterXFill,
  RiYoutubeFill,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import ContactForm from "../components/contact-form";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const channels = [
  {
    icon: RiMapPinFill,
    title: "ที่อยู่",
    lines: ["123 ถนนตัวอย่าง แขวงบางรัก", "เขตบางรัก กรุงเทพมหานคร 10500"],
  },
  {
    icon: RiMailFill,
    title: "อีเมล",
    lines: ["contact@cosci.com"],
    href: "mailto:contact@cosci.com",
  },
  {
    icon: RiPhoneFill,
    title: "โทรศัพท์",
    lines: ["02-123-4567"],
    href: "tel:021234567",
  },
  {
    icon: RiTimeFill,
    title: "เวลาทำการ",
    lines: ["จันทร์ - ศุกร์ 09:00 - 18:00 น.", "เสาร์ - อาทิตย์ หยุด"],
  },
];

const socials = [
  { label: "Facebook", href: "https://www.facebook.com", icon: RiFacebookFill },
  { label: "Instagram", href: "https://www.instagram.com", icon: RiInstagramFill },
  { label: "Twitter X", href: "https://twitter.com", icon: RiTwitterXFill },
  { label: "YouTube", href: "https://www.youtube.com", icon: RiYoutubeFill },
  { label: "Line", href: "https://line.me", icon: RiLineFill },
];

const faqs = [
  {
    q: "สั่งสินค้าอย่างไร?",
    a: "เลือกสินค้าที่ต้องการจากหน้าแรกหรือหน้าสินค้า แล้วกดปุ่มเพิ่มลงตะกร้า จากนั้นทำตามขั้นตอนการชำระเงินจนเสร็จสมบูรณ์",
  },
  {
    q: "ใช้เวลาจัดส่งกี่วัน?",
    a: "สินค้าจะจัดส่งภายใน 1-2 วันทำการหลังยืนยันการชำระเงิน และใช้เวลาจัดส่งประมาณ 2-5 วันทำการทั่วประเทศ",
  },
  {
    q: "สามารถคืนสินค้าได้หรือไม่?",
    a: "สามารถคืนสินค้าได้ภายใน 7 วันหลังได้รับสินค้า โดยสินค้าต้องอยู่ในสภาพสมบูรณ์ ไม่ผ่านการใช้งาน และยังอยู่ในแพ็กเกจเดิม",
  },
  {
    q: "มีช่องทางชำระเงินอะไรบ้าง?",
    a: "รองรับการชำระเงินผ่านบัตรเครดิต/เดบิต และการโอนเงินผ่านธนาคาร เมื่อชำระเสร็จระบบจะยืนยันออเดอร์โดยอัตโนมัติ",
  },
];

// http://localhost:3000/contact
export default function ContactPage() {
  return (
    <main>
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

        <div className="mx-auto mt-14 grid max-w-5xl items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ข้อมูลติดต่อ */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {channels.map(({ icon: Icon, title, lines, href }) => (
                <div
                  key={title}
                  className="rounded-md border border-border bg-card p-6 transition-colors hover:border-border-strong"
                >
                  <div className="flex size-10 items-center justify-center rounded-sm border border-border-strong bg-warm text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="mt-4 font-heading text-lg font-semibold">
                    {title}
                  </h2>
                  {lines.map((line) =>
                    href ? (
                      <a
                        key={line}
                        href={href}
                        className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {line}
                      </a>
                    ) : (
                      <p
                        key={line}
                        className="mt-1 text-sm text-muted-foreground"
                      >
                        {line}
                      </p>
                    )
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="rounded-md border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-semibold">ติดตามเรา</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-sm border border-border-strong bg-warm text-primary transition-colors hover:border-[#a8a29e]"
                  >
                    <Icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-md border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-semibold">
                คำถามที่พบบ่อย
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-sm border border-border bg-warm p-4 open:border-border-strong [&::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex list-none cursor-pointer items-center justify-between gap-4 text-sm font-semibold select-none">
                      {faq.q}
                      <RiArrowDownSLine className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-md border border-border bg-card p-6 sm:p-8">
            <h2 className="font-heading text-2xl font-semibold">
              ส่งข้อความถึงเรา
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              กรอกข้อมูลด้านล่าง แล้วทีมงานจะติดต่อกลับโดยเร็วที่สุด
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
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
