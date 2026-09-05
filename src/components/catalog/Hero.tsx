"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Settings {
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroDescription: string | null;
  heroImage: string | null;
}

export default function Hero() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  return (
    <section className="relative h-[420px] lg:h-[480px] overflow-hidden bg-[#F5EDD9]">
      {settings?.heroImage ? (
        <img
          src={settings.heroImage}
          alt="Productos Athena"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#F5EDD9] to-[#EDE0C4]/60" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-[#FDFBF7]/95 via-[#FDFBF7]/70 to-transparent" />

      <div className="relative max-w-[1400px] mx-auto h-full px-5 sm:px-8 lg:px-12">
        <div className="flex items-center h-full">
          <div className="max-w-lg py-10">
            <span className="inline-block text-[11px] font-medium uppercase tracking-[0.2em] text-[#C07D5E] mb-5">
              {settings?.heroSubtitle || "Cosmética que realza tu esencia"}
            </span>
            <h1 className="font-display text-[42px] sm:text-[52px] lg:text-[60px] leading-[1.05] font-light text-[#1a1a1a] mb-6">
              {settings?.heroTitle || "Belleza que te representa"}
            </h1>
            <p className="text-[#1a1a1a]/50 text-[15px] leading-relaxed mb-9 max-w-md font-light">
              {settings?.heroDescription || "Productos seleccionados con amor para potenciar tu belleza natural, todos los días."}
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-3.5 text-[13px] font-medium uppercase tracking-[0.08em] hover:bg-[#2a2a2a] transition-colors duration-300 group"
            >
              Explorar catálogo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}