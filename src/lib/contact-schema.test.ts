import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const valid = {
  name: "สมชาย ใจดี",
  email: "somchai@example.com",
  subject: "สอบถามสินค้า",
  message: "สวัสดีครับ ผมสนใจสินค้าชิ้นหนึ่งครับ",
  website: "",
};

describe("contactSchema", () => {
  it("accepts valid input", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects name shorter than 2 characters", () => {
    expect(contactSchema.safeParse({ ...valid, name: "ก" }).success).toBe(false);
  });

  it("rejects name longer than 100 characters", () => {
    expect(
      contactSchema.safeParse({ ...valid, name: "ก".repeat(101) }).success
    ).toBe(false);
    expect(
      contactSchema.safeParse({ ...valid, name: "ก".repeat(100) }).success
    ).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      contactSchema.safeParse({ ...valid, email: "not-an-email" }).success
    ).toBe(false);
  });

  it("rejects subject shorter than 3 characters", () => {
    expect(
      contactSchema.safeParse({ ...valid, subject: "ab" }).success
    ).toBe(false);
  });

  it("rejects subject longer than 150 characters", () => {
    expect(
      contactSchema.safeParse({ ...valid, subject: "ก".repeat(151) }).success
    ).toBe(false);
  });

  it("rejects message shorter than 10 characters", () => {
    expect(
      contactSchema.safeParse({ ...valid, message: "สั้นไป" }).success
    ).toBe(false);
  });

  it("rejects message longer than 2000 characters", () => {
    expect(
      contactSchema.safeParse({ ...valid, message: "ก".repeat(2001) }).success
    ).toBe(false);
    expect(
      contactSchema.safeParse({ ...valid, message: "ก".repeat(10) }).success
    ).toBe(true);
  });

  it("trims surrounding whitespace", () => {
    const result = contactSchema.safeParse({ ...valid, name: "  สมชาย ใจดี  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("สมชาย ใจดี");
    }
  });

  it("accepts a filled honeypot field", () => {
    expect(
      contactSchema.safeParse({ ...valid, website: "http://spam.example" })
        .success
    ).toBe(true);
  });
});
