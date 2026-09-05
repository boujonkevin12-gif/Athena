"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/catalog/Header";
import Footer from "@/components/catalog/Footer";
import ProductCard from "@/components/catalog/ProductCard";
import Link from "next/link";

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
  description: string | null;
}

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats: Category[]) => {
        const found = cats.find((c) => c.slug === params.slug);
        if (found) {
          setCategory(found);
          fetch("/api/products")
            .then((r) => r.json())
            .then((all: Product[]) => {
              setProducts(
                all.filter((p) => p.active && p.category.slug === params.slug)
              );
            });
        }
      });
  }, [params.slug]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />
      <main className="flex-1">
        <div className="bg-white py-12 lg:py-16 border-b border-[#EDE0C4]/30">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
            <nav className="flex items-center gap-2 text-[12px] text-[#1a1a1a]/30 mb-6">
              <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
              <span>/</span>
              <Link href="/categorias" className="hover:text-[#1a1a1a] transition-colors">Categorías</Link>
              <span>/</span>
              <span className="text-[#1a1a1a]/60">{category?.name || "Categoría"}</span>
            </nav>
            <h1 className="font-display text-[36px] lg:text-[44px] font-light text-[#1a1a1a]">
              {category?.name || "Categoría"}
            </h1>
            {category?.description && (
              <p className="text-[#1a1a1a]/40 text-[15px] mt-3 max-w-xl font-light">
                {category.description}
              </p>
            )}
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#1a1a1a]/30 text-[14px] font-light">
                No hay productos en esta categoría
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
