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
