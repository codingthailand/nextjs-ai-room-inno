"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { RiAlertLine, RiCheckLine } from "@remixicon/react"
import { contactSchema, type ContactFormValues } from "@/lib/contact-schema"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"

type FormStatus = "idle" | "pending" | "success" | "error"

type FieldErrors = Partial<Record<keyof ContactFormValues, string>>

const fieldIds = {
  name: "contact-name",
  email: "contact-email",
  subject: "contact-subject",
  message: "contact-message",
} as const

function errorId(field: keyof typeof fieldIds) {
  return `${fieldIds[field]}-error`
}

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle")
  const [sendError, setSendError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FieldErrors>({})
  const successRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus()
    }
  }, [status])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const values: ContactFormValues = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    }

    const parsed = contactSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {}
      for (const [field, messages] of Object.entries(
        parsed.error.flatten().fieldErrors
      )) {
        fieldErrors[field as keyof ContactFormValues] = messages?.[0]
      }
      setErrors(fieldErrors)
      setSendError(null)
      setStatus("idle")
      return
    }

    setErrors({})
    setSendError(null)
    setStatus("pending")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      })

      const result: { ok?: boolean; errors?: Record<string, string | undefined>; message?: string } | null =
        await response.json().catch(() => null)

      if (!response.ok || !result?.ok) {
        if (result?.errors) {
          const fieldErrors: FieldErrors = {}
          for (const [field, message] of Object.entries(result.errors)) {
            if (typeof message === "string" && message) {
              fieldErrors[field as keyof ContactFormValues] = message
            }
          }
          setErrors(fieldErrors)
          setSendError("กรุณาตรวจสอบข้อมูลที่กรอกอีกครั้ง")
        } else {
          setSendError(
            result?.message ?? "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง"
          )
        }
        setStatus("error")
        return
      }

      setStatus("success")
      form.reset()
    } catch {
      setStatus("error")
      setSendError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง")
    }
  }

  const isPending = status === "pending"

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor={fieldIds.name}>ชื่อ</FieldLabel>
          <Input
            id={fieldIds.name}
            name="name"
            type="text"
            aria-invalid={!!errors.name || undefined}
            aria-describedby={errors.name ? errorId("name") : undefined}
            placeholder="สมชาย ใจดี"
            autoComplete="name"
            disabled={isPending}
          />
          {errors.name && (
            <FieldError id={errorId("name")}>{errors.name}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor={fieldIds.email}>อีเมล</FieldLabel>
          <Input
            id={fieldIds.email}
            name="email"
            type="email"
            aria-invalid={!!errors.email || undefined}
            aria-describedby={errors.email ? errorId("email") : undefined}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isPending}
          />
          {errors.email && (
            <FieldError id={errorId("email")}>{errors.email}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.subject}>
          <FieldLabel htmlFor={fieldIds.subject}>หัวข้อ</FieldLabel>
          <Input
            id={fieldIds.subject}
            name="subject"
            type="text"
            aria-invalid={!!errors.subject || undefined}
            aria-describedby={errors.subject ? errorId("subject") : undefined}
            placeholder="สอบถามสินค้า"
            disabled={isPending}
          />
          {errors.subject && (
            <FieldError id={errorId("subject")}>{errors.subject}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.message}>
          <FieldLabel htmlFor={fieldIds.message}>ข้อความ</FieldLabel>
          <Textarea
            id={fieldIds.message}
            name="message"
            aria-invalid={!!errors.message || undefined}
            aria-describedby={errors.message ? errorId("message") : undefined}
            placeholder="พิมพ์ข้อความที่ต้องการติดต่อ..."
            rows={5}
            disabled={isPending}
          />
          {errors.message && (
            <FieldError id={errorId("message")}>{errors.message}</FieldError>
          )}
        </Field>

        {/* Honeypot: มนุษย์มองไม่เห็น ถ้า bot กรอกเข้าไปจะไม่ส่งอีเมลจริง */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="contact-website">Website</label>
          <Input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {sendError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <RiAlertLine className="mt-0.5 size-4 shrink-0" />
            <p>{sendError}</p>
          </div>
        )}

        {status === "success" && (
          <p
            ref={successRef}
            tabIndex={-1}
            role="status"
            className="flex items-start gap-2 rounded-sm border border-[#22c55e]/40 bg-[#dcfce7] px-4 py-3 text-sm font-medium text-[#166534] outline-none"
          >
            <RiCheckLine className="mt-0.5 size-4 shrink-0" />
            ส่งข้อความสำเร็จ! ทีมงานจะติดต่อกลับภายในเวลาทำการ
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : null}
          {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
        </Button>
      </FieldGroup>
    </form>
  )
}
