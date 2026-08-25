import prisma from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/admin";
import { productData, productSchema } from "@/lib/product-schema";

const PAGE_SIZE = 10;

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
  const page = Math.max(Number.isFinite(rawPage) ? rawPage : 1, 1);

  const where = search ? { name: { contains: search } } : {};

  const [total, products] = await Promise.all([
    prisma.products.count({ where }),
    prisma.products.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { categories: true },
    }),
  ]);

  return Response.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name ?? "",
      description: p.description,
      price: Number(p.price ?? 0),
      categoryId: p.category_id,
      categoryName: p.categories?.name ?? null,
    })),
    total,
    page,
    pageSize: PAGE_SIZE,
  });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

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

  const category = await prisma.categories.findUnique({
    where: { id: parsed.data.categoryId },
  });
  if (!category) {
    return Response.json({ error: "หมวดหมู่ไม่ถูกต้อง" }, { status: 400 });
  }

  const product = await prisma.products.create({
    data: productData(parsed.data),
  });

  return Response.json({ id: product.id }, { status: 201 });
}
