"use client"

import { useEffect, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
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
  const successRef = useRef<HTMLParagraphElement>(null)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  })

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus()
    }
  }, [status])

  async function onSubmit(data: ContactFormValues) {
    setStatus("pending")
    setSendError(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result: { ok?: boolean; errors?: Record<string, string | undefined>; message?: string } | null =
        await response.json().catch(() => null)

      if (!response.ok || !result?.ok) {
        if (result?.errors) {
          for (const [field, message] of Object.entries(result.errors)) {
            if (typeof message === "string" && message) {
              form.setError(field as keyof ContactFormValues, {
                type: "server",
                message,
              })
            }
          }
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

  function onInvalid() {
    // ล้างสถานะ success/error เดิมเมื่อ validation ฝั่ง client ไม่ผ่าน
    setStatus("idle")
    setSendError(null)
  }

  const isPending = status === "pending"

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={fieldIds.name}>ชื่อ</FieldLabel>
              <Input
                {...field}
                id={fieldIds.name}
                type="text"
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby={
                  fieldState.invalid ? errorId("name") : undefined
                }
                placeholder="สมชาย ใจดี"
                autoComplete="name"
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError id={errorId("name")} errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={fieldIds.email}>อีเมล</FieldLabel>
              <Input
                {...field}
                id={fieldIds.email}
                type="email"
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby={
                  fieldState.invalid ? errorId("email") : undefined
                }
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError id={errorId("email")} errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="subject"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={fieldIds.subject}>หัวข้อ</FieldLabel>
              <Input
                {...field}
                id={fieldIds.subject}
                type="text"
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby={
                  fieldState.invalid ? errorId("subject") : undefined
                }
                placeholder="สอบถามสินค้า"
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError id={errorId("subject")} errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={fieldIds.message}>ข้อความ</FieldLabel>
              <Textarea
                {...field}
                id={fieldIds.message}
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby={
                  fieldState.invalid ? errorId("message") : undefined
                }
                placeholder="พิมพ์ข้อความที่ต้องการติดต่อ..."
                rows={5}
                disabled={isPending}
              />
              {fieldState.invalid && (
                <FieldError id={errorId("message")} errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Honeypot: มนุษย์มองไม่เห็น ถ้า bot กรอกเข้าไปจะไม่ส่งอีเมลจริง */}
        <Controller
          name="website"
          control={form.control}
          render={({ field }) => (
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
            >
              <label htmlFor="contact-website">Website</label>
              <Input
                {...field}
                id="contact-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
          )}
        />

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
