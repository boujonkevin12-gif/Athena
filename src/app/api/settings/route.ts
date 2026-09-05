import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  let settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        businessName: "Naza Beauty",
        description: "Descubrí nuestra selección de productos de belleza y cuidado personal.",
        heroTitle: "Naza Beauty",
        heroSubtitle: "Tu belleza, nuestra pasión",
        heroDescription: "Descubrí productos seleccionados con cariño para realzar tu belleza natural",
        whatsapp: "5491112345678",
        instagram: "nazabeauty",
      },
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: body,
    create: { id: "singleton", ...body },
  });

  return NextResponse.json(settings);
}
