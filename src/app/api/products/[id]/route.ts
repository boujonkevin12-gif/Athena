import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, previousPrice, categoryId, stock, mainImage, images, featured, isNew, onSale, active } = body;

  const updateData: Record<string, unknown> = {};

  if (name !== undefined) {
    updateData.name = name;
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (product && product.name !== name) {
      let newSlug = slugify(name);
      const existing = await prisma.product.findUnique({ where: { slug: newSlug } });
      if (existing && existing.id !== params.id) {
        newSlug = `${newSlug}-${Date.now()}`;
      }
      updateData.slug = newSlug;
    }
  }
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = parseFloat(price);
  if (previousPrice !== undefined) updateData.previousPrice = previousPrice ? parseFloat(previousPrice) : null;
  if (categoryId !== undefined) updateData.categoryId = categoryId;
  if (stock !== undefined) updateData.stock = parseInt(stock);
  if (mainImage !== undefined) updateData.mainImage = mainImage;
  if (images !== undefined) updateData.images = JSON.stringify(images);
  if (featured !== undefined) updateData.featured = featured;
  if (isNew !== undefined) updateData.isNew = isNew;
  if (onSale !== undefined) updateData.onSale = onSale;
  if (active !== undefined) updateData.active = active;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: updateData,
    include: { category: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Product deleted" });
}
