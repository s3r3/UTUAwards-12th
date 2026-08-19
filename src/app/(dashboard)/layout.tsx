"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  Settings,
  Shield,
  Package,
  Users,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { useTranslations } from "@/lib/i18n";
import { useSession, signOut } from "next-auth/react";
import type { ReactNode } from "react";
import type { Translations } from "@/lib/i18n/en";

type DashboardTranslationKey = keyof Translations['dashboard'];

const allMenuItems: { href: string; label: DashboardTranslationKey; icon: any }[] = [
  { href: "/dashboard", label: "overviewTitle", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "myOrders", icon: ShoppingBag },
  { href: "/dashboard/profile", label: "profile", icon: User },
  { href: "/dashboard/settings", label: "settings", icon: Settings },
];

const adminMenuItems: { href: string; label: DashboardTranslationKey; icon: any }[] = [
  { href: "/dashboard/admin", label: "adminOrders", icon: ShoppingBag },
  { href: "/dashboard/admin/products", label: "adminProducts", icon: Package },
  { href: "/dashboard/admin/users", label: "adminUsers", icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const t = useTranslations();
  const isAdmin = session?.user?.role === "ADMIN";
  const { theme, setTheme } = useUIStore();
  const isDark = theme === "dark";

  useEffect(() => {
    let cancelled = false;
    setTimeout(() => {
      if (!cancelled) setSidebarOpen(false);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const NavLink = ({ item }: { item: (typeof allMenuItems)[0] }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <Link
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <item.icon size={18} />
        {(t.dashboard[item.label] as string)}
      </Link>
    );
  };

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-gray-950 text-gray-200" : "bg-gray-50 text-gray-700"}`}
    >
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r transition-transform duration-200 md:translate-x-0 ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/" className="font-serif text-2xl font-bold">
            Acelora
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="p-3 space-y-1 mt-2">
          {allMenuItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {isAdmin && (
          <>
            <div className="px-3 pt-4 mt-2 border-t border-gray-200 dark:border-gray-800">
              <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                {(t.dashboard as Record<string, ReactNode>).adminPanel}
              </p>
            </div>
            <nav className="px-3 space-y-1">
              {adminMenuItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </nav>
          </>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 md:ml-64">
        {/* Top Navbar (mengganti header statis) */}
        <header
          className={`sticky top-0 z-20 h-16 flex items-center justify-between border-b px-4 gap-3 ${
            isDark ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <span className="text-sm text-gray-500">{session?.user?.name || "User"}</span>
        </header>

        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
