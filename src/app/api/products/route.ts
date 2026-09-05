import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, previousPrice, categoryId, stock, mainImage, images, featured, isNew, onSale, active } = body;

  if (!name || !price || !categoryId) {
    return NextResponse.json({ error: "Name, price and category are required" }, { status: 400 });
  }

  let slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description: description || "",
      price: parseFloat(price),
      previousPrice: previousPrice ? parseFloat(previousPrice) : null,
      categoryId,
      stock: parseInt(stock) || 0,
      mainImage: mainImage || null,
      images: JSON.stringify(images || []),
      featured: featured || false,
      isNew: isNew || false,
      onSale: onSale || false,
      active: active !== false,
    },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
