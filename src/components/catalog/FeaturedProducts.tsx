"use client";

import { useEffect, useState, useMemo } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  previousPrice: number | null;
  mainImage: string | null;
  stock: number;
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  active: boolean;
  category: { id: string; name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([allProducts, allCategories]) => {
      setProducts(allProducts.filter((p: Product) => p.active));
      setCategories(allCategories);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.featured);
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category.slug === selectedCategory);
    }
    return result.slice(0, 8);
  }, [products, selectedCategory]);

  if (products.length === 0) return null;

  return (
    <section className="bg-[#FDFBF7] py-16 lg:py-24">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] font-medium uppercase tracking-[0.2em] text-[#C07D5E] mb-3">
            Colección destacada
          </span>
          <h2 className="font-display text-[36px] lg:text-[44px] font-light text-[#1a1a1a]">
            Nuestros productos
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-5 py-2 text-[12px] font-medium uppercase tracking-[0.08em] transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-[#1a1a1a] text-white"
                : "bg-white text-[#1a1a1a]/60 border border-[#EDE0C4]/60 hover:border-[#CDBFAE]"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2 text-[12px] font-medium uppercase tracking-[0.08em] transition-all duration-200 ${
                selectedCategory === cat.slug
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-[#1a1a1a]/60 border border-[#EDE0C4]/60 hover:border-[#CDBFAE]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#1a1a1a]/30 text-[14px] font-light">
              No se encontraron productos en esta categoría
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
