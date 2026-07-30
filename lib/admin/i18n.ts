import type { Locale } from "@/lib/i18n";

/**
 * Translation dictionary for the admin/editor UI *chrome* itself — nav
 * labels, buttons, section headings, toasts, modals, empty states. This is
 * separate from `lib/i18n` (the public site's content, which the admin also
 * edits) and from the per-field content the admin authors (blog bodies,
 * product copy, etc.) — those stay exactly as typed, in whichever content
 * locale is active.
 *
 * Covers: login, header, nav, live preview toolbar, Homepage Hero,
 * WhatsApp & CTA, Page Metadata, Settings, Blogs/Products list chrome +
 * delete modals, the language toolbar, deployment toast, and the shared
 * blog/product editor chrome (title bar, content-block toolbar, empty
 * states). Deep per-field labels inside the block/variant/spec/review
 * sub-editors are intentionally out of scope for this pass and remain in
 * English.
 */

export type AdminLocale = Locale;

interface AdminDictionary {
  common: {
    save: string;
    saving: string;
    saved: string;
    error: string;
    logout: string;
    cancel: string;
    delete: string;
    deleting: string;
    edit: string;
    view: string;
    loading: string;
    uploadImage: string;
    changeImage: string;
    uploading: string;
    addItem: string;
  };
  login: {
    title: string;
    subtitle: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    signIn: string;
    signingIn: string;
    backToWebsite: string;
  };
  header: {
    title: string;
    subtitle: string;
  };
  nav: {
    homepage: string;
    whatsapp: string;
    blogs: string;
    products: string;
    metadata: string;
    settings: string;
  };
  preview: {
    title: string;
    desktop: string;
    tablet: string;
    mobile: string;
    openInNewTab: string;
    refresh: string;
    close: string;
  };
  hero: {
    title: string;
    subtitle: string;
    mainHeading: string;
    subtitlePart1: string;
    subtitlePart2: string;
    highlighted: string;
    infoBoxPrefix: string;
    infoBoxLinks: string;
    infoBoxSuffix: string;
    openingSentence: string;
    fieldLabels: {
      channelsLink: string;
      description2: string;
      officialSmartersLinkText: string;
      officialIboLinkText: string;
      description3: string;
      m3uLink: string;
      description4: string;
      freeTest: string;
      description5: string;
    };
    announcementTitle: string;
    announcementSubtitle: string;
    shipping: string;
    guarantee: string;
    whatsappMessage: string;
    placeholderEmpty: string;
  };
  whatsapp: {
    title: string;
    subtitle: string;
    messagesTitle: string;
    messagesSubtitle: string; // has {locale} placeholder
    ctaSectionTitle: string;
    titleLinePrefix: string; // "Title line — "
    description: string;
    whatsappButtonLabel: string;
    emailButtonLabel: string;
    contactStripTitle: string;
    heading: string;
    fields: Record<
      | "floatingButton"
      | "defaultButton"
      | "ctaSection"
      | "homePage"
      | "pricingPlan"
      | "contactQuestion"
      | "installationHelp"
      | "resellerInterest"
      | "notFoundHelp"
      | "tooltip"
      | "contactButton"
      | "ariaFloating"
      | "ariaFreeTest",
      { label: string; hint?: string }
    >;
  };
  metadata: {
    title: string;
    subtitle: string;
    pageTitle: string;
    metaDescription: string;
    pageTitlePlaceholder: string;
    metaDescriptionPlaceholder: string;
    pages: {
      homepage: string;
      homepageBadge: string;
      blogListing: string;
      blogListingBadge: string;
      blog: string;
      blogBadge: string;
      reseller: string;
      resellerBadge: string;
    };
    installationTitle: string;
    installationPagesSuffix: string; // "Pages" as in "5 Pages"
    installationItems: {
      windows: string;
      ios: string;
      firestick: string;
      smartTv: string;
      guide: string;
    };
    legalTitle: string;
    legalItems: {
      refundPolicy: string;
      privacyPolicy: string;
      termsOfService: string;
    };
  };
  settings: {
    title: string;
    subtitle: string;
    navMenuTitle: string;
    navMenuSubtitle: string;
    items: {
      home: string;
      pricing: string;
      features: string;
      faq: string;
      contact: string;
      blog: string;
      iptvReseller: string;
    };
  };
  blogs: {
    title: string;
    subtitle: string;
    createNew: string;
    loading: string;
    empty: string;
    createFirst: string;
    deleteTitle: string;
    deleteConfirmPrefix: string;
    deleteWarning: string;
  };
  products: {
    title: string;
    subtitle: string;
    createNew: string;
    loading: string;
    empty: string;
    createFirst: string;
    deleteTitle: string;
    deleteConfirmPrefix: string;
    deleteWarning: string;
    variant: string;
    variants: string;
  };
  localeToolbar: {
    title: string;
    subtitle: string;
    publish: string;
    primary: string;
    editing: string;
    ready: string;
    draft: string;
    mirrorEditing: string;
    copyToOthers: string; // "Copy {locale} → others" — {locale} placeholder
    copyWithSlugs: string;
  };
  editorChrome: {
    createBlogTitle: string;
    editBlogTitle: string;
    createBlogSubtitle: string;
    createProductTitle: string;
    editProductTitle: string;
    backToBlogs: string;
    backToProducts: string;
    saveBlog: string;
    saveProduct: string;
    contentBlocksTitle: string;
    contentBlocksSubtitle: string;
    noBlocks: string;
    addHeading: string;
    addText: string;
    addImage: string;
    addQuote: string;
    addList: string;
    rememberSave: string;
  };
  toast: {
    savedTitle: string;
    errorTitle: string;
    processingTitle: string;
    savedMessage: string;
    errorMessage: string;
    processingMessage: string;
    liveSiteNote: string;
  };
}

const en: AdminDictionary = {
  common: {
    save: "Save",
    saving: "Saving...",
    saved: "Saved",
    error: "Error",
    logout: "Logout",
    cancel: "Cancel",
    delete: "Delete",
    deleting: "Deleting...",
    edit: "Edit",
    view: "View",
    loading: "Loading...",
    uploadImage: "Upload Image",
    changeImage: "Change Image",
    uploading: "Uploading...",
    addItem: "+ Add Item",
  },
  login: {
    title: "Admin Access",
    subtitle: "Enter your credentials to continue",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    backToWebsite: "← Back to website",
  },
  header: {
    title: "Website Editor",
    subtitle: "Edit content, images, and settings",
  },
  nav: {
    homepage: "Homepage",
    whatsapp: "WhatsApp & CTA",
    blogs: "Blogs",
    products: "Products",
    metadata: "Page Metadata",
    settings: "Settings",
  },
  preview: {
    title: "Live preview",
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile",
    openInNewTab: "Open in new tab",
    refresh: "Refresh",
    close: "Close",
  },
  hero: {
    title: "Homepage Hero",
    subtitle: "Edit your homepage hero section",
    mainHeading: "Main Heading",
    subtitlePart1: "Subtitle Part 1",
    subtitlePart2: "Subtitle Part 2",
    highlighted: "(Highlighted)",
    infoBoxPrefix: "The hero paragraph is one continuous block on the site (with ",
    infoBoxLinks: "links",
    infoBoxSuffix:
      " in the middle). Edit each part below — line breaks are removed automatically so text does not jump to a new line.",
    openingSentence: "Opening sentence",
    fieldLabels: {
      channelsLink: "Channel link text (blue, links to pricing)",
      description2: "After channel link",
      officialSmartersLinkText: "Legacy player link label",
      officialIboLinkText: "IBO player link label",
      description3: "After player links (e.g. “, etc. (Smart TV…)”)",
      m3uLink: "M3U / Xtream link text",
      description4: "After M3U link",
      freeTest: "Free test highlight",
      description5: "Closing sentence",
    },
    announcementTitle: "Announcement Bar",
    announcementSubtitle:
      "The thin strip shown above the header on every page, not just the homepage. Each message is optional — leave a field empty to hide that message entirely (no stray dot separator is shown). If all three are empty, the whole bar is hidden.",
    shipping: "Shipping message",
    guarantee: "Guarantee message",
    whatsappMessage: "WhatsApp / ordering message",
    placeholderEmpty: "Leave empty to hide this message",
  },
  whatsapp: {
    title: "WhatsApp & CTA",
    subtitle: "Pre-filled messages, homepage CTA and contact strip copy",
    messagesTitle: "WhatsApp pre-filled messages",
    messagesSubtitle:
      "Each field is sent as the opening message in WhatsApp when that button is clicked on the {locale} site.",
    ctaSectionTitle: "CTA section (homepage)",
    titleLinePrefix: "Title line — ",
    description: "Description",
    whatsappButtonLabel: "WhatsApp button label",
    emailButtonLabel: "Email button label",
    contactStripTitle: "Contact strip",
    heading: "Heading",
    fields: {
      floatingButton: {
        label: "Floating button (corner chat)",
        hint: "Pre-filled when visitors tap the floating WhatsApp icon.",
      },
      defaultButton: { label: "Default WhatsApp button" },
      ctaSection: { label: "CTA section button" },
      homePage: { label: "Homepage channels CTA" },
      pricingPlan: {
        label: "Pricing card “Buy now”",
        hint: "Use {planName} where the plan title should appear.",
      },
      contactQuestion: { label: "Footer / contact question" },
      installationHelp: { label: "Installation pages help" },
      resellerInterest: { label: "Reseller program" },
      notFoundHelp: { label: "404 page" },
      tooltip: { label: "Floating button tooltip" },
      contactButton: { label: "Installation “Contact” link text" },
      ariaFloating: { label: "Accessibility label (floating button)" },
      ariaFreeTest: { label: "Accessibility label (WhatsApp info button)" },
    },
  },
  metadata: {
    title: "Page Metadata",
    subtitle: "Edit SEO titles and descriptions for all pages",
    pageTitle: "Page Title",
    metaDescription: "Meta Description",
    pageTitlePlaceholder: "Enter page title for SEO...",
    metaDescriptionPlaceholder: "Enter meta description for SEO...",
    pages: {
      homepage: "Homepage",
      homepageBadge: "Main page",
      blogListing: "Blog Listing Page",
      blogListingBadge: "Content",
      blog: "Blog Page",
      blogBadge: "SEO",
      reseller: "Reseller Program Page",
      resellerBadge: "Business",
    },
    installationTitle: "Installation Pages",
    installationPagesSuffix: "Pages",
    installationItems: {
      windows: "Windows Installation",
      ios: "iOS Installation",
      firestick: "Firestick Installation",
      smartTv: "Smart TV Installation",
      guide: "Installation Guide",
    },
    legalTitle: "Legal Pages",
    legalItems: {
      refundPolicy: "Refund Policy",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
    },
  },
  settings: {
    title: "Settings",
    subtitle: "Edit navigation menu items",
    navMenuTitle: "Navigation Menu",
    navMenuSubtitle: "Labels shown in the site header",
    items: {
      home: "Home",
      pricing: "Pricing",
      features: "Features",
      faq: "FAQ",
      contact: "Contact",
      blog: "Blog",
      iptvReseller: "Reseller (legacy)",
    },
  },
  blogs: {
    title: "Blog Management",
    subtitle: "Create and manage blog posts",
    createNew: "Create New Blog",
    loading: "Loading blogs...",
    empty: "No blog posts yet.",
    createFirst: "Create Your First Blog Post",
    deleteTitle: "Delete Blog Post?",
    deleteConfirmPrefix: "Are you sure you want to delete",
    deleteWarning: "This action cannot be undone.",
  },
  products: {
    title: "Product Management",
    subtitle: "Create and manage store products",
    createNew: "New Product",
    loading: "Loading products...",
    empty: "No products yet.",
    createFirst: "Create Your First Product",
    deleteTitle: "Delete Product?",
    deleteConfirmPrefix: "Are you sure you want to delete",
    deleteWarning: "This action cannot be undone.",
    variant: "variant",
    variants: "variants",
  },
  localeToolbar: {
    title: "Languages",
    subtitle:
      "Write in one language first, then copy or use mirror mode. Publish only the languages you select.",
    publish: "Publish:",
    primary: "Primary:",
    editing: "Editing:",
    ready: "ready",
    draft: "draft",
    mirrorEditing: "Mirror editing — changes apply to all published languages at once",
    copyToOthers: "Copy {locale} → others",
    copyWithSlugs: "Copy with slugs",
  },
  editorChrome: {
    createBlogTitle: "Create New Blog Post",
    editBlogTitle: "Edit Blog Post",
    createBlogSubtitle: "Design your blog post with complete freedom",
    createProductTitle: "New Product",
    editProductTitle: "Edit Product",
    backToBlogs: "Back to Blogs List",
    backToProducts: "Back to Products List",
    saveBlog: "Save Blog",
    saveProduct: "Save Product",
    contentBlocksTitle: "Content blocks",
    contentBlocksSubtitle:
      "Use block language tabs for per-language text, or turn on mirror editing above. Images are shared across languages.",
    noBlocks: "No content blocks yet. Click the buttons above to add content.",
    addHeading: "Heading",
    addText: "Text",
    addImage: "Image",
    addQuote: "Quote",
    addList: "List",
    rememberSave: "Remember to save your changes before leaving",
  },
  toast: {
    savedTitle: "Changes saved",
    errorTitle: "Something went wrong",
    processingTitle: "Processing...",
    savedMessage:
      "Your changes are saved. This dashboard keeps showing what you just saved. The public website updates after Vercel redeploys from GitHub (usually 1–3 minutes).",
    errorMessage: "An error occurred while saving. Please try again.",
    processingMessage: "Changes are being processed...",
    liveSiteNote: "Live site: GitHub → Vercel redeploy (1–3 min). Dashboard already shows your saved edits.",
  },
};

const fr: AdminDictionary = {
  common: {
    save: "Enregistrer",
    saving: "Enregistrement...",
    saved: "Enregistré",
    error: "Erreur",
    logout: "Déconnexion",
    cancel: "Annuler",
    delete: "Supprimer",
    deleting: "Suppression...",
    edit: "Modifier",
    view: "Voir",
    loading: "Chargement...",
    uploadImage: "Importer une image",
    changeImage: "Changer l'image",
    uploading: "Import en cours...",
    addItem: "+ Ajouter un élément",
  },
  login: {
    title: "Accès administrateur",
    subtitle: "Entrez vos identifiants pour continuer",
    passwordLabel: "Mot de passe",
    passwordPlaceholder: "Entrez votre mot de passe",
    signIn: "Se connecter",
    signingIn: "Connexion...",
    backToWebsite: "← Retour au site",
  },
  header: {
    title: "Éditeur du site",
    subtitle: "Modifiez le contenu, les images et les paramètres",
  },
  nav: {
    homepage: "Accueil",
    whatsapp: "WhatsApp & CTA",
    blogs: "Blog",
    products: "Produits",
    metadata: "Métadonnées",
    settings: "Paramètres",
  },
  preview: {
    title: "Aperçu en direct",
    desktop: "Ordinateur",
    tablet: "Tablette",
    mobile: "Mobile",
    openInNewTab: "Ouvrir dans un nouvel onglet",
    refresh: "Actualiser",
    close: "Fermer",
  },
  hero: {
    title: "Section d'accueil (Hero)",
    subtitle: "Modifiez la section principale de la page d'accueil",
    mainHeading: "Titre principal",
    subtitlePart1: "Sous-titre — partie 1",
    subtitlePart2: "Sous-titre — partie 2",
    highlighted: "(Mis en avant)",
    infoBoxPrefix: "Le paragraphe d'accroche forme un seul bloc continu sur le site (avec des ",
    infoBoxLinks: "liens",
    infoBoxSuffix:
      " au milieu). Modifiez chaque partie ci-dessous — les retours à la ligne sont supprimés automatiquement pour que le texte ne saute pas de ligne.",
    openingSentence: "Phrase d'introduction",
    fieldLabels: {
      channelsLink: "Texte du lien vers les chaînes (bleu, vers les tarifs)",
      description2: "Après le lien vers les chaînes",
      officialSmartersLinkText: "Libellé du lien lecteur historique",
      officialIboLinkText: "Libellé du lien lecteur IBO",
      description3: "Après les liens des lecteurs (ex. « , etc. (Smart TV…) »)",
      m3uLink: "Texte du lien M3U / Xtream",
      description4: "Après le lien M3U",
      freeTest: "Texte mis en avant pour l'essai gratuit",
      description5: "Phrase de conclusion",
    },
    announcementTitle: "Bandeau d'annonce",
    announcementSubtitle:
      "La bande fine affichée au-dessus de l'en-tête sur toutes les pages, pas seulement l'accueil. Chaque message est optionnel — laissez un champ vide pour le masquer entièrement (aucun point orphelin ne s'affiche). Si les trois sont vides, tout le bandeau est masqué.",
    shipping: "Message de livraison",
    guarantee: "Message de garantie",
    whatsappMessage: "Message WhatsApp / commande",
    placeholderEmpty: "Laisser vide pour masquer ce message",
  },
  whatsapp: {
    title: "WhatsApp & CTA",
    subtitle: "Messages pré-remplis, appel à l'action de l'accueil et texte du bloc contact",
    messagesTitle: "Messages WhatsApp pré-remplis",
    messagesSubtitle:
      "Chaque champ est envoyé comme message d'ouverture dans WhatsApp lorsque ce bouton est cliqué sur le site {locale}.",
    ctaSectionTitle: "Bloc CTA (accueil)",
    titleLinePrefix: "Ligne de titre — ",
    description: "Description",
    whatsappButtonLabel: "Libellé du bouton WhatsApp",
    emailButtonLabel: "Libellé du bouton e-mail",
    contactStripTitle: "Bandeau de contact",
    heading: "Titre",
    fields: {
      floatingButton: {
        label: "Bouton flottant (coin de l'écran)",
        hint: "Pré-rempli lorsque les visiteurs touchent l'icône WhatsApp flottante.",
      },
      defaultButton: { label: "Bouton WhatsApp par défaut" },
      ctaSection: { label: "Bouton du bloc CTA" },
      homePage: { label: "CTA « chaînes » de l'accueil" },
      pricingPlan: {
        label: "Bouton « Acheter » de la carte tarifaire",
        hint: "Utilisez {planName} à l'endroit où le nom de l'offre doit apparaître.",
      },
      contactQuestion: { label: "Question du pied de page / contact" },
      installationHelp: { label: "Aide des pages d'installation" },
      resellerInterest: { label: "Programme revendeur" },
      notFoundHelp: { label: "Page 404" },
      tooltip: { label: "Infobulle du bouton flottant" },
      contactButton: { label: "Texte du lien « Contact » (installation)" },
      ariaFloating: { label: "Libellé d'accessibilité (bouton flottant)" },
      ariaFreeTest: { label: "Libellé d'accessibilité (bouton info WhatsApp)" },
    },
  },
  metadata: {
    title: "Métadonnées des pages",
    subtitle: "Modifiez les titres et descriptions SEO de toutes les pages",
    pageTitle: "Titre de la page",
    metaDescription: "Meta description",
    pageTitlePlaceholder: "Saisissez le titre de la page pour le SEO...",
    metaDescriptionPlaceholder: "Saisissez la meta description pour le SEO...",
    pages: {
      homepage: "Accueil",
      homepageBadge: "Page principale",
      blogListing: "Page liste du blog",
      blogListingBadge: "Contenu",
      blog: "Page article de blog",
      blogBadge: "SEO",
      reseller: "Page programme revendeur",
      resellerBadge: "Business",
    },
    installationTitle: "Pages d'installation",
    installationPagesSuffix: "pages",
    installationItems: {
      windows: "Installation Windows",
      ios: "Installation iOS",
      firestick: "Installation Firestick",
      smartTv: "Installation Smart TV",
      guide: "Guide d'installation",
    },
    legalTitle: "Pages légales",
    legalItems: {
      refundPolicy: "Politique de remboursement",
      privacyPolicy: "Politique de confidentialité",
      termsOfService: "Conditions d'utilisation",
    },
  },
  settings: {
    title: "Paramètres",
    subtitle: "Modifiez les éléments du menu de navigation",
    navMenuTitle: "Menu de navigation",
    navMenuSubtitle: "Libellés affichés dans l'en-tête du site",
    items: {
      home: "Accueil",
      pricing: "Tarifs",
      features: "Fonctionnalités",
      faq: "FAQ",
      contact: "Contact",
      blog: "Blog",
      iptvReseller: "Revendeur (ancien)",
    },
  },
  blogs: {
    title: "Gestion du blog",
    subtitle: "Créez et gérez les articles de blog",
    createNew: "Créer un article",
    loading: "Chargement des articles...",
    empty: "Aucun article de blog pour le moment.",
    createFirst: "Créer votre premier article",
    deleteTitle: "Supprimer l'article ?",
    deleteConfirmPrefix: "Voulez-vous vraiment supprimer",
    deleteWarning: "Cette action est irréversible.",
  },
  products: {
    title: "Gestion des produits",
    subtitle: "Créez et gérez les produits de la boutique",
    createNew: "Nouveau produit",
    loading: "Chargement des produits...",
    empty: "Aucun produit pour le moment.",
    createFirst: "Créer votre premier produit",
    deleteTitle: "Supprimer le produit ?",
    deleteConfirmPrefix: "Voulez-vous vraiment supprimer",
    deleteWarning: "Cette action est irréversible.",
    variant: "variante",
    variants: "variantes",
  },
  localeToolbar: {
    title: "Langues",
    subtitle:
      "Rédigez d'abord dans une langue, puis copiez ou activez l'édition miroir. Ne publiez que les langues sélectionnées.",
    publish: "Publier :",
    primary: "Langue principale :",
    editing: "Édition :",
    ready: "prêt",
    draft: "brouillon",
    mirrorEditing: "Édition miroir — les modifications s'appliquent à toutes les langues publiées à la fois",
    copyToOthers: "Copier {locale} → autres",
    copyWithSlugs: "Copier avec les slugs",
  },
  editorChrome: {
    createBlogTitle: "Créer un nouvel article",
    editBlogTitle: "Modifier l'article",
    createBlogSubtitle: "Concevez votre article en toute liberté",
    createProductTitle: "Nouveau produit",
    editProductTitle: "Modifier le produit",
    backToBlogs: "Retour à la liste des articles",
    backToProducts: "Retour à la liste des produits",
    saveBlog: "Enregistrer l'article",
    saveProduct: "Enregistrer le produit",
    contentBlocksTitle: "Blocs de contenu",
    contentBlocksSubtitle:
      "Utilisez les onglets de langue des blocs pour le texte par langue, ou activez l'édition miroir ci-dessus. Les images sont partagées entre les langues.",
    noBlocks: "Aucun bloc de contenu pour le moment. Cliquez sur les boutons ci-dessus pour en ajouter.",
    addHeading: "Titre",
    addText: "Texte",
    addImage: "Image",
    addQuote: "Citation",
    addList: "Liste",
    rememberSave: "N'oubliez pas d'enregistrer vos modifications avant de quitter",
  },
  toast: {
    savedTitle: "Modifications enregistrées",
    errorTitle: "Une erreur est survenue",
    processingTitle: "Traitement en cours...",
    savedMessage:
      "Vos modifications sont enregistrées. Ce tableau de bord affiche déjà ce que vous venez d'enregistrer. Le site public se met à jour après le redéploiement Vercel depuis GitHub (généralement 1 à 3 minutes).",
    errorMessage: "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
    processingMessage: "Les modifications sont en cours de traitement...",
    liveSiteNote:
      "Site en ligne : redéploiement GitHub → Vercel (1 à 3 min). Le tableau de bord affiche déjà vos modifications enregistrées.",
  },
};

const es: AdminDictionary = {
  common: {
    save: "Guardar",
    saving: "Guardando...",
    saved: "Guardado",
    error: "Error",
    logout: "Cerrar sesión",
    cancel: "Cancelar",
    delete: "Eliminar",
    deleting: "Eliminando...",
    edit: "Editar",
    view: "Ver",
    loading: "Cargando...",
    uploadImage: "Subir imagen",
    changeImage: "Cambiar imagen",
    uploading: "Subiendo...",
    addItem: "+ Añadir elemento",
  },
  login: {
    title: "Acceso de administrador",
    subtitle: "Introduce tus credenciales para continuar",
    passwordLabel: "Contraseña",
    passwordPlaceholder: "Introduce tu contraseña",
    signIn: "Iniciar sesión",
    signingIn: "Iniciando sesión...",
    backToWebsite: "← Volver al sitio web",
  },
  header: {
    title: "Editor del sitio",
    subtitle: "Edita el contenido, las imágenes y los ajustes",
  },
  nav: {
    homepage: "Inicio",
    whatsapp: "WhatsApp y CTA",
    blogs: "Blog",
    products: "Productos",
    metadata: "Metadatos",
    settings: "Ajustes",
  },
  preview: {
    title: "Vista previa en directo",
    desktop: "Escritorio",
    tablet: "Tableta",
    mobile: "Móvil",
    openInNewTab: "Abrir en nueva pestaña",
    refresh: "Actualizar",
    close: "Cerrar",
  },
  hero: {
    title: "Sección principal (Hero)",
    subtitle: "Edita la sección principal de la página de inicio",
    mainHeading: "Título principal",
    subtitlePart1: "Subtítulo — parte 1",
    subtitlePart2: "Subtítulo — parte 2",
    highlighted: "(Destacado)",
    infoBoxPrefix: "El párrafo principal es un único bloque continuo en el sitio (con ",
    infoBoxLinks: "enlaces",
    infoBoxSuffix:
      " en el medio). Edita cada parte a continuación — los saltos de línea se eliminan automáticamente para que el texto no salte de línea.",
    openingSentence: "Frase de apertura",
    fieldLabels: {
      channelsLink: "Texto del enlace a canales (azul, enlaza a precios)",
      description2: "Después del enlace a canales",
      officialSmartersLinkText: "Etiqueta del reproductor clásico",
      officialIboLinkText: "Etiqueta del reproductor IBO",
      description3: "Después de los enlaces de reproductores (ej. «, etc. (Smart TV…)»)",
      m3uLink: "Texto del enlace M3U / Xtream",
      description4: "Después del enlace M3U",
      freeTest: "Texto destacado de prueba gratuita",
      description5: "Frase de cierre",
    },
    announcementTitle: "Barra de aviso",
    announcementSubtitle:
      "La franja fina que se muestra encima del encabezado en todas las páginas, no solo en el inicio. Cada mensaje es opcional — deja un campo vacío para ocultar ese mensaje por completo (no se muestra ningún punto huérfano). Si los tres están vacíos, toda la barra se oculta.",
    shipping: "Mensaje de envío",
    guarantee: "Mensaje de garantía",
    whatsappMessage: "Mensaje de WhatsApp / pedidos",
    placeholderEmpty: "Déjalo vacío para ocultar este mensaje",
  },
  whatsapp: {
    title: "WhatsApp y CTA",
    subtitle: "Mensajes predefinidos, CTA de inicio y texto del bloque de contacto",
    messagesTitle: "Mensajes predefinidos de WhatsApp",
    messagesSubtitle:
      "Cada campo se envía como mensaje inicial en WhatsApp cuando se pulsa ese botón en el sitio en {locale}.",
    ctaSectionTitle: "Sección CTA (inicio)",
    titleLinePrefix: "Línea de título — ",
    description: "Descripción",
    whatsappButtonLabel: "Etiqueta del botón de WhatsApp",
    emailButtonLabel: "Etiqueta del botón de correo",
    contactStripTitle: "Franja de contacto",
    heading: "Encabezado",
    fields: {
      floatingButton: {
        label: "Botón flotante (esquina de chat)",
        hint: "Se rellena al tocar el icono flotante de WhatsApp.",
      },
      defaultButton: { label: "Botón de WhatsApp predeterminado" },
      ctaSection: { label: "Botón de la sección CTA" },
      homePage: { label: "CTA de canales en el inicio" },
      pricingPlan: {
        label: "Botón «Comprar ahora» de la tarjeta de precios",
        hint: "Usa {planName} donde deba aparecer el nombre del plan.",
      },
      contactQuestion: { label: "Pregunta del pie de página / contacto" },
      installationHelp: { label: "Ayuda de páginas de instalación" },
      resellerInterest: { label: "Programa de revendedores" },
      notFoundHelp: { label: "Página 404" },
      tooltip: { label: "Texto emergente del botón flotante" },
      contactButton: { label: "Texto del enlace «Contacto» (instalación)" },
      ariaFloating: { label: "Etiqueta de accesibilidad (botón flotante)" },
      ariaFreeTest: { label: "Etiqueta de accesibilidad (botón info WhatsApp)" },
    },
  },
  metadata: {
    title: "Metadatos de páginas",
    subtitle: "Edita los títulos y descripciones SEO de todas las páginas",
    pageTitle: "Título de página",
    metaDescription: "Meta descripción",
    pageTitlePlaceholder: "Introduce el título de página para SEO...",
    metaDescriptionPlaceholder: "Introduce la meta descripción para SEO...",
    pages: {
      homepage: "Inicio",
      homepageBadge: "Página principal",
      blogListing: "Página de listado del blog",
      blogListingBadge: "Contenido",
      blog: "Página de artículo",
      blogBadge: "SEO",
      reseller: "Página de programa de revendedores",
      resellerBadge: "Negocio",
    },
    installationTitle: "Páginas de instalación",
    installationPagesSuffix: "páginas",
    installationItems: {
      windows: "Instalación en Windows",
      ios: "Instalación en iOS",
      firestick: "Instalación en Firestick",
      smartTv: "Instalación en Smart TV",
      guide: "Guía de instalación",
    },
    legalTitle: "Páginas legales",
    legalItems: {
      refundPolicy: "Política de reembolsos",
      privacyPolicy: "Política de privacidad",
      termsOfService: "Términos de servicio",
    },
  },
  settings: {
    title: "Ajustes",
    subtitle: "Edita los elementos del menú de navegación",
    navMenuTitle: "Menú de navegación",
    navMenuSubtitle: "Etiquetas mostradas en el encabezado del sitio",
    items: {
      home: "Inicio",
      pricing: "Precios",
      features: "Características",
      faq: "Preguntas frecuentes",
      contact: "Contacto",
      blog: "Blog",
      iptvReseller: "Revendedor (antiguo)",
    },
  },
  blogs: {
    title: "Gestión del blog",
    subtitle: "Crea y gestiona las entradas del blog",
    createNew: "Crear nueva entrada",
    loading: "Cargando entradas...",
    empty: "Todavía no hay entradas de blog.",
    createFirst: "Crea tu primera entrada",
    deleteTitle: "¿Eliminar entrada?",
    deleteConfirmPrefix: "¿Seguro que quieres eliminar",
    deleteWarning: "Esta acción no se puede deshacer.",
  },
  products: {
    title: "Gestión de productos",
    subtitle: "Crea y gestiona los productos de la tienda",
    createNew: "Nuevo producto",
    loading: "Cargando productos...",
    empty: "Todavía no hay productos.",
    createFirst: "Crea tu primer producto",
    deleteTitle: "¿Eliminar producto?",
    deleteConfirmPrefix: "¿Seguro que quieres eliminar",
    deleteWarning: "Esta acción no se puede deshacer.",
    variant: "variante",
    variants: "variantes",
  },
  localeToolbar: {
    title: "Idiomas",
    subtitle:
      "Escribe primero en un idioma y luego copia o activa la edición espejo. Publica solo los idiomas seleccionados.",
    publish: "Publicar:",
    primary: "Principal:",
    editing: "Editando:",
    ready: "listo",
    draft: "borrador",
    mirrorEditing: "Edición espejo — los cambios se aplican a todos los idiomas publicados a la vez",
    copyToOthers: "Copiar {locale} → otros",
    copyWithSlugs: "Copiar con slugs",
  },
  editorChrome: {
    createBlogTitle: "Crear nueva entrada",
    editBlogTitle: "Editar entrada",
    createBlogSubtitle: "Diseña tu entrada con total libertad",
    createProductTitle: "Nuevo producto",
    editProductTitle: "Editar producto",
    backToBlogs: "Volver a la lista de entradas",
    backToProducts: "Volver a la lista de productos",
    saveBlog: "Guardar entrada",
    saveProduct: "Guardar producto",
    contentBlocksTitle: "Bloques de contenido",
    contentBlocksSubtitle:
      "Usa las pestañas de idioma de cada bloque para el texto por idioma, o activa la edición espejo arriba. Las imágenes se comparten entre idiomas.",
    noBlocks: "Todavía no hay bloques de contenido. Haz clic en los botones de arriba para añadir contenido.",
    addHeading: "Encabezado",
    addText: "Texto",
    addImage: "Imagen",
    addQuote: "Cita",
    addList: "Lista",
    rememberSave: "Recuerda guardar los cambios antes de salir",
  },
  toast: {
    savedTitle: "Cambios guardados",
    errorTitle: "Algo salió mal",
    processingTitle: "Procesando...",
    savedMessage:
      "Tus cambios se han guardado. Este panel ya muestra lo que acabas de guardar. El sitio público se actualiza tras el redespliegue de Vercel desde GitHub (normalmente 1–3 minutos).",
    errorMessage: "Se produjo un error al guardar. Inténtalo de nuevo.",
    processingMessage: "Los cambios se están procesando...",
    liveSiteNote:
      "Sitio en vivo: redespliegue GitHub → Vercel (1–3 min). El panel ya muestra tus cambios guardados.",
  },
};

const de: AdminDictionary = {
  common: {
    save: "Speichern",
    saving: "Speichern...",
    saved: "Gespeichert",
    error: "Fehler",
    logout: "Abmelden",
    cancel: "Abbrechen",
    delete: "Löschen",
    deleting: "Wird gelöscht...",
    edit: "Bearbeiten",
    view: "Ansehen",
    loading: "Wird geladen...",
    uploadImage: "Bild hochladen",
    changeImage: "Bild ändern",
    uploading: "Wird hochgeladen...",
    addItem: "+ Element hinzufügen",
  },
  login: {
    title: "Admin-Zugang",
    subtitle: "Gib deine Zugangsdaten ein, um fortzufahren",
    passwordLabel: "Passwort",
    passwordPlaceholder: "Passwort eingeben",
    signIn: "Anmelden",
    signingIn: "Anmeldung läuft...",
    backToWebsite: "← Zurück zur Website",
  },
  header: {
    title: "Website-Editor",
    subtitle: "Inhalte, Bilder und Einstellungen bearbeiten",
  },
  nav: {
    homepage: "Startseite",
    whatsapp: "WhatsApp & CTA",
    blogs: "Blog",
    products: "Produkte",
    metadata: "Seiten-Metadaten",
    settings: "Einstellungen",
  },
  preview: {
    title: "Live-Vorschau",
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobil",
    openInNewTab: "In neuem Tab öffnen",
    refresh: "Aktualisieren",
    close: "Schließen",
  },
  hero: {
    title: "Startseiten-Hero",
    subtitle: "Bearbeite den Hero-Bereich deiner Startseite",
    mainHeading: "Hauptüberschrift",
    subtitlePart1: "Untertitel — Teil 1",
    subtitlePart2: "Untertitel — Teil 2",
    highlighted: "(Hervorgehoben)",
    infoBoxPrefix: "Der Hero-Absatz ist auf der Website ein zusammenhängender Block (mit ",
    infoBoxLinks: "Links",
    infoBoxSuffix:
      " in der Mitte). Bearbeite jeden Teil unten — Zeilenumbrüche werden automatisch entfernt, damit der Text nicht umbricht.",
    openingSentence: "Einleitungssatz",
    fieldLabels: {
      channelsLink: "Link-Text zu den Kanälen (blau, verlinkt zu Preisen)",
      description2: "Nach dem Kanäle-Link",
      officialSmartersLinkText: "Bezeichnung des klassischen Players",
      officialIboLinkText: "Bezeichnung des IBO-Players",
      description3: "Nach den Player-Links (z. B. „, usw. (Smart TV…)“)",
      m3uLink: "Text des M3U-/Xtream-Links",
      description4: "Nach dem M3U-Link",
      freeTest: "Hervorgehobener Text für den kostenlosen Test",
      description5: "Schlusssatz",
    },
    announcementTitle: "Ankündigungsleiste",
    announcementSubtitle:
      "Der schmale Streifen, der auf jeder Seite über dem Header angezeigt wird, nicht nur auf der Startseite. Jede Nachricht ist optional — lasse ein Feld leer, um diese Nachricht vollständig auszublenden (kein verwaister Trennpunkt wird angezeigt). Sind alle drei leer, wird die ganze Leiste ausgeblendet.",
    shipping: "Versandhinweis",
    guarantee: "Garantiehinweis",
    whatsappMessage: "WhatsApp-/Bestellhinweis",
    placeholderEmpty: "Leer lassen, um diese Nachricht auszublenden",
  },
  whatsapp: {
    title: "WhatsApp & CTA",
    subtitle: "Vorausgefüllte Nachrichten, Start-CTA und Text des Kontaktbereichs",
    messagesTitle: "Vorausgefüllte WhatsApp-Nachrichten",
    messagesSubtitle:
      "Jedes Feld wird als Eröffnungsnachricht in WhatsApp gesendet, wenn dieser Button auf der {locale}-Website angeklickt wird.",
    ctaSectionTitle: "CTA-Bereich (Startseite)",
    titleLinePrefix: "Titelzeile — ",
    description: "Beschreibung",
    whatsappButtonLabel: "Beschriftung des WhatsApp-Buttons",
    emailButtonLabel: "Beschriftung des E-Mail-Buttons",
    contactStripTitle: "Kontaktbereich",
    heading: "Überschrift",
    fields: {
      floatingButton: {
        label: "Schwebender Button (Ecken-Chat)",
        hint: "Wird vorausgefüllt, wenn Besucher auf das schwebende WhatsApp-Symbol tippen.",
      },
      defaultButton: { label: "Standard-WhatsApp-Button" },
      ctaSection: { label: "Button im CTA-Bereich" },
      homePage: { label: "Kanäle-CTA der Startseite" },
      pricingPlan: {
        label: "„Jetzt kaufen“-Button der Preiskarte",
        hint: "Verwende {planName} an der Stelle, an der der Tarifname erscheinen soll.",
      },
      contactQuestion: { label: "Frage in Footer / Kontakt" },
      installationHelp: { label: "Hilfe auf Installationsseiten" },
      resellerInterest: { label: "Reseller-Programm" },
      notFoundHelp: { label: "404-Seite" },
      tooltip: { label: "Tooltip des schwebenden Buttons" },
      contactButton: { label: "Text des „Kontakt“-Links (Installation)" },
      ariaFloating: { label: "Barrierefreiheits-Label (schwebender Button)" },
      ariaFreeTest: { label: "Barrierefreiheits-Label (WhatsApp-Info-Button)" },
    },
  },
  metadata: {
    title: "Seiten-Metadaten",
    subtitle: "Bearbeite SEO-Titel und -Beschreibungen für alle Seiten",
    pageTitle: "Seitentitel",
    metaDescription: "Meta-Beschreibung",
    pageTitlePlaceholder: "Seitentitel für SEO eingeben...",
    metaDescriptionPlaceholder: "Meta-Beschreibung für SEO eingeben...",
    pages: {
      homepage: "Startseite",
      homepageBadge: "Hauptseite",
      blogListing: "Blog-Übersichtsseite",
      blogListingBadge: "Inhalt",
      blog: "Blog-Beitragsseite",
      blogBadge: "SEO",
      reseller: "Reseller-Programmseite",
      resellerBadge: "Business",
    },
    installationTitle: "Installationsseiten",
    installationPagesSuffix: "Seiten",
    installationItems: {
      windows: "Windows-Installation",
      ios: "iOS-Installation",
      firestick: "Firestick-Installation",
      smartTv: "Smart-TV-Installation",
      guide: "Installationsanleitung",
    },
    legalTitle: "Rechtliche Seiten",
    legalItems: {
      refundPolicy: "Rückerstattungsrichtlinie",
      privacyPolicy: "Datenschutzrichtlinie",
      termsOfService: "Nutzungsbedingungen",
    },
  },
  settings: {
    title: "Einstellungen",
    subtitle: "Bearbeite die Einträge des Navigationsmenüs",
    navMenuTitle: "Navigationsmenü",
    navMenuSubtitle: "Beschriftungen im Website-Header",
    items: {
      home: "Startseite",
      pricing: "Preise",
      features: "Funktionen",
      faq: "FAQ",
      contact: "Kontakt",
      blog: "Blog",
      iptvReseller: "Reseller (veraltet)",
    },
  },
  blogs: {
    title: "Blogverwaltung",
    subtitle: "Blogbeiträge erstellen und verwalten",
    createNew: "Neuen Beitrag erstellen",
    loading: "Beiträge werden geladen...",
    empty: "Noch keine Blogbeiträge.",
    createFirst: "Erstelle deinen ersten Blogbeitrag",
    deleteTitle: "Blogbeitrag löschen?",
    deleteConfirmPrefix: "Möchtest du wirklich löschen:",
    deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden.",
  },
  products: {
    title: "Produktverwaltung",
    subtitle: "Shop-Produkte erstellen und verwalten",
    createNew: "Neues Produkt",
    loading: "Produkte werden geladen...",
    empty: "Noch keine Produkte.",
    createFirst: "Erstelle dein erstes Produkt",
    deleteTitle: "Produkt löschen?",
    deleteConfirmPrefix: "Möchtest du wirklich löschen:",
    deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden.",
    variant: "Variante",
    variants: "Varianten",
  },
  localeToolbar: {
    title: "Sprachen",
    subtitle:
      "Schreibe zuerst in einer Sprache und kopiere dann oder nutze den Spiegel-Modus. Veröffentliche nur die ausgewählten Sprachen.",
    publish: "Veröffentlichen:",
    primary: "Hauptsprache:",
    editing: "Bearbeitung:",
    ready: "fertig",
    draft: "Entwurf",
    mirrorEditing: "Spiegel-Bearbeitung — Änderungen gelten für alle veröffentlichten Sprachen gleichzeitig",
    copyToOthers: "{locale} → andere kopieren",
    copyWithSlugs: "Mit Slugs kopieren",
  },
  editorChrome: {
    createBlogTitle: "Neuen Blogbeitrag erstellen",
    editBlogTitle: "Blogbeitrag bearbeiten",
    createBlogSubtitle: "Gestalte deinen Blogbeitrag mit völliger Freiheit",
    createProductTitle: "Neues Produkt",
    editProductTitle: "Produkt bearbeiten",
    backToBlogs: "Zurück zur Beitragsliste",
    backToProducts: "Zurück zur Produktliste",
    saveBlog: "Beitrag speichern",
    saveProduct: "Produkt speichern",
    contentBlocksTitle: "Inhaltsblöcke",
    contentBlocksSubtitle:
      "Nutze die Sprach-Tabs der Blöcke für sprachspezifischen Text oder aktiviere oben die Spiegel-Bearbeitung. Bilder werden über alle Sprachen hinweg geteilt.",
    noBlocks: "Noch keine Inhaltsblöcke. Klicke oben auf die Buttons, um Inhalte hinzuzufügen.",
    addHeading: "Überschrift",
    addText: "Text",
    addImage: "Bild",
    addQuote: "Zitat",
    addList: "Liste",
    rememberSave: "Denk daran, deine Änderungen vor dem Verlassen zu speichern",
  },
  toast: {
    savedTitle: "Änderungen gespeichert",
    errorTitle: "Etwas ist schiefgelaufen",
    processingTitle: "Wird verarbeitet...",
    savedMessage:
      "Deine Änderungen wurden gespeichert. Dieses Dashboard zeigt bereits, was du gerade gespeichert hast. Die öffentliche Website aktualisiert sich, nachdem Vercel von GitHub aus neu deployt (meist 1–3 Minuten).",
    errorMessage: "Beim Speichern ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    processingMessage: "Änderungen werden verarbeitet...",
    liveSiteNote:
      "Live-Website: GitHub → Vercel Redeploy (1–3 Min.). Das Dashboard zeigt deine gespeicherten Änderungen bereits an.",
  },
};

const dictionaries: Record<AdminLocale, AdminDictionary> = { en, fr, es, de };

export function getAdminDict(locale: string): AdminDictionary {
  return dictionaries[locale as AdminLocale] ?? dictionaries.en;
}

export type { AdminDictionary };
