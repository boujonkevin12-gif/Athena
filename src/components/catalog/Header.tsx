"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Instagram, Menu, X } from "lucide-react";

interface Settings {
  businessName: string;
  logo: string | null;
  instagram: string | null;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<Settings | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/productos?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Catálogo" },
    { href: "/categorias", label: "Categorías" },
    { href: "/#nosotros", label: "Nosotros" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-sm border-b border-[#EDE0C4]/40">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[76px]">
          <Link href="/" className="flex items-center">
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt={settings.businessName || "Athena"}
                className="h-12 lg:h-14 w-auto object-contain"
              />
            ) : (
              <span className="font-display text-[26px] lg:text-[30px] font-semibold text-[#1a1a1a] tracking-tight">
                {settings?.businessName || "Athena"}
              </span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors duration-200 uppercase tracking-[0.08em]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors duration-200"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>

            {settings?.instagram && (
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block p-2.5 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors duration-200"
              >
                <Instagram className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </a>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2.5 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors duration-200"
            >
              {menuOpen ? <X className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <Menu className="w-[18px] h-[18px]" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-5 animate-fade-in">
            <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/30" strokeWidth={1.5} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#EDE0C4]/60 text-[13px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#CDBFAE] transition-colors"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[#EDE0C4]/30 bg-[#FDFBF7] animate-fade-in">
          <nav className="px-5 py-6 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 px-4 text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#FAF6EE] transition-colors text-[13px] font-medium uppercase tracking-[0.08em]"
              >
                {link.label}
              </Link>
            ))}
            {settings?.instagram && (
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#FAF6EE] transition-colors text-[13px] font-medium uppercase tracking-[0.08em] flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
                Instagram
              </a>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
