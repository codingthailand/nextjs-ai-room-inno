import { contactSchema } from "@/lib/contact-schema"
import { sendContactEmail } from "@/lib/contact"

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json(
      { ok: false, message: "ข้อมูลที่ส่งมาไม่ถูกต้อง" },
      { status: 400 }
    )
  }

  const parsed = contactSchema.safeParse(payload)
  if (!parsed.success) {
    const errors: Record<string, string | undefined> = {}
    for (const [field, messages] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      errors[field] = messages?.[0]
    }
    return Response.json({ ok: false, errors }, { status: 400 })
  }

  const { website, ...contact } = parsed.data

  // Honeypot ถูกกรอก → ถือว่าเป็น bot: ตอบเหมือนสำเร็จ แต่ไม่ส่งอีเมล
  if (website) {
    return Response.json({ ok: true })
  }

  try {
    await sendContactEmail(contact)
  } catch (error) {
    console.error("[contact] failed to send email:", error)
    return Response.json(
      { ok: false, message: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    )
  }

  return Response.json({ ok: true })
}
