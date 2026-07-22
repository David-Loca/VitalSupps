"use client";

import {
  Home,
  MessageCircle,
  FileText,
  Type,
  Settings as SettingsIcon,
} from "lucide-react";

export type AdminSection =
  | "hero"
  | "whatsapp"
  | "settings"
  | "blogs"
  | "metadata";

const NAV_ITEMS: { section: AdminSection; label: string; icon: typeof Home }[] = [
  { section: "hero", label: "Homepage", icon: Home },
  { section: "whatsapp", label: "WhatsApp & CTA", icon: MessageCircle },
  { section: "blogs", label: "Blogs", icon: FileText },
  { section: "metadata", label: "Page Metadata", icon: Type },
  { section: "settings", label: "Settings", icon: SettingsIcon },
];

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

export default function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <div className="col-span-3">
      <div className="sticky top-24">
        <div className="bg-white rounded-xl border border-gray-200 p-2">
          <nav className="space-y-1">
            {NAV_ITEMS.map(({ section, label, icon: Icon }) => (
              <button
                key={section}
                onClick={() => onSectionChange(section)}
                className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-3 text-left ${
                  activeSection === section
                    ? "bg-accent-blue text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
