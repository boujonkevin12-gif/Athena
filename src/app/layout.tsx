import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Athena - Catálogo de Productos",
  description: "Descubrí nuestra selección de productos de belleza y cuidado personal",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}