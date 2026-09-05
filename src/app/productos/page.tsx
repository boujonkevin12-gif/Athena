"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/catalog/Header";
import Footer from "@/components/catalog/Footer";
import ProductCard from "@/components/catalog/ProductCard";
import { Search, X } from "lucide-react";

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

function ProductosContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data.filter((p) => p.active)));
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category.slug === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "recent":
      default:
        result.sort(
          (a, b) =>
            new Date(b.id).getTime() - new Date(a.id).getTime()
        );
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#FDFBF7]">
        <div className="bg-white py-12 lg:py-16 border-b border-[#EDE0C4]/30">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
            <h1 className="font-display text-[36px] lg:text-[44px] font-light text-[#1a1a1a] text-center mb-10">
              Catálogo
            </h1>

            <div className="max-w-lg mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/25" strokeWidth={1.5} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-11 pr-10 py-3 bg-[#FAF6EE] border border-[#EDE0C4]/60 text-[13px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#CDBFAE] transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/25 hover:text-[#1a1a1a]/50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
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

            <div className="flex justify-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white border border-[#EDE0C4]/60 text-[12px] text-[#1a1a1a]/60 uppercase tracking-[0.08em] focus:outline-none focus:border-[#CDBFAE]"
              >
                <option value="recent">Más recientes</option>
                <option value="price-asc">Precio menor</option>
                <option value="price-desc">Precio mayor</option>
                <option value="name">Nombre</option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#1a1a1a]/30 text-[14px] font-light">
                No se encontraron productos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ProductosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#1a1a1a]/30">Cargando...</div>}>
        <ProductosContent />
      </Suspense>
    </div>
  );
}
