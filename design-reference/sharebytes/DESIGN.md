---
name: ShareBytes
colors:
  surface: '#fff8f6'
  surface-dim: '#eed5cc'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#ffe9e2'
  surface-container-high: '#fce3da'
  surface-container-highest: '#f7ddd5'
  on-surface: '#261814'
  on-surface-variant: '#594139'
  inverse-surface: '#3c2d27'
  inverse-on-surface: '#ffede7'
  outline: '#8d7168'
  outline-variant: '#e1bfb5'
  surface-tint: '#ab3500'
  primary: '#ab3500'
  on-primary: '#ffffff'
  primary-container: '#d04a14'
  on-primary-container: '#100200'
  inverse-primary: '#ffb59d'
  secondary: '#944930'
  on-secondary: '#ffffff'
  secondary-container: '#fd9e7f'
  on-secondary-container: '#76331c'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c8a91f'
  on-tertiary-container: '#4c3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#ffb59d'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#832700'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390b00'
  on-secondary-fixed-variant: '#76321b'
  tertiary-fixed: '#ffe171'
  tertiary-fixed-dim: '#e5c43c'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#554600'
  background: '#fff8f6'
  on-background: '#261814'
  surface-variant: '#f7ddd5'
typography:
  display:
    fontFamily: plusJakartaSans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
  display-mobile:
    fontFamily: plusJakartaSans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: plusJakartaSans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: plusJakartaSans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  headline-sm:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: plusJakartaSans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-sm:
    fontFamily: plusJakartaSans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-lg:
    fontFamily: plusJakartaSans
    fontSize: 16px
    fontWeight: '700'
    lineHeight: 22px
  label-md:
    fontFamily: plusJakartaSans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
  label-sm:
    fontFamily: plusJakartaSans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4rem
  touch-target-min: 3rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  container-max: 72rem
---

## Brand & Style
The design system powers an accessible, neighborhood-driven food sharing platform designed to bridge surplus meals with community members. Its core personality is optimistic, generous, grounded, and intuitive.

To guarantee complete self-explanatory clarity for users of diverse backgrounds and low-literacy contexts, the design philosophy fuses **Playful Tactility** with **Hyper-Legible Visual Minimalism**. The interface prioritizes iconic visual affordances, high-contrast pictograms, and visual status signaling over dense typography.

Key emotional pillars:
- **Dignified & Welcoming:** Generous spacing, soft warm paper-like surfaces, and gentle curves remove transactional coldness.
- **Iconic Universality:** Actions and concepts are communicated through obvious, universally understood visual metaphors (bowls, parcels, clocks, checkmarks, locations) paired with unambiguous color cues.
- **Focused Vibrancy:** Saturated hues are strictly reserved for calls-to-action, state changes, and key status badges. All operational Chrome remains calm, neutral, and warm.

## Colors
The palette leverages warm, wholesome organic foundations complemented by purposeful, content-driven accents.

### Foundation & Surfaces
- **Canvas Base (`#f9f9ff`):** Soft, warm oat cream serving as the app-wide background canvas.
- **Card Surface (`#ffffff`):** Crisp pure white utilized for primary interaction cards, modular sheets, and floating bars to define visual layers without harsh contrasts.
- **Muted Surface (`#f0f3ff`):** Tonal neutral surface for inactive chips, input field backgrounds, and container dividers.

### Primary Accents & Signals
- **Content Orange (`#d04a14`):** The primary brand catalyst. Denotes primary claims, sharing triggers, and main user conversions. Used as solid fills or gentle warm gradients for forward progression.
- **Earthy Clay (`#b26146`):** Represents success, fresh availability, verified items, and confirmed handoffs.
- **Amber Signal (`#c8a91f`):** Indicates urgent expiration countdowns, canceled requests, rejections, and removal actions.

### Neutrals & Text Tiers
- **Neutral Slate (`#87736c`):** Deep warm slate for maximum legibility on titles, primary values, and high-visibility iconography.
- **Secondary Tone:** Calibrated for helper notes, secondary visual indicators, and supporting metadata.
- **Border Outline:** Gentle, warm outline for cards, form fields, and visual compartmentalization.

## Typography
`Plus Jakarta Sans` is selected across all roles for its geometric humanist proportions, wide counters, open apertures, and friendly rounded terminals. This font retains superior legibility at glanceable speeds and on low-resolution screens.

### Design Principles
- **Weight as Hierarchy:** Avoid subtle weight differences. Use Bold/Extra-Bold (`700`/`800`) for headers and primary controls; Medium (`500`) for body copy to avoid spindly strokes that degrade readability.
- **Icon Pairing:** Text labels must always maintain proportional height with accompanied glyphs. On mobile cards, icons take optical priority, reinforced by concise, direct labels.
- **Numbers & Metrics:** Quantities (e.g., "3 portions left", "15 mins") use tabular numerals with `label-lg` or `headline-sm` weights to communicate critical food data at a glance.

## Layout & Spacing
The layout uses an 8pt spatial grid with generous inner breathing room, designed for mobile-first utility in field conditions (e.g., street pickups, community kitchens).

### Grid Models & Breakpoints
- **Mobile (<640px):** 4-column fluid layout with `1rem` margins and `1rem` gutters. All primary action targets adhere strictly to a minimum touch target of `48px` (`3rem`), expanding to `56px` for primary bottom-docked action bars.
- **Tablet (640px–1024px):** 8-column layout, `1.5rem` margins. Food cards reflow into a 2-column card catalog with visual focal imagery.
- **Desktop (>1024px):** 12-column layout maxing out at `72rem` (`1152px`) centered container width, providing a stable split view (e.g., listings feed on the left, interactive neighborhood map on the right).

### Spacing Philosophy
- White space represents visual separation rather than decorative luxury. Generous padding inside cards (`1.25rem` to `1.5rem`) prevents touch errors and visually isolates listing statuses.

## Elevation & Depth
Depth conveys physical reachability and establishes operational hierarchy. The system relies on soft, diffused, warm-tinted ambient shadows layered over subtle border outlines, avoiding hard technical drop shadows.

### Elevation Hierarchy
- **Level 0 (Flat / Canvas):** Neutral background with no shadow. Used for base canvas surfaces and passive content separators.
- **Level 1 (Card & Content Blocks):** Soft ambient lift. 
  - `box-shadow: 0 2px 8px -2px rgba(135, 115, 108, 0.05), 0 1px 3px 0 rgba(135, 115, 108, 0.03);`
  - Paired with an intentional warm hairline border to provide crisp edge definition on budget mobile displays.
- **Level 2 (Interactive Elements & Drawers):** Lifted interactive cards, dropdown trays, and modal sheets.
  - `box-shadow: 0 10px 25px -5px rgba(135, 115, 108, 0.08), 0 8px 10px -6px rgba(135, 115, 108, 0.04);`
- **Level 3 (Floating Persistent Triggers):** Sticky claim buttons, SOS alerts, and navigation bars.
  - `box-shadow: 0 20px 30px -10px rgba(208, 74, 20, 0.22), 0 10px 15px -5px rgba(135, 115, 108, 0.06);`
  - Employs a warm orange ambient aura under primary CTAs to signal immediate tappability.

## Shapes
The shape language conveys safety, approachability, and organic warmth through generous corner curves.

- **Micro Elements (Badges, Checkboxes):** Rounded at `8px` (`0.5rem`).
- **Input Fields & Buttons:** Standardized at `16px` (`1rem`) to create smooth, pill-adjacent touch capsules that invite direct interaction.
- **Cards & Sheet Surfaces:** Standardized at `20px` to `24px` (`1.25rem` to `1.5rem`), softening the screen and visually separating food items into friendly, self-contained packages.
- **Floating Bottom Action Bars:** Pill-shaped (`9999px`) or full-width sheet containers with `24px` top radiuses.

## Components

### Buttons
- **Primary Action (Claim / Share):** 52px minimum height, filled with content-driven warm primary tone (`#d04a14`). Text is bold white (`#ffffff`) with a mandatory leading iconic glyph (e.g., shopping bag, hand heart).
- **Secondary / Confirm Action:** Crisp white surface with a `2px` solid secondary outline (`#b26146`) and secondary text.
- **Destructive / Decline Action:** Muted tertiary tint background with solid tertiary text (`#c8a91f`) and icon.

### Status Chips & Badges
- High-contrast, dual-signaling badges (icon + text color):
  - *Available Now:* Secondary tone background, border, and dark text, prefixed with a filled circle icon.
  - *Expiring Soon:* Primary tone background and border, accompanied by an urgent clock glyph.
  - *Reserved / Gone:* Slate neutral background and text, accompanied by a closed lock icon.

### Cards (Food Item Postings)
- White container (`#ffffff`) framed by a `1px` border and `20px` radius.
- Top section: Edge-to-edge photography or generous food type illustration with floating status badge on the top-left and distance pill on the top-right.
- Middle section: Large bold title (`headline-sm`), accompanied by a clear pictorial portion indicator (e.g., 3 plate icons for "3 meals").
- Bottom section: Creator avatar, proximity icon, and prominent action button spanning full card width.

### Input Fields
- Generous `52px` height, filled with soft muted canvas.
- Active focus state: Solid `2px` border in primary color (`#d04a14`) accompanied by an ambient focus ring, with label text shifting to neutral.
- Clear visual leading icon (e.g., magnifying glass, map pin) at `24px` scale to ground input context without relying purely on text placeholders.

### Visual Radio & Counter Selectors
- Replaced by large tactile touch tiles (minimum `64px` height) with embedded icons and numerical increments (+ / -) scaled for one-handed operation.
- Selected state turns vibrant primary orange with an inner check badge.