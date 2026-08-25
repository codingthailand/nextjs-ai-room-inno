import { z } from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อสินค้า")
    .max(255, "ชื่อสินค้าต้องไม่เกิน 255 ตัวอักษร"),
  description: z.string().trim().max(5000, "รายละเอียดยาวเกินไป").optional(),
  price: z.coerce
    .number({ message: "ราคาต้องเป็นตัวเลข" })
    .positive("ราคาต้องมากกว่า 0"),
  categoryId: z.coerce
    .number({ message: "กรุณาเลือกหมวดหมู่" })
    .int("กรุณาเลือกหมวดหมู่")
    .positive("กรุณาเลือกหมวดหมู่"),
})

export type ProductFormValues = z.input<typeof productSchema>
export type ProductFormData = z.output<typeof productSchema>

export function productData(input: ProductFormData) {
  return {
    name: input.name,
    description: input.description || null,
    price: input.price,
    category_id: input.categoryId,
  };
}
