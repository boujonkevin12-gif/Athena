"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, FolderOpen, TrendingUp, ShoppingBag, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  totalCategories: number;
  featuredProducts: number;
}

interface RecentProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
  category: { name: string };
  createdAt: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([products, categories]) => {
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p: RecentProduct) => p.active).length,
        outOfStock: products.filter((p: RecentProduct) => p.stock === 0).length,
        totalCategories: categories.length,
        featuredProducts: products.filter((p: RecentProduct) => p.active).length,
      });
      setRecentProducts(products.slice(0, 5));
    });
  }, []);

  const statCards = stats
    ? [
        { label: "Total productos", value: stats.totalProducts, icon: Package, color: "text-blue-600 bg-blue-50" },
        { label: "Productos activos", value: stats.activeProducts, icon: TrendingUp, color: "text-green-600 bg-green-50" },
        { label: "Sin stock", value: stats.outOfStock, icon: ShoppingBag, color: "text-red-600 bg-red-50" },
        { label: "Categorías", value: stats.totalCategories, icon: FolderOpen, color: "text-purple-600 bg-purple-50" },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Resumen de tu tienda</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Productos recientes</h2>
          <Link href="/admin/productos" className="text-sm text-primary-600 hover:text-primary-700">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={product.stock === 0 ? "text-red-500" : "text-gray-900"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No hay productos aún. Creá tu primer producto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
