"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/catalog/Header";
import Footer from "@/components/catalog/Footer";
import { formatPrice } from "@/lib/utils";
import { MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  previousPrice: number | null;
  mainImage: string | null;
  images: string;
  stock: number;
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  category: { name: string; slug: string };
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [settings, setSettings] = useState<{ whatsapp: string | null } | null>(null);

  useEffect(() => {
    fetch(`/api/products`)
      .then((r) => r.json())
      .then((products: Product[]) => {
        const found = products.find((p) => p.slug === params.slug);
        if (found) {
          setProduct(found);
          setSelectedImage(found.mainImage || "");
        }
      });
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, [params.slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#1a1a1a]/30 text-[14px] font-light">Cargando producto...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages: string[] = [];
  if (product.mainImage) allImages.push(product.mainImage);
  try {
    const extra = JSON.parse(product.images);
    if (Array.isArray(extra)) allImages.push(...extra.filter((i: string) => i && i !== product.mainImage));
  } catch {}

  const discount = product.previousPrice
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : 0;

  const whatsappMessage = encodeURIComponent(
    `Hola, quería consultar por el producto ${product.name}`
  );

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: `Mirá este producto: ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado al portapapeles");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
      <Header />
      <main className="flex-1">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-6 lg:py-10">
          <nav className="flex items-center gap-2 text-[12px] text-[#1a1a1a]/30 mb-8 lg:mb-12">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/productos" className="hover:text-[#1a1a1a] transition-colors">Catálogo</Link>
            <span>/</span>
            <span className="text-[#1a1a1a]/60">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-[#FAF6EE] overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F5EDD9]">
                    <span className="font-display text-[80px] text-[#1a1a1a]/8">A</span>
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-[72px] h-[72px] overflow-hidden border transition-colors duration-200 ${
                        selectedImage === img
                          ? "border-[#1a1a1a]"
                          : "border-transparent hover:border-[#EDE0C4]"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:py-4">
              <p className="text-[11px] text-[#C07D5E] font-medium uppercase tracking-[0.15em] mb-3">
                {product.category.name}
              </p>

              <h1 className="font-display text-[32px] lg:text-[40px] font-light text-[#1a1a1a] leading-tight mb-5">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-[24px] font-medium text-[#1a1a1a]">
                  {formatPrice(product.price)}
                </span>
                {product.previousPrice && (
                  <span className="text-[16px] text-[#1a1a1a]/25 line-through">
                    {formatPrice(product.previousPrice)}
                  </span>
                )}
                {product.onSale && discount > 0 && (
                  <span className="text-[12px] font-medium text-[#C07D5E] uppercase tracking-[0.08em]">
                    -{discount}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
                <span className={`text-[13px] font-light ${product.stock > 0 ? "text-[#1a1a1a]/50" : "text-red-400"}`}>
                  {product.stock > 0 ? `Disponible (${product.stock} unidades)` : "Agotado"}
                </span>
              </div>

              {product.description && (
                <div className="mb-8">
                  <p className="text-[14px] text-[#1a1a1a]/50 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {settings?.whatsapp && product.stock > 0 && (
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full bg-[#1a1a1a] text-white py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] hover:bg-[#2a2a2a] transition-colors duration-300"
                  >
                    <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                    Consultar por WhatsApp
                  </a>
                )}

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2.5 w-full bg-white border border-[#EDE0C4]/60 text-[#1a1a1a]/60 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] hover:border-[#CDBFAE] transition-colors duration-300"
                >
                  <Share2 className="w-4 h-4" strokeWidth={1.5} />
                  Compartir producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
