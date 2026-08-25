import prisma from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/admin";
import { productData, productSchema } from "@/lib/product-schema";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "ไม่พบสินค้า" }, { status: 400 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "ข้อมูลที่ส่งมาไม่ถูกต้อง" }, { status: 400 });
  }

  const parsed = productSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
      { status: 400 }
    );
  }

  const existing = await prisma.products.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  }

  const category = await prisma.categories.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!category) {
    return Response.json({ error: "หมวดหมู่ไม่ถูกต้อง" }, { status: 400 });
  }

  await prisma.products.update({
    where: { id },
    data: productData(parsed.data),
  });

  return Response.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "ไม่พบสินค้า" }, { status: 400 });
  }

  const existing = await prisma.products.findUnique({ where: { id } });
  if (!existing) {
    return Response.json({ error: "ไม่พบสินค้า" }, { status: 404 });
  }

  const orderItemCount = await prisma.order_items.count({
    where: { product_id: id },
  });
  if (orderItemCount > 0) {
    return Response.json(
      { error: "ไม่สามารถลบสินค้าที่มีคำสั่งซื้ออ้างอิงอยู่ได้" },
      { status: 409 }
    );
  }

  await prisma.products.delete({ where: { id } });

  return Response.json({ ok: true });
}
