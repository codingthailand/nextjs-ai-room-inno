import { Resend } from "resend"
import type { ContactFormData } from "@/lib/contact-schema"

export class ContactEmailError extends Error {}

export async function sendContactEmail(input: ContactFormData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL
  const to = process.env.CONTACT_TO_EMAIL

  if (!apiKey || !from || !to) {
    console.error("[contact] missing RESEND_API_KEY / CONTACT_FROM_EMAIL / CONTACT_TO_EMAIL")
    throw new ContactEmailError("Contact email is not configured")
  }

  const resend = new Resend(apiKey)

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `[ติดต่อร้าน] ${input.subject}`,
    text: [
      `ชื่อ: ${input.name}`,
      `อีเมล: ${input.email}`,
      `หัวข้อ: ${input.subject}`,
      "",
      `ข้อความ:`,
      input.message,
    ].join("\n"),
  })

  if (error) {
    console.error("[contact] resend error:", error.name, error.message)
    throw new ContactEmailError("Failed to send contact email")
  }
}
