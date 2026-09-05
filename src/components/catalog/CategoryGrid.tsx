"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-medium uppercase tracking-[0.2em] text-[#C07D5E] mb-3">
            Explorá
          </span>
          <h2 className="font-display text-[36px] lg:text-[44px] font-light text-[#1a1a1a]">
            Nuestras categorías
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] bg-[#FAF6EE] overflow-hidden mb-3">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#F5EDD9] to-[#FAF6EE]">
                    <span className="font-display text-[40px] text-[#1a1a1a]/8">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1a1a]/50 to-transparent pt-10 pb-4 px-3">
                  <span className="text-white text-[13px] font-medium uppercase tracking-[0.1em]">
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
