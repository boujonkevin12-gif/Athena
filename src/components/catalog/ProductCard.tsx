"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Heart } from "lucide-react";

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
  category: {
    name: string;
  };
}

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.previousPrice
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0;

  return (
    <Link href={`/productos/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-[#FAF6EE] overflow-hidden mb-4">
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F5EDD9]">
            <span className="font-display text-4xl text-[#1a1a1a]/10">A</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="inline-flex px-2.5 py-1 bg-[#1a1a1a] text-white text-[10px] font-medium uppercase tracking-[0.1em]">
              Nuevo
            </span>
          )}
          {product.onSale && (
            <span className="inline-flex px-2.5 py-1 bg-[#C07D5E] text-white text-[10px] font-medium uppercase tracking-[0.1em]">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="inline-flex px-2.5 py-1 bg-[#1a1a1a]/60 text-white text-[10px] font-medium uppercase tracking-[0.1em]">
              Agotado
            </span>
          )}
        </div>

        <button
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Heart className="w-4 h-4 text-[#1a1a1a]/40" strokeWidth={1.5} />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <span className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3 text-[12px] font-medium uppercase tracking-[0.08em]">
            Ver producto
          </span>
        </div>
      </div>

      <div className="px-0.5">
        <p className="text-[11px] text-[#1a1a1a]/40 uppercase tracking-[0.12em] font-medium mb-1">
          {product.category.name}
        </p>
        <h3 className="font-display text-[17px] text-[#1a1a1a] font-medium leading-tight mb-1.5 group-hover:text-[#C07D5E] transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-medium text-[#1a1a1a]">
            {formatPrice(product.price)}
          </span>
          {product.previousPrice && (
            <span className="text-[13px] text-[#1a1a1a]/30 line-through">
              {formatPrice(product.previousPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
