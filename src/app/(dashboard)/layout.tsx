"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import UserSidebar from "@/components/user/UserSidebar";
import UserHeader from "@/components/user/UserHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Partner & admin have their own dedicated layouts (mirroring partner pattern)
  if (pathname.startsWith("/partner") || pathname.startsWith("/dashboard/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream text-gray-700 dark:bg-gray-950 dark:text-gray-200">
      {sidebarOpen && (
        <button aria-label="Tutup menu" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/40 md:hidden" />
      )}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-gray-200 transition-transform dark:border-gray-800 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => setSidebarOpen(false)} className="absolute right-3 top-4 rounded-lg p-1 text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-800" aria-label="Tutup menu"><X size={18} /></button>
        <UserSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>
      <div className="min-w-0 md:ml-72">
        <UserHeader onMenu={() => setSidebarOpen(true)} />
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
