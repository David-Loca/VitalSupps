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
import ProductsManager from "@/components/admin/ProductsManager";
import DeploymentNotification from "@/components/admin/DeploymentNotification";
import PreviewPanel from "@/components/admin/PreviewPanel";
import AdminSidebar, { type AdminSection } from "@/components/admin/AdminSidebar";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import Textarea from "@/components/admin/ui/Textarea";
import Card from "@/components/admin/ui/Card";
import SectionHero from "@/components/admin/ui/SectionHero";
import InfoBox from "@/components/admin/ui/InfoBox";
import TwoCol from "@/components/admin/ui/TwoCol";
import Badge from "@/components/admin/ui/Badge";

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
  es: "ES",
  de: "DE",
};

// Matches lib/i18n's real Locale union — every locale here has an actual
// translations/{locale}.json, data/metadata/{locale}.json, etc. behind it.
const ADMIN_LOCALE_ORDER = ["en", "fr", "es", "de"] as const;

const METADATA_PAGES: {
  section: string;
  label: string;
  badge: string;
  icon: typeof Home;
}[] = [
  { section: "homepage", label: "Homepage", badge: "Main page", icon: Home },
  { section: "blogListing", label: "Blog Listing Page", badge: "Content", icon: FileText },
  { section: "blog", label: "Blog Page", badge: "SEO", icon: Edit },
  { section: "reseller", label: "Reseller Program Page", badge: "Business", icon: Users },
];

const METADATA_INSTALLATION_PAGES: { key: string; label: string }[] = [
  { key: "windows", label: "Windows Installation" },
  { key: "ios", label: "iOS Installation" },
  { key: "firestick", label: "Firestick Installation" },
  { key: "smartTv", label: "Smart TV Installation" },
  { key: "guide", label: "Installation Guide" },
];

const METADATA_LEGAL_PAGES: { key: string; label: string }[] = [
  { key: "refundPolicy", label: "Refund Policy" },
  { key: "privacyPolicy", label: "Privacy Policy" },
  { key: "termsOfService", label: "Terms of Service" },
];

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

  // Read/write a metadata field, optionally nested under a sub-key
  // (e.g. section="installation", subKey="windows").
  const getMetadataField = (
    section: string,
    field: "title" | "description",
    subKey?: string
  ): string => {
    const content = metadata[activeLocale]?.content;
    const sectionValue = content?.[section];
    const target = subKey ? sectionValue?.[subKey] : sectionValue;
    return target?.[field] || "";
  };

  const updateMetadataField = (
    section: string,
    field: "title" | "description",
    value: string,
    subKey?: string
  ) => {
    setMetadata((prev) => {
      const entry = prev[activeLocale] ?? { content: {}, sha: "" };
      const content: Record<string, any> = { ...(entry.content ?? {}) };

      if (subKey) {
        content[section] = {
          ...(content[section] ?? {}),
          [subKey]: { ...(content[section]?.[subKey] ?? {}), [field]: value },
        };
      } else {
        content[section] = { ...(content[section] ?? {}), [field]: value };
      }

      return { ...prev, [activeLocale]: { ...entry, content } };
    });
  };

  if (isLoading) {
    return (
      <div className="admin-scope flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 text-admin-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const currentContent = translations[activeLocale]?.content;
  const sortedLocales = ADMIN_LOCALE_ORDER.filter((code) => translations[code]);

  return (
    <div className="admin-scope min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-admin-border bg-admin-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
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
                <h1 className="text-[18px] font-semibold text-admin-text leading-tight">
                  Website Editor
                </h1>
                <p className="text-[13px] text-admin-text-secondary mt-0.5">
                  Edit content, images, and settings
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-1 rounded-[12px] border border-admin-border bg-admin-hover p-1 h-[46px]">
                {sortedLocales.map((locale) => (
                  <button
                    key={locale}
                    onClick={() => setActiveLocale(locale)}
                    className={`h-full px-3 rounded-[9px] text-[13px] font-semibold transition-all cursor-pointer ${
                      activeLocale === locale
                        ? "bg-white text-admin-primary shadow-sm"
                        : "text-admin-text-secondary hover:text-admin-text"
                    }`}
                  >
                    {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Preview Toggle */}
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowPreview(!showPreview)}
                className="!px-3.5"
                aria-label="Toggle preview"
              >
                {showPreview ? (
                  <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
                ) : (
                  <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
                )}
              </Button>

              {/* Save Button */}
              <Button
                variant="primary"
                size="md"
                onClick={activeSection === "metadata" ? handleSaveMetadata : handleSave}
                disabled={isSaving}
                icon={
                  saveStatus === "success" ? (
                    <Check className="w-4 h-4" strokeWidth={2} />
                  ) : saveStatus === "error" ? (
                    <X className="w-4 h-4" strokeWidth={2} />
                  ) : (
                    <Save className="w-4 h-4" strokeWidth={2} />
                  )
                }
                loading={isSaving}
              >
                {isSaving ? "Saving..." : saveStatus === "success" ? "Saved" : saveStatus === "error" ? "Error" : "Save"}
              </Button>

              {/* Logout */}
              <Button
                variant="secondary"
                size="md"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" strokeWidth={2} />}
                className="hover:!bg-admin-danger-bg hover:!text-admin-danger hover:!border-admin-danger/20"
              >
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
          {saveErrorMessage ? (
            <p className="mt-3 rounded-admin-sm border-l-4 border-admin-danger bg-admin-danger-bg px-4 py-2 text-[14px] text-admin-danger">
              {saveErrorMessage}
            </p>
          ) : null}
        </div>
      </header>

      {/* Navigation */}
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8">
        <div className="admin-page-enter" key={activeSection}>
          {currentContent && (
              <>
                {/* Hero Section Editor */}
                {activeSection === "hero" && (
                  <div className="space-y-8">
                    <SectionHero
                      icon={<Home className="w-7 h-7" strokeWidth={2} />}
                      title="Homepage Hero"
                      subtitle="Edit your homepage hero section"
                    />

                    <Card>
                      <div className="space-y-6">
                        <Input
                          label="Main Heading"
                          value={getValue("hero.title")}
                          onChange={(e) => updateValue("hero.title", e.target.value)}
                          maxLength={120}
                          showCount
                          className="text-[18px] font-medium"
                        />

                        <TwoCol>
                          <Input
                            label="Subtitle Part 1"
                            badge="1"
                            value={getValue("hero.subtitlePart1")}
                            onChange={(e) => updateValue("hero.subtitlePart1", e.target.value)}
                            maxLength={60}
                            showCount
                          />
                          <Input
                            label={
                              <>
                                Subtitle Part 2{" "}
                                <span className="text-admin-gold font-normal">(Highlighted)</span>
                              </>
                            }
                            badge="2"
                            accent
                            value={getValue("hero.subtitlePart2")}
                            onChange={(e) => updateValue("hero.subtitlePart2", e.target.value)}
                            maxLength={60}
                            showCount
                          />
                        </TwoCol>

                        <InfoBox>
                          <p>
                            The hero paragraph is one continuous block on the site (with{" "}
                            <span className="text-admin-gold font-medium">links</span> in the
                            middle). Edit each part below — line breaks are removed automatically
                            so text does not jump to a new line.
                          </p>
                        </InfoBox>

                        <div className="space-y-5">
                          <Textarea
                            label="Opening sentence"
                            icon={<Edit className="w-3.5 h-3.5" strokeWidth={2} />}
                            value={getValue("hero.description")}
                            onChange={(e) => updateValue("hero.description", e.target.value)}
                            rows={3}
                            maxLength={160}
                            showCount
                          />
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
                            <Input
                              key={key}
                              label={label}
                              value={getValue(`hero.${key}`)}
                              onChange={(e) => updateValue(`hero.${key}`, e.target.value)}
                            />
                          ))}
                        </div>
                      </div>
                    </Card>

                    <Card
                      title="Announcement Bar"
                      subtitle="The thin strip shown above the header on every page, not just the homepage. Each message is optional — leave a field empty to hide that message entirely (no stray dot separator is shown). If all three are empty, the whole bar is hidden."
                    >
                      <div className="space-y-5">
                        {(
                          [
                            ["shipping", "Shipping message"],
                            ["guarantee", "Guarantee message"],
                            ["whatsapp", "WhatsApp / ordering message"],
                          ] as const
                        ).map(([key, label]) => (
                          <Input
                            key={key}
                            label={label}
                            value={getValue(`announcement.${key}`)}
                            onChange={(e) => updateValue(`announcement.${key}`, e.target.value)}
                            placeholder="Leave empty to hide this message"
                          />
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* WhatsApp & CTA messages */}
                {activeSection === "whatsapp" && (
                  <div className="space-y-8">
                    <SectionHero
                      icon={<MessageCircle className="w-7 h-7" strokeWidth={2} />}
                      title="WhatsApp & CTA"
                      subtitle="Pre-filled messages, homepage CTA and contact strip copy"
                    />

                    <Card
                      icon={<MessageCircle className="w-6 h-6 text-admin-primary" strokeWidth={2} />}
                      title="WhatsApp pre-filled messages"
                      subtitle={`Each field is sent as the opening message in WhatsApp when that button is clicked on the ${LOCALE_LABELS[activeLocale] ?? activeLocale} site.`}
                    >
                      <div className="space-y-5">
                        {WHATSAPP_MESSAGE_FIELDS.map(({ key, label, hint }) => (
                          <Textarea
                            key={key}
                            label={label}
                            hint={hint}
                            value={getValue(`whatsapp.${key}`)}
                            onChange={(e) => updateValue(`whatsapp.${key}`, e.target.value)}
                            rows={key === "pricingPlan" ? 2 : 3}
                          />
                        ))}
                      </div>
                    </Card>

                    <Card title="CTA section (homepage)">
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {(["title", "title2", "title3"] as const).map((key) => (
                            <Input
                              key={key}
                              label={`Title line — ${key}`}
                              value={getValue(`cta.${key}`)}
                              onChange={(e) => updateValue(`cta.${key}`, e.target.value)}
                            />
                          ))}
                        </div>
                        <Textarea
                          label="Description"
                          value={getValue("cta.description")}
                          onChange={(e) => updateValue("cta.description", e.target.value)}
                          rows={3}
                        />
                        <TwoCol>
                          <Input
                            label="WhatsApp button label"
                            value={getValue("cta.whatsapp")}
                            onChange={(e) => updateValue("cta.whatsapp", e.target.value)}
                          />
                          <Input
                            label="Email button label"
                            value={getValue("cta.email")}
                            onChange={(e) => updateValue("cta.email", e.target.value)}
                          />
                        </TwoCol>
                      </div>
                    </Card>

                    <Card title="Contact strip">
                      <div className="space-y-5">
                        <Input
                          label="Heading"
                          value={getValue("contactSection.title")}
                          onChange={(e) => updateValue("contactSection.title", e.target.value)}
                        />
                        <Textarea
                          label="Description"
                          value={getValue("contactSection.description")}
                          onChange={(e) =>
                            updateValue("contactSection.description", e.target.value)
                          }
                          rows={3}
                        />
                      </div>
                    </Card>
                  </div>
                )}
                {/* Blogs Section Editor */}
                {activeSection === "blogs" && (
                  <BlogsManager />
                )}

                {/* Products Section Editor */}
                {activeSection === "products" && (
                  <ProductsManager />
                )}

                {/* Metadata Section Editor */}
                {activeSection === "metadata" && (
                  <div className="space-y-8">
                    <SectionHero
                      icon={<Type className="w-7 h-7" strokeWidth={2} />}
                      title="Page Metadata"
                      subtitle="Edit SEO titles and descriptions for all pages"
                    />

                    {METADATA_PAGES.map(({ section, label, badge, icon: Icon }) => (
                      <Card
                        key={section}
                        icon={<Icon className="w-5 h-5 text-admin-primary" strokeWidth={2} />}
                        title={label}
                        headerAction={<Badge variant="primary">{badge}</Badge>}
                      >
                        <div className="space-y-5">
                          <Input
                            label="Page Title"
                            value={getMetadataField(section, "title")}
                            onChange={(e) => updateMetadataField(section, "title", e.target.value)}
                            placeholder="Enter page title for SEO..."
                          />
                          <Textarea
                            label="Meta Description"
                            value={getMetadataField(section, "description")}
                            onChange={(e) =>
                              updateMetadataField(section, "description", e.target.value)
                            }
                            rows={4}
                            placeholder="Enter meta description for SEO..."
                          />
                        </div>
                      </Card>
                    ))}

                    {/* Installation Pages */}
                    <Card
                      icon={<SettingsIcon className="w-5 h-5 text-admin-primary" strokeWidth={2} />}
                      title="Installation Pages"
                      headerAction={<Badge variant="gold">{METADATA_INSTALLATION_PAGES.length} Pages</Badge>}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {METADATA_INSTALLATION_PAGES.map((page) => (
                          <div
                            key={page.key}
                            className="rounded-admin-md border border-admin-border bg-admin-bg p-5 transition-all hover:border-admin-primary/30 hover:shadow-[var(--shadow-admin-card)]"
                          >
                            <h4 className="mb-4 font-semibold text-admin-text">{page.label}</h4>
                            <div className="space-y-4">
                              <Input
                                label="Page Title"
                                value={getMetadataField("installation", "title", page.key)}
                                onChange={(e) =>
                                  updateMetadataField("installation", "title", e.target.value, page.key)
                                }
                                placeholder="Enter page title..."
                                className="h-12"
                              />
                              <Textarea
                                label="Meta Description"
                                value={getMetadataField("installation", "description", page.key)}
                                onChange={(e) =>
                                  updateMetadataField(
                                    "installation",
                                    "description",
                                    e.target.value,
                                    page.key
                                  )
                                }
                                rows={3}
                                placeholder="Enter meta description..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Legal Pages */}
                    <Card
                      icon={<AlignLeft className="w-5 h-5 text-admin-primary" strokeWidth={2} />}
                      title="Legal Pages"
                      headerAction={<Badge variant="neutral">{METADATA_LEGAL_PAGES.length} Pages</Badge>}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {METADATA_LEGAL_PAGES.map((page) => (
                          <div
                            key={page.key}
                            className="rounded-admin-md border border-admin-border bg-admin-bg p-5 transition-all hover:border-admin-primary/30 hover:shadow-[var(--shadow-admin-card)]"
                          >
                            <h4 className="mb-4 font-semibold text-admin-text">{page.label}</h4>
                            <div className="space-y-4">
                              <Input
                                label="Page Title"
                                value={getMetadataField("legal", "title", page.key)}
                                onChange={(e) =>
                                  updateMetadataField("legal", "title", e.target.value, page.key)
                                }
                                placeholder="Enter page title..."
                                className="h-12"
                              />
                              <Textarea
                                label="Meta Description"
                                value={getMetadataField("legal", "description", page.key)}
                                onChange={(e) =>
                                  updateMetadataField("legal", "description", e.target.value, page.key)
                                }
                                rows={4}
                                placeholder="Enter meta description..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Settings Section Editor */}
                {activeSection === "settings" && (
                  <div className="space-y-8">
                    <SectionHero
                      icon={<SettingsIcon className="w-7 h-7" strokeWidth={2} />}
                      title="Settings"
                      subtitle="Edit navigation menu items"
                    />

                    <Card title="Navigation Menu" subtitle="Labels shown in the site header">
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
                          <Input
                            key={item.key}
                            label={item.label}
                            value={getValue(`common.${item.key}`)}
                            onChange={(e) => updateValue(`common.${item.key}`, e.target.value)}
                            placeholder={item.label}
                          />
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}
        </div>
      </div>

      {/* Live WYSIWYG preview — same-origin iframe of the real public route,
          fed with unsaved draft content over a BroadcastChannel. */}
      <PreviewPanel
        open={showPreview}
        onClose={() => setShowPreview(false)}
        locale={activeLocale}
        content={translations[activeLocale]?.content as Record<string, unknown> | undefined}
      />

      {/* Deployment Notification */}
      <DeploymentNotification
        show={showDeploymentNotification}
        onClose={() => setShowDeploymentNotification(false)}
        type={saveStatus === "error" ? "error" : "success"}
      />
    </div>
  );
}
