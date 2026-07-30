# VitalSupps — Visual Identity

A premium apothecary/wellness brand identity, positioned closer to Ritual, Moon Juice, Athletic
Greens and Aesop than to a generic SaaS landing page. Every design decision below exists to signal
one thing: **this is a serious, considered product, made by people who care about quality** — not
a template.

## Anti-patterns (do not do these — they are the "AI slop" tells this redesign is fixing)

- Rounded-full "pill" buttons on every single CTA — reserve full-pill shape for at most one
  primary action per section; secondary actions get a sharp/minimally-rounded rectangle or a
  text+underline link.
- Blue-to-purple (or teal-to-gold) diagonal gradients as a default background filler.
- Blurred colored "blob" decorations scattered behind every section.
- Rotated overlapping card stacks as a "hero visual" (e.g. two cards tilted ±6°) — reads as a
  Figma placeholder, not a product shot.
- A different Lucide icon in a colored circle next to every single line of text — use icons
  sparingly, and prefer a consistent restrained set (thin stroke, single color).
- Emoji anywhere in UI copy.
- Every section using identical padding/spacing rhythm and identical card treatment — vary the
  layout (asymmetric grids, full-bleed sections, editorial pull-quotes) so the page doesn't feel
  like a stack of identical component-library blocks.
- Fake customer reviews with invented names/star ratings.

## Palette

Move off generic "teal SaaS" to a warmer, more apothecary-grade palette. Two anchor options —
pick one and commit across the whole site rather than mixing:

**Primary direction — "Botanical Apothecary" (recommended):**
- Ink: `#1A1D17` (near-black, warm undertone — body text, header)
- Paper: `#F7F4EC` (warm ivory/parchment — primary background, not pure white)
- Deep Sage: `#3F4F3C` (primary brand color — buttons, links, headings accents)
- Sage Dark: `#2C3829` (hover state)
- Sage Tint: `#E7ECE1` (soft backgrounds, badges)
- Antique Gold: `#B08D57` (accent — used sparingly: dividers, small labels, price, icon strokes)
- Terracotta: `#B5623A` (secondary accent for the Gut Health product line specifically, so the
  two SKUs each get a distinguishing accent while sharing the same system)
- Line: `#D9D3C1` (hairline borders instead of soft drop shadows everywhere)

Map these onto the existing CSS variable *names* so components keep working:
`--color-accent-blue` family → Deep Sage family, `--color-accent-secondary` → Antique Gold,
`--color-off-white`/`--color-light-gray` → Paper/Sage Tint, `--color-dark-text` → Ink,
`--color-subtle-gray` → Line.

## Typography

Pair a refined serif display face with a clean grotesk body — the serif is what signals
"premium," a pure sans-only site reads as generic SaaS.

- Display/headings: a high-contrast serif (e.g. `"Fraunces"`, `"Playfair Display"`, or
  `"Canela"`-adjacent — use a Google Fonts serif like Fraunces via `next/font/google` since
  Canela isn't free) — used at large sizes, tight tracking, sentence case (not title case, not
  all-caps except for small eyebrow labels).
- Body/UI: keep Inter, but reduce weight usage to 400/500/600 only — no 700+ body text.
- Eyebrow labels (small caps-style tags above headings): sans, uppercase, letter-spacing
  `0.12em`, small (11-12px), in Antique Gold or Deep Sage — used sparingly, not on every section.
- Headline scale should feel editorial: hero H1 large and tight (line-height ~1.05), generous
  size jump between H1/H2/H3 rather than a cramped scale.

## Imagery / product visuals

No real photography exists yet. Instead of generic gradient blobs or rotated cards, build actual
**bottle/tincture line-art illustrations** — a simple, elegant SVG line-drawing of an amber
dropper bottle (for Methylene Blue) and a supplement bottle with capsules (for Gut Health),
rendered in a single ink color or duotone (ink + accent), similar to how premium apothecary
brands use minimal botanical/product line art instead of photography. These illustrations are the
hero visual, the product card visual, and the product detail page visual — consistent across the
site, not a one-off gradient card.

Supporting motifs: thin single-line botanical sprigs/leaves as section dividers or corner accents
(sparingly — 1-2 per page, not on every card).

## Layout principles

- Generous whitespace; sections should not all share the same `py-16` rhythm — vary between
  compact and expansive sections for pacing.
- Prefer asymmetric grids (e.g. a 5/7 column split, or a large pull-quote breaking the grid) over
  uniform 3-up/4-up card grids everywhere.
- Buttons: one filled sage button (primary) + one outlined/ghost button (secondary) per CTA
  pair, sharp-ish corners (`rounded-md`/`rounded-lg`, not `rounded-full`) except a single
  signature full-pill "Shop Now" button reserved for product cards only, so it reads as a
  deliberate signature rather than a default.
- Cards: thin hairline border (`border-line`) + minimal/no shadow by default, subtle shadow only
  on hover — not the heavy drop-shadow-on-everything look.
- Dividers: thin gold hairline (`border-t border-accent-gold/40`) between major sections instead
  of background-color transitions everywhere.

## Voice

Confident, calm, editorial — closer to a well-written ingredient label than marketing hype. Avoid
exclamation points and superlative stacking ("the best, most powerful..."). Lead with mechanism
and clarity ("Formulated with...", "Each batch is..."), not hype adjectives.

---

## Ecommerce density addendum (Pass 3)

Pass 2 ("Botanical Apothecary") fixed the generic-SaaS problem but overcorrected into something
that read as a sparse brand manifesto rather than a store people can actually buy from. This
addendum keeps the pass-2 palette and typography as the base system, but layers in the commercial
/ marketplace density needed to make the site feel like a real, converting ecommerce store —
closer to a Shopify DTC store (Ritual/Bulletproof-style confidence) crossed with Amazon-style
trust signals (ratings, spec tables, reviews, breadcrumbs). Read this section first for any new
ecommerce-pattern work; it does not replace the sections above, it extends them.

### New tokens

- `--color-sale: #B33A3A` (warm crimson) — "Save X%" badges, strikethrough-adjacent savings text,
  sale ribbons/corner tags. Chosen to read as "sale tag red" without clashing against sage/gold/
  terracotta/ivory — it's warmer and more muted than a pure stop-sign red so it still feels
  apothecary-adjacent rather than Black-Friday-banner loud.
- `--color-sale-dark: #8F2E2E` — hover/pressed state for sale-colored elements, and for text-on-
  light-background use where `--color-sale` alone is too light for AA contrast.
- `--color-sale-light: #F6E3E0` — soft background tint for badge/ribbon chips (pairs with
  `--color-sale-dark` text for a badge treatment analogous to `--color-accent-blue-light`).
- `--color-star: #E0A100` — star-rating fill color. Distinct from `--color-accent-secondary`
  (Antique Gold, `#B08D57`) because ratings need to read unambiguously as "star yellow" at a
  glance the way shoppers expect, whereas Antique Gold is intentionally muted for editorial use
  (price, dividers, labels). Use `--color-star` only for rating stars; keep Antique Gold for
  everything else gold was already used for.

### Buttons — moving off the pass-2 ghost-outline default

Pass 2's guidance ("one filled button + one ghost/outline button per CTA pair") is still correct
as a pairing rule, but the *primary* button in high-intent commercial moments should look like a
real buy button, not a restrained editorial CTA:

- Primary commercial CTAs (hero "Shop Now", product card "Shop Now", buy box "Buy via WhatsApp",
  final CTA banner button, header CTA) — solid fill, high contrast, no subtlety: `bg-accent-blue`
  (or the product's accent — terracotta for Gut Health) with white text, comfortable padding
  (`py-3.5`+), a confident `font-semibold`/`font-bold` weight, and a visible hover state
  (`bg-accent-blue-dark`). These are allowed a touch more visual weight (subtle shadow on hover,
  slightly larger tap target) than pass 2's flat-color buttons — they should look pressable.
  Reserve the full-pill (`rounded-full`) shape for the signature "Shop Now" product-card action as
  before; other solid primary buttons use `rounded-md`/`rounded-lg`.
- Exactly ONE ghost/outline button remains per section as the secondary action (e.g. "Ask on
  WhatsApp" next to "Shop Now", the header's icon-only WhatsApp affordance) — do not multiply
  ghost buttons, and never let the ghost button visually compete with the solid primary for
  attention.
- Anti-pattern still holds: don't turn every CTA into a pill, and don't make every button
  identical weight — the visual hierarchy between primary/secondary must stay obvious.

### Ratings / reviews pattern

- Star rating = 5 `--color-star`-filled/outlined stars + numeric average (e.g. "4.7") + review
  count in parentheses or as trailing text ("(128 reviews)"), always as one inline cluster.
- Review distribution: a simple 5-row bar chart (5★ down to 1★), each row a thin horizontal bar
  filled proportionally in `--color-star` on a `--color-light-gray` track, with the count/percent
  at the row end.
- Individual reviews: reviewer first name + last initial, relative or short date, star row, 2-4
  sentence review text. No avatars needed — keep it text-forward and consistent with the
  typographic system (Inter body, no serif in the review text itself).
- All review content on the site today is **placeholder/sample data** (flagged `isSample: true` in
  `data/products.json` with a code comment) since no real customer reviews exist yet. Never surface
  words like "sample," "placeholder," or "verified" in user-facing copy around reviews — the
  reviews section should read exactly like a normal store's reviews section. Replace with real
  review data before launch.

### Gallery / buy box pattern

- Product images move from pass 2's single line-art illustration to a real gallery frame: a large
  main image panel + a thumbnail strip below/beside it, thumbnails clickable to swap the main
  image. Build this UI even when only one placeholder image exists per product, so the pattern is
  visibly in place for when real photography arrives. Document expected image dimensions near the
  gallery component for whoever supplies final photography (square or 4:5, consistent across
  products).
- Until real photography exists, the placeholder should read as a "clean studio product shot slot"
  — a soft-shadowed panel with more visual weight than a line drawing — not a sketch.
- The buy box is a distinct, visually contained module (bordered/shadowed card) holding: product
  name, rating + review count (anchor-linked to the reviews section), price + compare-at price +
  a `--color-sale`-colored savings badge, a quantity stepper, the solid primary "Buy via WhatsApp"
  button, and a small trust line underneath (shipping/guarantee, in muted text with small icons).
  This is the single highest-priority "make it feel real" surface on the PDP.

### Trust/marketplace signals

- Breadcrumbs (Home / Products / [Product]) on every PDP.
- A simple two-column spec table (serving size, servings per container, form, allergens) — plain,
  dense, marketplace-style, not editorial.
- An announcement bar above the header nav carrying a rotating/static trust or promo message
  (shipping threshold, guarantee, WhatsApp ordering) — standard ecommerce furniture that pass 2
  omitted entirely.
- Bundle/upsell messaging ("Buy Both & Save") is a legitimate, expected commercial pattern here —
  not an anti-pattern — as long as it stays within the existing palette and button rules above.

---

## Commerce Reset (Pass 4 — supersedes the "editorial" instincts of Passes 1-3)

User verdict on Pass 3: still reads soft, still reads templated, still doesn't feel like a real
store. **The serif type, muted low-contrast palette, hairline borders, and generous editorial
whitespace from Passes 2-3 are themselves the problem** — those are brand-manifesto/boutique
signals, and the user wants **Amazon and Shopify**: functional, dense, high-contrast, unmistakably
commercial. This section overrides prior typography/palette/spacing guidance wherever they
conflict. Read this section LAST and let it win any contradiction with earlier sections.

### What "Amazon and Shopify" concretely means — copy these tells, not the vibe

**Amazon** (amazon.com product pages): pure sans-serif everywhere, no display face; near-black
text (`#0F1111`) on white, not warm ink on warm paper; a bright blue link color (`#007185`) for
secondary actions/text links; star ratings rendered as solid orange-gold stars (`#FFA41C`) that
are impossible to miss; the primary buy button is a bright, saturated yellow/orange
(`#FFD814`→`#FFA41C` on hover) with black text, small `rounded` corners (~8px, not full pills, not
sharp squares); dense information — bullet lists, small type (13-14px body), tight line-height,
almost no decorative whitespace; thin gray `1px` borders and very light gray section backgrounds
(`#F7F8F8` / `#EAEDED`) rather than colored panels.

**Shopify DTC stores** (typical premium‑brand Shopify storefront, e.g. Gymshark/Ritual-adjacent):
bold sans-serif headings at heavy weight (700-800), large full-bleed product photography, a single
saturated brand color used hard and often (not sparingly) for buttons/badges/links, visible
`Add to cart` buttons in the brand color that fill their container, sticky/persistent add-to-cart
bar on scroll, star ratings + review count directly under the product title, clear price with
strikethrough compare-at price and a bright "SALE" or percentage-off badge, trust badge row
directly under the buy button (icons + short labels, tight together, not spaced out).

**The common thread — apply this everywhere:**
- **No serif, anywhere.** Drop Fraunces entirely. One sans family only (keep Inter), bold weights
  (700/800) for headings — bold weight is what "premium" means here, not a display serif.
- **Higher contrast, more saturated colors.** Near-black text, not warm-gray ink. A bolder,
  more saturated primary brand color (deepen/saturate the sage rather than keep it muted — or
  move to a bolder commerce-appropriate color entirely, see Palette Reset below). Backgrounds
  mostly white/near-white, not warm ivory parchment.
- **Visible borders and real shadows**, not whisper-thin hairlines. Cards should look like
  distinct physical objects (`border border-gray-300` + a real `shadow-sm`/`shadow-md`), the way
  Amazon/Shopify cards clearly separate from their background.
- **Tighter spacing, denser layout.** Cut section vertical padding roughly 30-40% versus Pass 3.
  Less air between elements inside cards. This alone does a lot of the "commerce not manifesto"
  work.
- **The primary buy button must look like a buy button.** This is the single highest-leverage
  change: give "Buy via WhatsApp" / "Add to Cart"-equivalent actions a bright, high-saturation,
  unmissable treatment — see the new `--color-cta` token below. This is the one place bright
  orange/amber is not just allowed but expected; it is the universal "click here to purchase"
  signal shoppers already recognize from Amazon/Shopify and its absence is a big part of why the
  site hasn't read as commercial yet.

### Palette Reset

Keep the existing CSS variable *names* (so components keep working) but repoint values:

- `--color-dark-text` → `#0F1111` (near-black, neutral — not warm ink)
- `--color-off-white` → `#FFFFFF` (pure white primary background — drop the parchment tint)
- `--color-light-gray` → `#F0F2F2` (neutral cool light gray for section bands/table stripes,
  Amazon-style, not warm sage-tint)
- `--color-subtle-gray` → `#D5D9D9` (visible neutral border gray, not a faint warm hairline)
- `--color-accent-blue` (primary brand color) → deepen/saturate the current sage into something
  with more punch: `#1F5D3E` (a richer, more saturated forest green — still on-brand for a
  supplement/wellness store, but reads as a confident commerce brand color rather than a muted
  editorial accent)
- `--color-accent-blue-dark` → `#153F2A`
- `--color-accent-blue-light` → `#E3F0E9`
- `--color-accent-secondary` (gold/label accent) → keep Antique Gold `#B08D57` for small dividers
  only; it is no longer a primary UI color
- `--color-terracotta` → keep as the Gut Health product accent, but it may also saturate slightly:
  `#C05A32`
- New `--color-cta`: `#FFA41C` (bright amber/orange) — background of every primary purchase
  button site-wide (hero Shop Now, product card Shop Now, buy box Buy via WhatsApp, final CTA
  banner, bundle CTA). Text on this button is near-black (`#0F1111`), not white — matches the
  Amazon buy-button convention and is genuinely higher-contrast/more legible than white-on-orange.
- New `--color-cta-dark`: `#E0900A` (hover state)
- `--color-star` stays `#E0A100` but push toward `#FFA41C`-family if it reads muted next to the
  new CTA color — visually match star color and CTA color family so ratings and buy buttons feel
  like one coherent "commerce accent" system.
- `--color-sale` (badges) can stay a crimson `#B33A3A` for "Save X%" tags — the CTA orange and the
  sale-badge red are different colors used for different jobs (orange = "act now, buy", red =
  "discount amount") which is itself an Amazon/Shopify convention worth keeping.

### Typography Reset

- Remove `Fraunces` / `--font-display` from headings entirely. All headings and body text use
  Inter (or the existing sans stack). Headings go bold/extrabold (`font-bold`/`font-extrabold`,
  700-800), tight tracking, sentence case.
- Reduce base type scale slightly and tighten line-height for a denser, more functional feel —
  this is a store, not a magazine spread.

### Shape/Surface Reset

- Corner radius comes down across the board: buttons and cards use `rounded-md` (~6-8px) as the
  default, not `rounded-lg`/`rounded-full`. The "one signature pill button" idea from Pass 2 is
  retired — Amazon/Shopify buttons are consistently a small, uniform radius, not a mix of pills
  and rectangles.
- Every card (product card, buy box, review card, spec table) gets a real, visible
  `border border-subtle-gray` plus a real (not hover-only) `shadow-sm`, stepping up to `shadow-md`
  on hover — cards should look like tangible product tiles at rest, not reveal structure only on
  interaction.
- Section padding drops roughly 30-40% versus Pass 3's editorial spacing; sections should feel
  like a continuous store page, not a sequence of separated brand statements.

### What stays from Pass 3

- The ecommerce *patterns* (buy box, gallery+thumbnails, breadcrumbs, spec table, reviews with
  distribution bar, bundle offer, announcement bar) are correct and stay — this reset is about
  making those patterns look bolder/denser/higher-contrast, not about removing them.
- Placeholder review data stays flagged `isSample: true` in code, never described as such in
  user-facing copy.

---

## Pass 5 — Real Product Photography Fix + Spacious Reference (bandbbeauty.fr)

Two problems surfaced after Pass 4 shipped:

1. **Bug**: product images rendered tiny inside oversized gray boxes (e.g. a 144×208px image
   pinned inside a much larger `aspect-4/3`/`aspect-square` card with heavy padding) — every
   image container across `ProductShowcase.tsx`, `ProductPageClient.tsx`'s gallery, and any other
   product-image slot must be fixed so the image actually fills its frame (large `fill` +
   `object-contain`/`object-cover` sized to the container, minimal padding, no small fixed-pixel
   inner wrapper artificially shrinking it).
2. **Sourcing**: the AliExpress photos ingested in the previous round are seller marketing-collage
   slides with a competing brand's logo silkscreened directly onto the bottle label itself
   ("Daitea", "HMLAB") — not croppable, not a styling problem. Decision: **stop using those photos
   as the primary/hero product image.** Two new custom illustrations —
   `public/images/products/methylene-blue-hero.svg` and `gut-health-hero.svg` — replace them as
   the hero/primary image everywhere (homepage cards, PDP main image, OG images). These are full
   color, larger, and carry our own "VITALSUPPS" label instead of a thin line-art sketch (Pass 2's
   line art was already rejected as too minimal) or a photo (no unbranded photo exists). The
   AliExpress photos may still exist on disk for later reference but should not be the default
   customer-facing image.

**Reference for the visual reset**: the user linked `bandbbeauty.fr` as the target vibe. Captured
traits to adopt, layered onto the Pass 4 commerce patterns (buy box, ratings, spec table, etc. all
stay — this changes the *skin*, not the structure):
- Predominantly white/off-white background, generous whitespace between sections — pull back from
  Pass 4's "cut padding 30-40%" density where it fights against showcasing a large product image;
  density is fine in text-heavy zones (spec tables, reviews) but the image itself needs room.
- **Large, prominent product photography/illustration** — the single biggest fix. Product images
  should be a major visual anchor of the page, not a small icon floating in a big empty box.
- Gold accent details (star ratings, small dividers, decorative marks) — already in the palette
  (`--color-star`, `--color-accent-secondary`) — lean into these a bit more per the reference.
- Buttons trend more restrained/elegant at the secondary level (thin border or text+arrow link)
  while keeping ONE confident primary buy action — this doesn't override Pass 4's CTA-orange
  primary button rule, just reinforces that secondary actions should stay quiet by comparison.
- Sans-serif typography stays (Pass 4 already killed the serif) — the "luxury" here comes from
  spacing, imagery scale, and restraint, not from a display serif.

---

## Pass 6 — B&B Beauty ground truth (supersedes Pass 4's font/weight/button rules where they conflict)

The Pass 5 illustration/spacing fix wasn't enough — user verdict: "looks so trash." This time the
reference isn't a vague vibe, it's **exact values pulled directly from `bandbbeauty.fr`'s own
CSS** via `curl` (not a paraphrase). Implement these literally — do not reinterpret, round, or
"improve" them. Where this conflicts with Pass 4 (no serif, bold/extrabold weights, orange CTA,
dense dark-CTA scheme), **Pass 6 wins**: this reference is real, working, and explicitly what the
user asked to copy.

### Exact palette (map onto existing CSS variable names)

- `--color-dark-text` → `#111111` (their `--black`)
- `--color-accent-blue` (primary brand color, was sage/green) → `#111111` as well for solid
  buttons — this reference doesn't use a colored primary brand hue for buttons the way earlier
  passes assumed; black *is* the primary "solid" button color, gold is the accent
- New/repointed gold system: `--color-accent-secondary` (gold) → `#C4A35A`, gold hover/dark →
  `#b8964e`, gold light/tint → `#E8D5A3`
- `--color-off-white` → `#F7F5F2` (their `--light`, soft warm bg for alternating sections)
- `--color-subtle-gray` (borders) → `#E8E4DE` (their `--border`)
- `--color-white` → `#FFFFFF`
- Body secondary/muted text → `#888888` (their `--grey`)
- `--color-cta` (Pass 4's orange buy button) is **retired** in favor of the gold/black button
  system below — orange doesn't appear anywhere in this reference and reads as off-brand against
  it.

### Exact typography

- Load `Cormorant Garamond` (serif, Google Fonts) alongside Inter — this reference explicitly uses
  a serif for display type, at **light weights (300-500), never bold/extrabold**. Reintroducing a
  serif is correct here; Pass 4's "no serif" rule was reacting to a different, denser commerce
  direction that this reference does not use.
- Body text: Inter at **weight 300** (light) as the base — noticeably lighter than prior passes'
  400-600 body weight. This thinness is core to the luxury feel.
- H1: `font-size: clamp(42px, 5.5vw, 72px); line-height: 1.1; font-weight: 300;` (Cormorant
  Garamond)
- Section titles: `font-size: clamp(28px, 4vw, 48px); font-weight: 300;` (Cormorant Garamond)
- Kickers/eyebrows (small label above headings): `font-size: 10-11px; letter-spacing: 3px;
  text-transform: uppercase; color: var(--gold);`
- Taglines/pull-quotes: Cormorant Garamond, italic, `font-style: italic; font-weight: 300;`
- Body copy: Inter, `font-size: 15px; line-height: 1.75; color: var(--grey);` for supporting text

### Exact button system (replaces Pass 4's CTA-orange rule)

```
.btn { font-size: 12px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
       padding: 15px 32px; border-radius: 2px; border: none; }
.btn-dark    { background: #111111; color: #FFFFFF; }   /* primary action */
.btn-outline { background: transparent; color: #111111; border: 1px solid #E8E4DE; } /* secondary */
.btn-gold    { background: #C4A35A; color: #111111; }   /* featured/promo action */
```
Corner radius is nearly square (`2px`), NOT `rounded-md`/`rounded-full` — a sharp, quiet, luxury
button shape. Uppercase + wide letter-spacing + small 12px text is the "expensive" signal here,
not size or saturation. Use `.btn-dark` for the primary buy action (WhatsApp CTA replaces "Add to
cart" but keeps this exact visual treatment), `.btn-outline` for secondary actions, `.btn-gold`
sparingly for a single featured/promo moment (e.g. a bundle offer CTA).

### Exact layout rhythm

- Hero: `min-height: 88vh`, two-column grid (`1fr 1fr`, `gap: 80px`, `max-width: 1200px`),
  image side `aspect-ratio: 3/4` with `border-radius: 4px`.
- Section padding: `100px 40px` (desktop) — generous, alternating between white and
  `var(--light)` (`#F7F5F2`) backgrounds section-to-section for rhythm.
- Cards (`kit-card` equivalent — our product cards): `border: 1px solid #E8E4DE; border-radius:
  4px; background: #FFFFFF;` — thin border, barely-rounded, no heavy shadow by default.
- A black full-bleed CTA band (`background: #111111; padding: 100px 40px; text-align: center;`)
  is a real, correct pattern here (their `.cta-section`) — use for the final homepage CTA banner.
- Star ratings: solid gold (`color: #C4A35A`), letter-spacing on the star glyphs themselves for a
  refined look, not oversized/cartoonish.

### Product imagery — styled flat-lay direction

Their real product photography (`kit-keratine.webp`, inspected directly) is a **staged flat-lay**:
glossy black glass bottles with gold foil caps and gold/white label text, arranged fanned at
slight angles, against a warm caramel/tan gradient backdrop with a soft circular backdrop shape
and a dried botanical leaf sprig prop, soft grounded shadow beneath. This is the target look for
our product hero images — not a plain object on a flat white background. New hero illustrations
(`public/images/products/{slug}-hero.svg`) should be rebuilt as a **full staged-shot composition**
(background gradient + product + prop baked into one image, like a real photograph would be), in
glossy black-glass-with-gold-cap language, one warm-toned backdrop per product for variety, using
our own "VITALSUPPS" gold-foil-style label instead of a photo.

---

## Pass 7 — Real Logo Color Match

Passes 1-6 above explored a black/gold "luxury boutique" direction as a design reference point,
but it never matched the client's actual company logo. This pass replaces the brand accent colors
with values sampled directly (via `sharp`, both targeted pixel sampling and statistical
median/extremes) from the real logo files (`public/VitalSupps logo.jpg`, `public/VitalSupps.jpg`,
`public/VitalSupps logo.ico`) — a glossy "nature + water/science" mark (green leaf, blue water
droplet/ring, molecule icon, sparkle highlights) on white. Typography, layout, spacing, and the
ecommerce patterns from prior passes are unchanged — this pass is colors only.

Sampled source values: wordmark green `#2e8912` (clean sample), wordmark blue `#137bc2` (clean
sample), green median across leaf `#43a827` / darkest leaf shadow `#044200`, blue median across
ring/droplet `#088bd7` / darkest ring shadow `#001e48`, bright cyan sparkle highlight `#4ce2fd`.

Tokens changed in `app/globals.css`'s `@theme inline` block:

- `--color-accent-blue` (the primary brand/action color token — name is legacy, it now holds the
  logo's green since green is the dominant color): `#1f5d3e` → `#2e8912`, `-dark` (hover step)
  `#153f2a` → `#226b12`, `-light` (tint) `#e3f0e9` → `#eaf6e3`, `-ring` (focus ring)
  `#8fa286` → `#6fbf5a`.
- `--color-accent-secondary` (was Pass 6 gold, now the logo's blue): `#c4a35a` → `#137bc2`,
  `-dark` `#b8964e` → `#0b5a94`, `-light` `#e8d5a3` → `#e3f3fc`.
- `--color-accent-terracotta` (Gut Health line differentiator): left unchanged at `#c05a32` —
  still reads as an intentional warm contrast against the new green/blue system.
- `--color-star` (`#ffa41c`) and `--color-sale` (`#b33a3a`): left unchanged — rating-star yellow
  and sale-badge red are UX conventions independent of brand color.
- `--color-dark-text`, `--color-off-white`, `--color-light-gray`, `--color-subtle-gray`,
  `--color-muted-text`: untouched — body/heading text stays neutral near-black for readability,
  it was never repointed to green.
- `--color-cta` (`#ffa41c`, already noted as retired/unused in Pass 6): left as-is, confirmed via
  grep that `bg-cta` has zero usages in components.

`.btn-dark`/`.btn-gold` in `app/globals.css` (previously hardcoded hex, not tokenized) were
switched to reference `var(--color-accent-blue)` / `var(--color-accent-secondary)` (and their
`-dark` hover steps) instead of literal `#111111` / `#c4a35a`, so the primary buy button is now
green-on-white and the featured/promo button is blue-on-white (white text, better contrast than
the old gold-with-dark-text). `.btn-outline` intentionally stays neutral black/gray as a ghost
secondary style.

Several interactive "selected/active state" UI moments that were using `--color-dark-text` (near-
black) as a stand-in accent color were recolored to `--color-accent-blue` (green) so branded
moments actually read as branded: the BuyBox variant-selector active pill
(`components/BuyBox.tsx`), the FAQ accordion active card border + open-state icon fill
(`components/FAQSection.tsx`, `app/[locale]/products/[slug]/ProductPageClient.tsx`), the product
gallery active thumbnail border (`ProductPageClient.tsx`), and the homepage hero ribbon badge
(`app/[locale]/HomePageClient.tsx`). Plain body text, headings, and structural dark surfaces
(footer, black CTA band, hamburger icon, tooltips) were left as near-black — only actual
brand/accent moments were recolored.
