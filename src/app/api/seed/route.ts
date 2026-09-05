import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST() {
  try {
    const existingProducts = await prisma.product.findMany();
    if (existingProducts.length > 0) {
      return NextResponse.json({ message: "Database already seeded" });
    }

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: process.env.ADMIN_EMAIL || "admin@tienda.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await hash(
        process.env.ADMIN_PASSWORD || "admin123",
        12
      );

      await prisma.admin.create({
        data: {
          email: process.env.ADMIN_EMAIL || "admin@tienda.com",
          name: "Administrador",
          password: hashedPassword,
        },
      });
    }

    const existingSettings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    if (!existingSettings) {
      await prisma.settings.create({
        data: {
          businessName: "Athena",
          logo: "/uploads/logo.png",
          description: "Descubrí nuestra selección de productos de belleza y cuidado personal. Calidad y estilo para cada momento.",
          heroTitle: "Belleza que te representa",
          heroSubtitle: "Cosmética que realza tu esencia",
          heroDescription: "Productos seleccionados con amor para potenciar tu belleza natural, todos los días.",
          heroImage: "/uploads/hero.png",
          whatsapp: "5491112345678",
          instagram: "athenabeauty",
        },
      });
    }

    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length === 0) {
      const categories = [
        { name: "Maquillaje", slug: "maquillaje", order: 1 },
        { name: "Skincare", slug: "skincare", order: 2 },
        { name: "Labios", slug: "labios", order: 3 },
        { name: "Ojos", slug: "ojos", order: 4 },
        { name: "Rostro", slug: "rostro", order: 5 },
        { name: "Accesorios", slug: "accesorios", order: 6 },
        { name: "Combos", slug: "combos", order: 7 },
        { name: "Ofertas", slug: "ofertas", order: 8 },
      ];

      for (const cat of categories) {
        await prisma.category.create({ data: cat });
      }
    }

    const cats = await prisma.category.findMany();

    const products = [
      {
        name: "Base Luminous Skin",
        slug: "base-luminous-skin",
        description: "Base de maquillaje de cobertura media con acabado luminoso. Fórmula ligera que se siente como una segunda piel.",
        price: 8500,
        previousPrice: 10000,
        categoryId: cats.find((c) => c.slug === "rostro")?.id || cats[0].id,
        stock: 15,
        featured: true,
        isNew: true,
        onSale: true,
        images: JSON.stringify([]),
      },
      {
        name: "Paleta de Sombras Sunset",
        slug: "paleta-sombras-sunset",
        description: "Paleta de 12 tonos cálidos inspirada en el atardecer. Acabado mate y shimmer para looks versátiles.",
        price: 12000,
        categoryId: cats.find((c) => c.slug === "ojos")?.id || cats[0].id,
        stock: 8,
        featured: true,
        isNew: false,
        onSale: false,
        images: JSON.stringify([]),
      },
      {
        name: "Gloss Pink Kiss",
        slug: "gloss-pink-kiss",
        description: "Brillo labial con efecto gloss y color rosado suave. Hidratante con vitamina E.",
        price: 3500,
        categoryId: cats.find((c) => c.slug === "labios")?.id || cats[0].id,
        stock: 25,
        featured: true,
        isNew: false,
        onSale: true,
        previousPrice: 4500,
        images: JSON.stringify([]),
      },
      {
        name: "Sérum Vitamina C",
        slug: "serum-vitamina-c",
        description: "Sérum facial antioxidante con vitamina C pura al 15%. Ilumina y protege tu piel.",
        price: 6800,
        categoryId: cats.find((c) => c.slug === "skincare")?.id || cats[0].id,
        stock: 12,
        featured: true,
        isNew: true,
        onSale: false,
        images: JSON.stringify([]),
      },
      {
        name: "Rímel Volumen Extremo",
        slug: "rimel-volumen-extremo",
        description: "Máscara de pestañas que ofrece volumen y longitud espectacular hasta por 24 horas.",
        price: 4200,
        categoryId: cats.find((c) => c.slug === "ojos")?.id || cats[0].id,
        stock: 20,
        featured: false,
        isNew: false,
        onSale: false,
        images: JSON.stringify([]),
      },
      {
        name: "Crema Hidratante Rose",
        slug: "crema-hidratante-rose",
        description: "Crema hidratante con extracto de rosa mosqueta. Nutre y suaviza la piel profundamente.",
        price: 5500,
        categoryId: cats.find((c) => c.slug === "skincare")?.id || cats[0].id,
        stock: 18,
        featured: false,
        isNew: false,
        onSale: true,
        previousPrice: 7000,
        images: JSON.stringify([]),
      },
      {
        name: "Set de Brochas Professional",
        slug: "set-brochas-professional",
        description: "Set de 10 brochas profesionales de maquillaje. Cerdas sintéticas de alta calidad.",
        price: 9800,
        categoryId: cats.find((c) => c.slug === "accesorios")?.id || cats[0].id,
        stock: 10,
        featured: true,
        isNew: false,
        onSale: false,
        images: JSON.stringify([]),
      },
      {
        name: "Combo Skincare Básico",
        slug: "combo-skincare-basico",
        description: "Pack completo: limpiador, tónico, sérum y crema hidratante. Todo lo que necesitas para tu rutina.",
        price: 18500,
        previousPrice: 22000,
        categoryId: cats.find((c) => c.slug === "combos")?.id || cats[0].id,
        stock: 6,
        featured: true,
        isNew: false,
        onSale: true,
        images: JSON.stringify([]),
      },
      {
        name: "Rubor Peach Glow",
        slug: "rubor-peach-glow",
        description: "Rubor en polvo con brillo sutil tono durazno. Resultado natural y duradero.",
        price: 4800,
        categoryId: cats.find((c) => c.slug === "rostro")?.id || cats[0].id,
        stock: 0,
        featured: false,
        isNew: true,
        onSale: false,
        images: JSON.stringify([]),
      },
      {
        name: "Bálsamo Labial Nutritivo",
        slug: "balsamo-labial-nutritivo",
        description: "Bálsamo labial con miel y manteca de karité. Labios suaves y protegidos.",
        price: 2200,
        categoryId: cats.find((c) => c.slug === "labios")?.id || cats[0].id,
        stock: 30,
        featured: false,
        isNew: false,
        onSale: false,
        images: JSON.stringify([]),
      },
      {
        name: "Iluminador Liquid Gold",
        slug: "iluminador-liquid-gold",
        description: "Iluminador líquido tono dorado para un efecto radiante y sofisticado.",
        price: 5200,
        categoryId: cats.find((c) => c.slug === "rostro")?.id || cats[0].id,
        stock: 14,
        featured: false,
        isNew: true,
        onSale: false,
        images: JSON.stringify([]),
      },
      {
        name: "Esponja de Maquillaje",
        slug: "esponja-maquillaje",
        description: "Esponja de maquillaje en forma de gota. Aplicación perfecta de base y corrector.",
        price: 1800,
        categoryId: cats.find((c) => c.slug === "accesorios")?.id || cats[0].id,
        stock: 40,
        featured: false,
        isNew: false,
        onSale: false,
        images: JSON.stringify([]),
      },
    ];

    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Error seeding database" },
      { status: 500 }
    );
  }
}
