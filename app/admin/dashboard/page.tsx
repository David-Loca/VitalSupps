"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Save,
  Loader2,
  Check,
  X,
  Home,
  Users,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  FileText,
  Edit,
  Type,
  AlignLeft,
  MessageCircle,
} from "lucide-react";
import { translations as defaultTranslations } from "@/lib/i18n";
import {
  normalizeAdminTranslationContent,
  normalizeAllTranslationsHero,
  normalizeInlineHeroText,
} from "@/lib/i18n/normalize-hero-text";
import BlogsManager from "@/components/admin/BlogsManager";
import DeploymentNotification from "@/components/admin/DeploymentNotification";
import { AdminHeroPreview } from "@/components/admin/AdminLocalePreview";
import AdminSidebar, { type AdminSection } from "@/components/admin/AdminSidebar";

interface Translations {
  [locale: string]: {
    content: any;
    sha: string;
    path: string;
  };
}

const WHATSAPP_MESSAGE_FIELDS: { key: string; label: string; hint?: string }[] = [
  {
    key: "floatingButton",
    label: "Floating button (corner chat)",
    hint: "Pre-filled when visitors tap the floating WhatsApp icon.",
  },
  {
    key: "defaultButton",
    label: "Default WhatsApp button",
  },
  {
    key: "ctaSection",
    label: "CTA section button",
  },
  {
    key: "homePage",
    label: "Homepage channels CTA",
  },
  {
    key: "pricingPlan",
    label: "Pricing card “Buy now”",
    hint: "Use {planName} where the plan title should appear.",
  },
  {
    key: "contactQuestion",
    label: "Footer / contact question",
  },
  {
    key: "installationHelp",
    label: "Installation pages help",
  },
  {
    key: "resellerInterest",
    label: "Reseller program",
  },
  {
    key: "notFoundHelp",
    label: "404 page",
  },
  {
    key: "tooltip",
    label: "Floating button tooltip",
  },
  {
    key: "contactButton",
    label: "Installation “Contact” link text",
  },
  {
    key: "ariaFloating",
    label: "Accessibility label (floating button)",
  },
  {
    key: "ariaFreeTest",
    label: "Accessibility label (WhatsApp info button)",
  },
];

const LOCALE_LABELS: Record<string, string> = {
  en: "EN",
  fr: "FR",
  it: "IT",
};

const ADMIN_LOCALE_ORDER = ["en", "fr", "it"] as const;

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [translations, setTranslations] = useState<Translations>({});
  const [metadata, setMetadata] = useState<Record<string, any>>({});
  // Managed links removed (clients requested no outbound link editing)
  const [activeLocale, setActiveLocale] = useState("en");
  const [activeSection, setActiveSection] = useState<AdminSection>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeploymentNotification, setShowDeploymentNotification] = useState(false);
  const router = useRouter();

  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/admin/verify/");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/admin/login");
          return;
        }

        setIsAuthenticated(true);
        await Promise.all([loadTranslations(), loadMetadata()]);
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Load translations
  const loadTranslations = async () => {
    try {
      const response = await fetch("/api/admin/translations/", { cache: "no-store" });
      const data = (await response.json()) as Translations;
      setTranslations(normalizeAllTranslationsHero(data));
    } catch (error) {
      console.error("Failed to load translations:", error);
    }
  };

  // Load metadata
  const loadMetadata = async () => {
    try {
      const response = await fetch("/api/admin/metadata/", { cache: "no-store" });
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error("Failed to load metadata:", error);
    }
  };

  // (removed) loadManagedLinks

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout/", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Save translations
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    setSaveErrorMessage(null);

    const entry = translations[activeLocale];
    if (!entry?.content) {
      setSaveStatus("error");
      setSaveErrorMessage(
        "Translations are not loaded for this language. Refresh the page and try again."
      );
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/translations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: activeLocale,
          content: normalizeAdminTranslationContent(entry.content),
          sha: entry.sha ?? "",
        }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        content?: Record<string, unknown>;
        sha?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "Failed to save translations");
      }

      const savedContent = normalizeAdminTranslationContent(
        (body.content ?? entry.content) as Record<string, unknown>
      );

      setTranslations((prev) => ({
        ...prev,
        [activeLocale]: {
          ...(prev[activeLocale] ?? { path: `lib/i18n/translations/${activeLocale}.json` }),
          content: savedContent,
          sha: body.sha ?? prev[activeLocale]?.sha ?? "",
        },
      }));

      setSaveStatus("success");
      setShowDeploymentNotification(true);

      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
      setSaveErrorMessage(
        error instanceof Error ? error.message : "Failed to save translations"
      );
      setTimeout(() => setSaveStatus("idle"), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Save metadata
  const handleSaveMetadata = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    setSaveErrorMessage(null);

    const entry = metadata[activeLocale];
    if (!entry?.content) {
      setSaveStatus("error");
      setSaveErrorMessage(
        "Metadata is not loaded for this language. Refresh the page and try again."
      );
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/metadata/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale: activeLocale,
          content: entry.content,
          sha: entry.sha ?? "",
        }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
        content?: Record<string, unknown>;
        sha?: string;
      };

      if (!response.ok) {
        throw new Error(body.error || "Failed to save metadata");
      }

      setMetadata((prev) => ({
        ...prev,
        [activeLocale]: {
          ...(prev[activeLocale] ?? { path: `data/metadata/${activeLocale}.json` }),
          content: body.content ?? entry.content,
          sha: body.sha ?? prev[activeLocale]?.sha ?? "",
        },
      }));

      setSaveStatus("success");
      setShowDeploymentNotification(true);

      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus("error");
      setSaveErrorMessage(
        error instanceof Error ? error.message : "Failed to save metadata"
      );
      setTimeout(() => setSaveStatus("idle"), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // (removed) handleSaveLinks

  // Update translation value (string or boolean)
  const updateValue = (path: string, value: string | boolean) => {
    const keys = path.split(".");
    let storedValue: string | boolean = value;
    if (typeof value === "string" && keys[0] === "hero") {
      storedValue = normalizeInlineHeroText(value);
    }

    const newTranslations = { ...translations };
    if (!newTranslations[activeLocale]) {
      newTranslations[activeLocale] = { content: {}, sha: "", path: "" };
    }
    if (!newTranslations[activeLocale].content) {
      newTranslations[activeLocale].content = {};
    }

    let current: Record<string, unknown> = newTranslations[activeLocale].content as Record<
      string,
      unknown
    >;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = storedValue;
    setTranslations(newTranslations);
  };

  const getDefaultValue = (localeKey: string, path: string): string => {
    const keys = path.split(".");
    // Use static translation JSON shipped with the app as a fallback
    let current: any = (defaultTranslations as any)[localeKey];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        return "";
      }
    }

    return String(current);
  };

  const getValue = (path: string): string => {
    const keys = path.split(".");
    let current: any = translations[activeLocale]?.content;
    
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // If the key isn't present in GitHub-backed translations,
        // fall back to the built-in translation JSON (per locale, then EN)
        return (
          getDefaultValue(activeLocale, path) ||
          getDefaultValue("fr", path) ||
          ""
        );
      }
    }
    
    return String(current);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-dark-text animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentContent = translations[activeLocale]?.content;
  const sortedLocales = ADMIN_LOCALE_ORDER.filter((code) => translations[code]);

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-auto shrink-0">
                <Image
                  src="/logo/Logo3-removebg-preview.png"
                  alt="Logo"
                  width={135}
                  height={36}
                  className="h-full w-auto object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-medium text-dark-text">Website Editor</h1>
                <p className="text-sm text-gray-500 font-light mt-0.5">Edit content, images, and settings</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {sortedLocales.map((locale) => (
                  <button
                    key={locale}
                    onClick={() => setActiveLocale(locale)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeLocale === locale
                        ? "bg-white text-dark-text shadow-sm"
                        : "text-gray-600 hover:text-dark-text"
                    }`}
                  >
                    {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Preview Toggle */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-all"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Save Button */}
              <button
                onClick={
                  activeSection === "metadata" ? handleSaveMetadata : handleSave
                }
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue-dark text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
                  </>
                ) : saveStatus === "error" ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Error</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 font-medium rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          {saveErrorMessage ? (
            <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {saveErrorMessage}
            </p>
          ) : null}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          {/* Main Editor */}
          <div className="col-span-9">
            {currentContent && (
              <>
                {/* Hero Section Editor */}
                {activeSection === "hero" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-medium text-dark-text mb-1">
                        Homepage Hero
                      </h2>
                      <p className="text-gray-500 text-sm mb-6">
                        Edit your homepage hero section
                      </p>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Main Heading
                          </label>
                          <input
                            type="text"
                            value={getValue("hero.title")}
                            onChange={(e) => updateValue("hero.title", e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent text-lg font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subtitle Part 1
                            </label>
                            <input
                              type="text"
                              value={getValue("hero.subtitlePart1")}
                              onChange={(e) => updateValue("hero.subtitlePart1", e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subtitle Part 2 <span className="text-blue-600">(Highlighted)</span>
                            </label>
                            <input
                              type="text"
                              value={getValue("hero.subtitlePart2")}
                              onChange={(e) => updateValue("hero.subtitlePart2", e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-blue-600 font-medium focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 rounded-lg border border-gray-100 bg-gray-50/80 p-4">
                          <p className="text-sm text-gray-600">
                            The hero paragraph is one continuous block on the site (with links in
                            the middle). Edit each part below — line breaks are removed
                            automatically so text does not jump to a new line.
                          </p>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Opening sentence
                            </label>
                            <textarea
                              value={getValue("hero.description")}
                              onChange={(e) => updateValue("hero.description", e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent resize-none"
                            />
                          </div>
                          {(
                            [
                              ["channelsLink", "Channel link text (blue, links to pricing)"],
                              ["description2", "After channel link"],
                              ["officialSmartersLinkText", "Legacy player link label"],
                              ["officialIboLinkText", "IBO player link label"],
                              ["description3", "After player links (e.g. “, etc. (Smart TV…)”)"],
                              ["m3uLink", "M3U / Xtream link text"],
                              ["description4", "After M3U link"],
                              ["freeTest", "Free test highlight"],
                              ["description5", "Closing sentence"],
                            ] as const
                          ).map(([key, label]) => (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {label}
                              </label>
                              <input
                                type="text"
                                value={getValue(`hero.${key}`)}
                                onChange={(e) => updateValue(`hero.${key}`, e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {showPreview && (
                      <AdminHeroPreview locale={activeLocale} getValue={getValue} />
                    )}
                  </div>
                )}

                {/* WhatsApp & CTA messages */}
                {activeSection === "whatsapp" && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-2xl font-medium text-dark-text mb-1 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        WhatsApp pre-filled messages
                      </h2>
                      <p className="text-gray-500 text-sm mb-6">
                        Each field is sent as the opening message in WhatsApp when that button is
                        clicked on the {LOCALE_LABELS[activeLocale] ?? activeLocale} site.
                      </p>

                      <div className="space-y-5">
                        {WHATSAPP_MESSAGE_FIELDS.map(({ key, label, hint }) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {label}
                            </label>
                            {hint ? (
                              <p className="text-xs text-gray-500 mb-2">{hint}</p>
                            ) : null}
                            <textarea
                              value={getValue(`whatsapp.${key}`)}
                              onChange={(e) => updateValue(`whatsapp.${key}`, e.target.value)}
                              rows={key === "pricingPlan" ? 2 : 3}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent resize-y"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-dark-text mb-4">CTA section (homepage)</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        {(["title", "title2", "title3"] as const).map((key) => (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title line — {key}
                            </label>
                            <input
                              type="text"
                              value={getValue(`cta.${key}`)}
                              onChange={(e) => updateValue(`cta.${key}`, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={getValue("cta.description")}
                            onChange={(e) => updateValue("cta.description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              WhatsApp button label
                            </label>
                            <input
                              type="text"
                              value={getValue("cta.whatsapp")}
                              onChange={(e) => updateValue("cta.whatsapp", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email button label
                            </label>
                            <input
                              type="text"
                              value={getValue("cta.email")}
                              onChange={(e) => updateValue("cta.email", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-dark-text mb-4">Contact strip</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Heading
                          </label>
                          <input
                            type="text"
                            value={getValue("contactSection.title")}
                            onChange={(e) => updateValue("contactSection.title", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={getValue("contactSection.description")}
                            onChange={(e) =>
                              updateValue("contactSection.description", e.target.value)
                            }
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Blogs Section Editor */}
                {activeSection === "blogs" && (
                  <BlogsManager />
                )}

                {/* Metadata Section Editor */}
                {activeSection === "metadata" && (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <Type className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">Page Metadata</h2>
                          <p className="text-sm text-gray-600 mt-0.5">Edit SEO titles and descriptions for all pages</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Homepage */}
                      <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 border-b border-blue-800">
                          <div className="flex items-center gap-3">
                            <Home className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">Homepage</h3>
                            <span className="ml-auto px-2.5 py-1 bg-blue-500/30 text-white text-xs font-medium rounded-full">Main Page</span>
                          </div>
                        </div>
                        <div className="p-6 space-y-5">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              Page Title
                            </label>
                            <input
                              type="text"
                              value={metadata[activeLocale]?.content?.homepage?.title || ""}
                              onChange={(e) => {
                                const newMetadata = { ...metadata };
                                if (!newMetadata[activeLocale]) {
                                  newMetadata[activeLocale] = { content: {}, sha: "" };
                                }
                                newMetadata[activeLocale].content = {
                                  ...newMetadata[activeLocale].content,
                                  homepage: {
                                    ...newMetadata[activeLocale].content?.homepage,
                                    title: e.target.value,
                                  },
                                };
                                setMetadata(newMetadata);
                              }}
                              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              placeholder="Enter page title for SEO..."
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              Meta Description
                            </label>
                            <textarea
                              value={metadata[activeLocale]?.content?.homepage?.description || ""}
                              onChange={(e) => {
                                const newMetadata = { ...metadata };
                                if (!newMetadata[activeLocale]) {
                                  newMetadata[activeLocale] = { content: {}, sha: "" };
                                }
                                newMetadata[activeLocale].content = {
                                  ...newMetadata[activeLocale].content,
                                  homepage: {
                                    ...newMetadata[activeLocale].content?.homepage,
                                    description: e.target.value,
                                  },
                                };
                                setMetadata(newMetadata);
                              }}
                              rows={4}
                              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                              placeholder="Enter meta description for SEO..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Blog Listing */}
                      <div className="bg-white rounded-xl border-2 border-purple-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 border-b border-purple-800">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">Blog Listing Page</h3>
                            <span className="ml-auto px-2.5 py-1 bg-purple-500/30 text-white text-xs font-medium rounded-full">Content</span>
                          </div>
                        </div>
                        <div className="p-6 space-y-5">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                              Page Title
                            </label>
                            <input
                              type="text"
                              value={metadata[activeLocale]?.content?.blogListing?.title || ""}
                              onChange={(e) => {
                                const newMetadata = { ...metadata };
                                if (!newMetadata[activeLocale]) {
                                  newMetadata[activeLocale] = { content: {}, sha: "" };
                                }
                                newMetadata[activeLocale].content = {
                                  ...newMetadata[activeLocale].content,
                                  blogListing: {
                                    ...newMetadata[activeLocale].content?.blogListing,
                                    title: e.target.value,
                                  },
                                };
                                setMetadata(newMetadata);
                              }}
                              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                              placeholder="Enter page title for SEO..."
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
                              <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                              Meta Description
                            </label>
                            <textarea
                              value={metadata[activeLocale]?.content?.blogListing?.description || ""}
                              onChange={(e) => {
                                const newMetadata = { ...metadata };
                                if (!newMetadata[activeLocale]) {
                                  newMetadata[activeLocale] = { content: {}, sha: "" };
                                }
                                newMetadata[activeLocale].content = {
                                  ...newMetadata[activeLocale].content,
                                  blogListing: {
                                    ...newMetadata[activeLocale].content?.blogListing,
                                    description: e.target.value,
                                  },
                                };
                                setMetadata(newMetadata);
                              }}
                              rows={4}
                              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all"
                              placeholder="Enter meta description for SEO..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Blog Page */}
                      <div className="bg-white rounded-xl border-2 border-fuchsia-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 px-6 py-4 border-b border-fuchsia-800">
                          <div className="flex items-center gap-3">
                            <Edit className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">Blog Page</h3>
                            <span className="ml-auto px-2.5 py-1 bg-fuchsia-500/30 text-white text-xs font-medium rounded-full">SEO</span>
                          </div>
                        </div>
                        <div className="p-6 space-y-5">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
                              <span className="w-1.5 h-1.5 bg-fuchsia-600 rounded-full"></span>
                              Page Title
                            </label>
                            <input
                              type="text"
                              value={metadata[activeLocale]?.content?.blog?.title || ""}
                              onChange={(e) => {
                                const newMetadata = { ...metadata };
                                if (!newMetadata[activeLocale]) {
                                  newMetadata[activeLocale] = { content: {}, sha: "" };
                                }
                                newMetadata[activeLocale].content = {
                                  ...newMetadata[activeLocale].content,
                                  blog: {
                                    ...newMetadata[activeLocale].content?.blog,
                                    title: e.target.value,
                                  },
                                };
                                setMetadata(newMetadata);
                              }}
                              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all"
                              placeholder="Enter page title for SEO..."
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
                              <span className="w-1.5 h-1.5 bg-fuchsia-600 rounded-full"></span>
                              Meta Description
                            </label>
                            <textarea
                              value={metadata[activeLocale]?.content?.blog?.description || ""}
                              onChange={(e) => {
                                const newMetadata = { ...metadata };
                                if (!newMetadata[activeLocale]) {
                                  newMetadata[activeLocale] = { content: {}, sha: "" };
                                }
                                newMetadata[activeLocale].content = {
                                  ...newMetadata[activeLocale].content,
                                  blog: {
                                    ...newMetadata[activeLocale].content?.blog,
                                    description: e.target.value,
                                  },
                                };
                                setMetadata(newMetadata);
                              }}
                              rows={4}
                              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 resize-none transition-all"
                              placeholder="Enter meta description for SEO..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Installation Pages */}
                      <div className="bg-white rounded-xl border-2 border-green-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 border-b border-green-800">
                          <div className="flex items-center gap-3">
                            <SettingsIcon className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">Installation Pages</h3>
                            <span className="ml-auto px-2.5 py-1 bg-green-500/30 text-white text-xs font-medium rounded-full">5 Pages</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {[
                              { key: "windows", label: "Windows Installation", icon: "💻" },
                              { key: "ios", label: "iOS Installation", icon: "📱" },
                              { key: "firestick", label: "Firestick Installation", icon: "📺" },
                              { key: "smartTv", label: "Smart TV Installation", icon: "🖥️" },
                              { key: "guide", label: "Installation Guide", icon: "📖" },
                            ].map((page) => (
                              <div key={page.key} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-green-400 transition-all hover:shadow-md">
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="text-2xl">{page.icon}</span>
                                  <h4 className="font-semibold text-gray-900">{page.label}</h4>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                                      <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                                      Page Title
                                    </label>
                                    <input
                                      type="text"
                                      value={metadata[activeLocale]?.content?.installation?.[page.key]?.title || ""}
                                      onChange={(e) => {
                                        const newMetadata = { ...metadata };
                                        if (!newMetadata[activeLocale]) {
                                          newMetadata[activeLocale] = { content: {}, sha: "" };
                                        }
                                        if (!newMetadata[activeLocale].content.installation) {
                                          newMetadata[activeLocale].content.installation = {};
                                        }
                                        newMetadata[activeLocale].content.installation = {
                                          ...newMetadata[activeLocale].content.installation,
                                          [page.key]: {
                                            ...newMetadata[activeLocale].content.installation[page.key],
                                            title: e.target.value,
                                          },
                                        };
                                        setMetadata(newMetadata);
                                      }}
                                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                      placeholder="Enter page title..."
                                    />
                                  </div>
                                  <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                                      <span className="w-1 h-1 bg-green-600 rounded-full"></span>
                                      Meta Description
                                    </label>
                                    <textarea
                                      value={metadata[activeLocale]?.content?.installation?.[page.key]?.description || ""}
                                      onChange={(e) => {
                                        const newMetadata = { ...metadata };
                                        if (!newMetadata[activeLocale]) {
                                          newMetadata[activeLocale] = { content: {}, sha: "" };
                                        }
                                        if (!newMetadata[activeLocale].content.installation) {
                                          newMetadata[activeLocale].content.installation = {};
                                        }
                                        newMetadata[activeLocale].content.installation = {
                                          ...newMetadata[activeLocale].content.installation,
                                          [page.key]: {
                                            ...newMetadata[activeLocale].content.installation[page.key],
                                            description: e.target.value,
                                          },
                                        };
                                        setMetadata(newMetadata);
                                      }}
                                      rows={3}
                                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
                                      placeholder="Enter meta description..."
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Reseller Page */}
                      <div className="bg-white rounded-xl border-2 border-orange-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4 border-b border-orange-800">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">Reseller Program Page</h3>
                            <span className="ml-auto px-2.5 py-1 bg-orange-500/30 text-white text-xs font-medium rounded-full">Business</span>
                          </div>
                        </div>
                        <div className="p-6 space-y-5">
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
                              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                              Page Title
                            </label>
                            <input
                              type="text"
                              value={metadata[activeLocale]?.content?.reseller?.title || ""}
                              onChange={(e) => {
                                const newMetadata = { ...metadata };
                                if (!newMetadata[activeLocale]) {
                                  newMetadata[activeLocale] = { content: {}, sha: "" };
                                }
                                newMetadata[activeLocale].content = {
                                  ...newMetadata[activeLocale].content,
                                  reseller: {
                                    ...newMetadata[activeLocale].content?.reseller,
                                    title: e.target.value,
                                  },
                                };
                                setMetadata(newMetadata);
                              }}
                              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                              placeholder="Enter page title for SEO..."
                            />
                          </div>
                          <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2.5">
                              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                              Meta Description
                            </label>
                            <textarea
                              value={metadata[activeLocale]?.content?.reseller?.description || ""}
                              onChange={(e) => {
                                const newMetadata = { ...metadata };
                                if (!newMetadata[activeLocale]) {
                                  newMetadata[activeLocale] = { content: {}, sha: "" };
                                }
                                newMetadata[activeLocale].content = {
                                  ...newMetadata[activeLocale].content,
                                  reseller: {
                                    ...newMetadata[activeLocale].content?.reseller,
                                    description: e.target.value,
                                  },
                                };
                                setMetadata(newMetadata);
                              }}
                              rows={4}
                              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all"
                              placeholder="Enter meta description for SEO..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Legal Pages */}
                      <div className="bg-white rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4 border-b border-slate-900">
                          <div className="flex items-center gap-3">
                            <AlignLeft className="w-5 h-5 text-white" />
                            <h3 className="text-lg font-semibold text-white">Legal Pages</h3>
                            <span className="ml-auto px-2.5 py-1 bg-white/15 text-white text-xs font-medium rounded-full">3 Pages</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {[
                              { key: "refundPolicy", label: "Refund Policy", accent: "bg-slate-700" },
                              { key: "privacyPolicy", label: "Privacy Policy", accent: "bg-slate-700" },
                              { key: "termsOfService", label: "Terms of Service", accent: "bg-slate-700" },
                            ].map((page) => (
                              <div
                                key={page.key}
                                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-slate-400 transition-all hover:shadow-md"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <span className={`w-2.5 h-2.5 rounded-full ${page.accent}`} />
                                  <h4 className="font-semibold text-gray-900">{page.label}</h4>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                      Page Title
                                    </label>
                                    <input
                                      type="text"
                                      value={metadata[activeLocale]?.content?.legal?.[page.key]?.title || ""}
                                      onChange={(e) => {
                                        const newMetadata = { ...metadata };
                                        if (!newMetadata[activeLocale]) {
                                          newMetadata[activeLocale] = { content: {}, sha: "" };
                                        }
                                        if (!newMetadata[activeLocale].content.legal) {
                                          newMetadata[activeLocale].content.legal = {};
                                        }
                                        newMetadata[activeLocale].content.legal = {
                                          ...newMetadata[activeLocale].content.legal,
                                          [page.key]: {
                                            ...newMetadata[activeLocale].content.legal[page.key],
                                            title: e.target.value,
                                          },
                                        };
                                        setMetadata(newMetadata);
                                      }}
                                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all"
                                      placeholder="Enter page title..."
                                    />
                                  </div>
                                  <div>
                                    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
                                      <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                      Meta Description
                                    </label>
                                    <textarea
                                      value={metadata[activeLocale]?.content?.legal?.[page.key]?.description || ""}
                                      onChange={(e) => {
                                        const newMetadata = { ...metadata };
                                        if (!newMetadata[activeLocale]) {
                                          newMetadata[activeLocale] = { content: {}, sha: "" };
                                        }
                                        if (!newMetadata[activeLocale].content.legal) {
                                          newMetadata[activeLocale].content.legal = {};
                                        }
                                        newMetadata[activeLocale].content.legal = {
                                          ...newMetadata[activeLocale].content.legal,
                                          [page.key]: {
                                            ...newMetadata[activeLocale].content.legal[page.key],
                                            description: e.target.value,
                                          },
                                        };
                                        setMetadata(newMetadata);
                                      }}
                                      rows={4}
                                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none transition-all"
                                      placeholder="Enter meta description..."
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Section Editor */}
                {activeSection === "settings" && (
                  <div className="space-y-6">
                    {/* Navigation Menu */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-dark-text mb-1">Navigation Menu</h3>
                      <p className="text-gray-500 text-sm mb-4">Edit navigation menu items</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { key: "home", label: "Home" },
                          { key: "pricing", label: "Pricing" },
                          { key: "features", label: "Features" },
                          { key: "faq", label: "FAQ" },
                          { key: "contact", label: "Contact" },
                          { key: "blog", label: "Blog" },
                          { key: "iptvReseller", label: "Reseller (legacy)" },
                        ].map((item) => (
                          <div key={item.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              {item.label}
                            </label>
                            <input
                              type="text"
                              value={getValue(`common.${item.key}`)}
                              onChange={(e) => updateValue(`common.${item.key}`, e.target.value)}
                              placeholder={item.label}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Deployment Notification */}
      <DeploymentNotification
        show={showDeploymentNotification}
        onClose={() => setShowDeploymentNotification(false)}
        type={saveStatus === "error" ? "error" : "success"}
      />
    </div>
  );
}
