"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/catalog/Header";
import Footer from "@/components/catalog/Footer";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />
      <main className="flex-1">
        <div className="bg-white py-12 lg:py-16 border-b border-[#EDE0C4]/30">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 text-center">
            <h1 className="font-display text-[36px] lg:text-[44px] font-light text-[#1a1a1a] mb-3">
              Categorías
            </h1>
            <p className="text-[#1a1a1a]/40 text-[15px] font-light">
              Explorá nuestra selección organizada para vos
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] bg-[#FAF6EE] overflow-hidden mb-4">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F5EDD9] to-[#FAF6EE]">
                      <span className="font-display text-[60px] text-[#1a1a1a]/8">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1a1a]/50 to-transparent pt-12 pb-5 px-5">
                    <span className="text-white text-[15px] font-medium uppercase tracking-[0.1em]">
                      {category.name}
                    </span>
                    <p className="text-white/60 text-[12px] font-light mt-1">
                      {category._count.products} productos
                    </p>
                  </div>
                </div>
                {category.description && (
                  <p className="text-[13px] text-[#1a1a1a]/40 font-light line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
