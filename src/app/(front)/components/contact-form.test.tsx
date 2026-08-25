import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ContactForm from "./contact-form";

function fillValidForm() {
  fireEvent.change(screen.getByLabelText("ชื่อ"), {
    target: { value: "สมชาย ใจดี" },
  });
  fireEvent.change(screen.getByLabelText("อีเมล"), {
    target: { value: "somchai@example.com" },
  });
  fireEvent.change(screen.getByLabelText("หัวข้อ"), {
    target: { value: "สอบถามสินค้า" },
  });
  fireEvent.change(screen.getByLabelText("ข้อความ"), {
    target: { value: "สวัสดีครับ ผมสนใจสินค้าชิ้นหนึ่งครับ" },
  });
}

function stubFetch(response: {
  ok: boolean;
  json: () => Promise<unknown>;
}) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders all fields with labels", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("ชื่อ")).toBeInTheDocument();
    expect(screen.getByLabelText("อีเมล")).toBeInTheDocument();
    expect(screen.getByLabelText("หัวข้อ")).toBeInTheDocument();
    expect(screen.getByLabelText("ข้อความ")).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    expect(
      await screen.findByText("ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
    ).toBeInTheDocument();
    expect(screen.getByText("กรุณากรอกอีเมล")).toBeInTheDocument();
    expect(
      screen.getByText("หัวข้อต้องมีอย่างน้อย 3 ตัวอักษร")
    ).toBeInTheDocument();
    expect(
      screen.getByText("ข้อความต้องมีอย่างน้อย 10 ตัวอักษร")
    ).toBeInTheDocument();
  });

  it("keeps entered values when validation fails", async () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("ชื่อ"), {
      target: { value: "สมชาย" },
    });
    fireEvent.change(screen.getByLabelText("อีเมล"), {
      target: { value: "bad-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    await screen.findByText("รูปแบบอีเมลไม่ถูกต้อง");
    expect(screen.getByLabelText("ชื่อ")).toHaveValue("สมชาย");
    expect(screen.getByLabelText("อีเมล")).toHaveValue("bad-email");
  });

  it("posts valid data and shows success, resetting the form", async () => {
    const fetchMock = stubFetch({ ok: true, json: async () => ({ ok: true }) });

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    expect(await screen.findByText(/ส่งข้อความสำเร็จ/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" })
    );
    expect(screen.getByLabelText("ชื่อ")).toHaveValue("");
    expect(screen.getByLabelText("ข้อความ")).toHaveValue("");
  });

  it("shows a send error and keeps values when the API fails", async () => {
    stubFetch({
      ok: false,
      json: async () => ({
        ok: false,
        message: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง",
      }),
    });

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "ไม่สามารถส่งข้อความได้"
    );
    expect(screen.getByLabelText("ชื่อ")).toHaveValue("สมชาย ใจดี");
  });

  it("clears a previous success message when submitting invalid data", async () => {
    stubFetch({ ok: true, json: async () => ({ ok: true }) });

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    expect(await screen.findByText(/ส่งข้อความสำเร็จ/)).toBeInTheDocument();

    // form.reset() already cleared the fields, resubmitting now fails validation
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    expect(await screen.findByText("กรุณากรอกอีเมล")).toBeInTheDocument();
    expect(screen.queryByText(/ส่งข้อความสำเร็จ/)).not.toBeInTheDocument();
  });

  it("clears a previous send error banner when submitting invalid data", async () => {
    stubFetch({
      ok: false,
      json: async () => ({
        ok: false,
        message: "ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง",
      }),
    });

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "ไม่สามารถส่งข้อความได้"
    );

    fireEvent.change(screen.getByLabelText("ชื่อ"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    expect(
      await screen.findByText("ชื่อต้องมีอย่างน้อย 2 ตัวอักษร")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่อีกครั้ง")
    ).not.toBeInTheDocument();
  });

  it("renders server-side field errors returned by the API", async () => {
    stubFetch({
      ok: false,
      json: async () => ({ ok: false, errors: { email: "รูปแบบอีเมลไม่ถูกต้อง" } }),
    });

    render(<ContactForm />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "ส่งข้อความ" }));

    expect(
      await screen.findByText("รูปแบบอีเมลไม่ถูกต้อง")
    ).toBeInTheDocument();
  });
});
