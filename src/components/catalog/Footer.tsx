"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

interface Settings {
  businessName: string;
  whatsapp: string | null;
  instagram: string | null;
  description: string | null;
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  return (
    <footer id="contacto" className="bg-[#1a1a1a] text-white">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <div>
            <h3 className="font-display text-[24px] font-light text-white mb-4">
              {settings?.businessName || "Athena"}
            </h3>
            <p className="text-white/40 text-[13px] leading-relaxed font-light max-w-xs">
              {settings?.description || "Descubrí nuestra selección de productos de belleza y cuidado personal."}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 mb-5">
              Navegación
            </h4>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-white/40 hover:text-white transition-colors duration-200 text-[13px] font-light">Inicio</Link>
              <Link href="/productos" className="text-white/40 hover:text-white transition-colors duration-200 text-[13px] font-light">Catálogo</Link>
              <Link href="/categorias" className="text-white/40 hover:text-white transition-colors duration-200 text-[13px] font-light">Categorías</Link>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 mb-5">
              Contacto
            </h4>
            <div className="flex flex-col gap-3">
              {settings?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-200 text-[13px] font-light"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  WhatsApp
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-200 text-[13px] font-light"
                >
                  <Instagram className="w-4 h-4" strokeWidth={1.5} />
                  @{settings.instagram}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-[12px] font-light">
            © {new Date().getFullYear()} {settings?.businessName || "Athena"}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
