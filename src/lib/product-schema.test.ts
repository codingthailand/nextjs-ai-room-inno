import { describe, expect, it } from "vitest";
import { productSchema } from "@/lib/product-schema";

const valid = {
  name: "iPhone 16 Pro",
  description: "สมาร์ทโฟน Apple",
  price: 45900,
  categoryId: 1,
};

describe("productSchema", () => {
  it("accepts valid input", () => {
    expect(productSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts string-form numbers (from form inputs)", () => {
    const result = productSchema.safeParse({
      ...valid,
      price: "45900.50",
      categoryId: "2",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(45900.5);
      expect(result.data.categoryId).toBe(2);
    }
  });

  it("rejects missing name", () => {
    expect(productSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
  });

  it("rejects non-positive price", () => {
    expect(productSchema.safeParse({ ...valid, price: 0 }).success).toBe(false);
    expect(productSchema.safeParse({ ...valid, price: -1 }).success).toBe(false);
  });

  it("rejects missing category", () => {
    expect(
      productSchema.safeParse({ ...valid, categoryId: undefined }).success
    ).toBe(false);
  });

  it("trims surrounding whitespace on name", () => {
    const result = productSchema.safeParse({ ...valid, name: "  iPhone  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("iPhone");
    }
  });

  it("accepts empty description", () => {
    expect(
      productSchema.safeParse({ ...valid, description: "" }).success
    ).toBe(true);
  });
});
