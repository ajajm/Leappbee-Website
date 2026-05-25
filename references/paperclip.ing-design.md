---
version: alpha
name: Paperclip
description: A dark, editorial landing-page system with warm neutrals and a playful neon accent.
colors:
  primary: "#F4E7C1"
  secondary: "#A59A8C"
  tertiary: "#1A1A1A"
  neutral: "#FFFFFF"
  surface: "#141312"
  on-surface: "#F4E7C1"
  accent: "#000000"
  border: "#E0DCD6"
  muted-border: "#1A1A1A17"
  overlay: "#1A1A1A"
  error: "#D95B5B"
typography:
  headline-display:
    fontFamily: "Instrument Serif"
    fontSize: "66px"
    fontWeight: 400
    lineHeight: "76px"
    letterSpacing: "-0.66px"
  headline-lg:
    fontFamily: "Instrument Serif"
    fontSize: "46px"
    fontWeight: 400
    lineHeight: "55px"
    letterSpacing: "-0.38px"
  headline-md:
    fontFamily: "Instrument Serif"
    fontSize: "33px"
    fontWeight: 400
    lineHeight: "38px"
  headline-sm:
    fontFamily: "Inter"
    fontSize: "23px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "0.14px"
  body-lg:
    fontFamily: "Inter"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "29px"
  body-md:
    fontFamily: "Inter"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
  body-sm:
    fontFamily: "Inter"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "24px"
  label-lg:
    fontFamily: "Inter"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: "24px"
  label-md:
    fontFamily: "Inter"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "22px"
  label-sm:
    fontFamily: "Inter"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "18px"
    letterSpacing: "0.04em"
  caption:
    fontFamily: "Inter"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: "20px"
  code:
    fontFamily: "Inter"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "24px"
    letterSpacing: "0.01em"
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "22px"
  xl: "32px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "14px"
  md: "24px"
  lg: "60px"
  xl: "100px"
  gutter: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.tertiary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: "13px 32px"
    height: "52px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.secondary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: "13px 32px"
    height: "52px"
  button-tertiary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.none}"
    padding: "0px"
    height: "auto"
  card:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.tertiary}"
    rounded: "{rounded.lg}"
    padding: "18px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "12px"
  chip:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  code-block:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "18px"
---

# Paperclip

## Overview
Paperclip feels like a polished, playful SaaS landing page for technically literate teams. The tone is professional but not cold: a dark canvas, warm cream text, and loud gradient artwork create a premium, slightly whimsical mood. The layout is spacious and editorial, with a clear hierarchy that keeps the page feeling calm even when the visuals are energetic.

## Colors
- **Primary (#F4E7C1):** A warm cream used for the most important buttons, hero text, and selected surface accents. It softens the otherwise dark interface and gives the brand its friendly, premium feel.
- **Secondary (#A59A8C):** A muted taupe used for supporting copy, subtle navigation items, and less prominent labels. It works as the quiet companion to the stronger cream text.
- **Tertiary (#1A1A1A):** A deep ink-black used for text and dark utility surfaces. It anchors the palette and keeps contrast crisp.
- **Neutral (#FFFFFF):** Clean white used sparingly for bright surfaces and card interiors when needed. It helps UI elements feel crisp against the dark shell.
- **Surface (#141312):** The main canvas color for the page background and darker containers. It is nearly black, but slightly softened so the interface feels less harsh than pure black.
- **On-surface (#F4E7C1):** The default readable color on dark surfaces, matching the warm cream used throughout the hero and CTAs. It keeps the interface cohesive.
- **Border (#E0DCD6):** A pale neutral border used for light-outline controls and chips. It supports structure without adding visual weight.
- **Muted Border (#1A1A1A17):** A very subtle translucent border for cards and panels. It preserves the flat editorial look while still separating layers.
- **Accent (#000000):** Pure black for the strongest contrast moments and iconography where absolute depth is useful.
- **Error (#D95B5B):** A restrained red reserved for destructive or validation states. It should stay uncommon so the palette remains serene.

## Typography
The system pairs **Instrument Serif** for display headings with **Inter** for everything functional. The serif headlines create a confident editorial voice, while Inter keeps navigation, buttons, body copy, and code-like content highly legible and modern. Headings are light in weight and rely on tight negative tracking, especially at the largest sizes, while labels and UI text use a slightly heavier weight for clarity.

Use `headline-display` and `headline-lg` for hero moments and section headlines, with `headline-md` for supporting section titles. `body-md` is the default reading size, and `body-sm` supports dense supporting copy. Labels (`label-lg`, `label-md`, `label-sm`) should remain compact and practical; `label-sm` can be used for small status text or tokens. Uppercase is not a dominant pattern, but small labels benefit from slightly increased letter spacing when needed.

## Layout & Spacing
The page uses a centered, fixed-max-width presentation with generous empty margins on large screens. Content is arranged in clear vertical bands: a top navigation, a hero, then a two-column quickstart section. Spacing is airy and rhythmic, with large section gaps and smaller internal steps that keep the page from feeling crowded.

Use the spacing scale as a simple cadence: `xs` for tight inline gaps, `sm` for small component spacing, `md` for standard stack spacing, `lg` for section-level separation, and `xl` for major page breathing room. Cards and code panels should use comfortable inner padding rather than dense packing. Buttons should maintain balanced horizontal padding, with enough height to feel substantial on a dark background.

## Elevation & Depth
The interface is mostly flat and border-led, not shadow-heavy. Depth comes from tonal separation, thin outlines, and occasional soft shadow on cards rather than from dramatic elevation. The card treatment uses a subtle border and a low-contrast shadow to lift content just enough from the background without breaking the minimal aesthetic.

Gradient artwork in the hero acts as the main visual depth cue. Utility panels and code snippets should rely on surface contrast and carefully managed borders instead of layered shadows. Reserve stronger glow or vivid effects for decorative graphics, not foundational UI blocks.

## Shapes
The shape language is rounded and friendly, especially for CTAs and pills. Primary and secondary buttons use a full pill radius, which makes the interface feel approachable despite the dark palette. Cards are more grounded with a large but controlled `rounded.lg` corner radius.

Avoid sharp geometry except where function demands it, such as code shells or minimal separators. The overall feeling should be soft, modern, and slightly organic rather than rigid.

## Components
Buttons:
- `button-primary` is the main call to action: cream background, dark text, pill radius, and medium-large padding. It should feel prominent but not aggressive.
- `button-secondary` is the outline version: transparent background, subtle border, muted text, and the same pill shape and height as primary buttons.
- `button-tertiary` is a text-only action for secondary navigation and inline links. Keep it minimal and avoid adding a container unless necessary.
- Hover states should preserve the calm look: gently adjust contrast or border visibility instead of adding strong shadows or motion-heavy effects.

Cards:
- `card` surfaces should stay light and neutral against the dark page, with a soft border and minimal shadow.
- Keep internal spacing generous, especially for mixed content like titles, descriptions, and action rows.
- Cards should not use heavy color fills; the structure should come from contrast and spacing.

Inputs:
- Inputs should match the surface system with subtle borders and rounded corners.
- Use clear focus treatment, but keep it aligned with the muted, editorial tone.
- Avoid tall, bulky fields; they should feel compact and efficient.

Chips:
- Chips should be pill-shaped and compact, often used for small state labels or selector tabs.
- Use solid dark fills with warm text or the reverse, depending on placement.
- Keep chip typography small and slightly heavier than body copy.

Code blocks and command panels:
- Use a dark surface, thin border, and monospace-like visual clarity achieved through Inter and spacing.
- Keep controls minimal and aligned to the top-right or inline with the code content.
- These panels should feel utilitarian, not decorative.

Navigation:
- Top-nav links should be understated and text-first.
- The brand mark should remain centered and calm, with the action button offset to the right.
- Preserve wide spacing between navigation items so the top bar feels airy.

## Do's and Don'ts
- Do keep the interface dark, warm, and highly readable with cream text on deep surfaces.
- Do use Instrument Serif for prominent headlines and Inter for all utility and body text.
- Do keep buttons pill-shaped and generously padded.
- Do prefer subtle borders and tonal contrast over heavy shadows.
- Do preserve large whitespace around the hero and section blocks.
- Don't introduce sharp-cornered controls as a default style.
- Don't overuse bright accents outside of the hero artwork and intentional highlights.
- Don't make cards feel heavy, glossy, or layered with multiple shadows.