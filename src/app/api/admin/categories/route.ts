import prisma from "@/lib/prisma";
import { getAdminSession, unauthorized } from "@/lib/admin";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const categories = await prisma.categories.findMany({
    orderBy: { name: "asc" },
  });

  return Response.json({
    categories: categories.map((c) => ({ id: c.id, name: c.name ?? "" })),
  });
}
