"use client";

import {
  Home,
  MessageCircle,
  FileText,
  Type,
  Package,
  Settings as SettingsIcon,
} from "lucide-react";
import { getAdminDict } from "@/lib/admin/i18n";

export type AdminSection =
  | "hero"
  | "whatsapp"
  | "settings"
  | "blogs"
  | "products"
  | "metadata";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  locale: string;
}

export default function AdminSidebar({ activeSection, onSectionChange, locale }: AdminSidebarProps) {
  const ui = getAdminDict(locale);

  const NAV_ITEMS: { section: AdminSection; label: string; icon: typeof Home }[] = [
    { section: "hero", label: ui.nav.homepage, icon: Home },
    { section: "whatsapp", label: ui.nav.whatsapp, icon: MessageCircle },
    { section: "blogs", label: ui.nav.blogs, icon: FileText },
    { section: "products", label: ui.nav.products, icon: Package },
    { section: "metadata", label: ui.nav.metadata, icon: Type },
    { section: "settings", label: ui.nav.settings, icon: SettingsIcon },
  ];

  return (
    <div className="sticky top-[73px] z-40 border-b border-admin-border bg-admin-card/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto px-4 sm:px-8 admin-scrollbar">
        {NAV_ITEMS.map(({ section, label, icon: Icon }) => {
          const isActive = activeSection === section;
          return (
            <button
              key={section}
              onClick={() => onSectionChange(section)}
              className={`group relative flex shrink-0 items-center gap-2 px-4 py-4 text-[14px] font-medium transition-colors duration-150 cursor-pointer ${
                isActive
                  ? "text-admin-text"
                  : "text-admin-text-secondary hover:text-admin-text"
              }`}
            >
              <span
                className={`pointer-events-none absolute inset-x-1 top-1 bottom-1 -z-10 rounded-[10px] transition-colors duration-150 ${
                  isActive ? "bg-admin-success-bg" : "bg-transparent group-hover:bg-admin-hover"
                }`}
              />
              <Icon
                className={`h-5 w-5 ${isActive ? "text-admin-primary" : "text-admin-text-secondary group-hover:text-admin-text"}`}
                strokeWidth={2}
              />
              {label}
              <span
                className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-admin-gold transition-transform duration-200 origin-left ${
                  isActive ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
