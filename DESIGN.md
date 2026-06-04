---
version: alpha
name: Kazi-AI Talent Platform
description: >
  A warm, energetic job-matching and recruiting platform that blends productivity dashboards
  with human-centered career storytelling, using a consistent orange-led visual identity.

colors:
  primary: "#ff6b35"
  primary-light: "#ff8c42"
  primary-dark: "#e55a2b"
  accent-deep: "#d4461f"

  background: "#ffffff"
  foreground: "#0a0a0a"
  card: "#ffffff"
  card-foreground: "#0a0a0a"
  popover: "#ffffff"
  popover-foreground: "#0a0a0a"

  secondary: "#f5f5f5"
  secondary-foreground: "#171717"
  muted: "#f5f5f5"
  muted-foreground: "#737373"
  accent: "#f5f5f5"
  accent-foreground: "#171717"

  destructive: "#ef4444"
  destructive-foreground: "#ffffff"
  border: "#e5e5e5"
  input: "#e5e5e5"
  ring: "#ff6b35"

typography:
  display-xl:
    fontFamily: "Inter"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: "Satoshi"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em
  headline-md:
    fontFamily: "Satoshi"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
  body-md:
    fontFamily: "Source Sans 3"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Source Sans 3"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: "Inter"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.04em
  label-sm:
    fontFamily: "Inter"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.08em
  code-sm:
    fontFamily: "Source Sans 3"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4

rounded:
  none: 0px
  sm: 4px
  md: 10px
  lg: 16px
  pill: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  gutter: 24px
  card-padding: 20px
  section-y: 40px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"
    padding: 10px
    typography: "{typography.label-md}"
  button-primary-hover:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"
  button-primary-active:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.md}"

  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    padding: 10px
    typography: "{typography.label-md}"

  tag-queue-tier-basic:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.pill}"
    padding: 4px
    typography: "{typography.label-sm}"
  tag-queue-tier-premium:
    backgroundColor: "{colors.primary-light}"
    textColor: "{colors.destructive-foreground}"
    rounded: "{rounded.pill}"
    padding: 4px
    typography: "{typography.label-sm}"

  card-surface:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.card-padding}"
  card-kanban-column:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"

  nav-topbar:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    height: 64px
  nav-sidebar:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.muted-foreground}"
    width: 260px

  input-field:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    borderColor: "{colors.input}"
    rounded: "{rounded.sm}"
    padding: 10px
    typography: "{typography.body-sm}"

  chip-filter:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.pill}"
    padding: 6px
    typography: "{typography.label-sm}"

  toast-notification:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"

  kanban-card-job:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"

  chart-panel:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"

---

## Overview

Kazi-AI is a dual-perspective talent platform that connects job seekers and recruiters through a warm, energetic interface built around a Kanban-style job tracker, queue-based sourcing, and institution-level management.

The visual identity blends **productivity dashboard clarity** with **human-centered career storytelling**. The warm orange palette signals momentum, optimism, and action, while neutral surfaces and clear typography keep complex workflows—like multi-step signup, queue management, and institution administration—legible and calm.

The experience should feel:

- **Warm and encouraging** for job seekers navigating applications and interviews.
- **Confident and operational** for recruiters managing pipelines, queues, and teams.
- **Consistent and predictable** across flows, with minimal visual surprises and strong reuse of patterns.

## Colors

The color system is anchored in a **warm orange brand core** with neutral supporting tones. Orange is reserved for primary actions, key highlights, and brand anchors; neutrals carry most of the layout and data density.

- **Primary (#ff6b35):** Core brand and action color used for primary buttons, key CTAs, and high-salience highlights.
- **Primary Light (#ff8c42):** Hover and subtle emphasis state for primary actions and chips.
- **Primary Dark (#e55a2b):** Active/pressed states and high-contrast accents.
- **Deep Accent (#d4461f):** Secondary accent for critical emphasis, premium markers, or important metrics.

- **Background (#ffffff):** Base canvas for all pages.
- **Foreground (#0a0a0a):** Primary text and icon color for maximum readability.
- **Card (#ffffff):** Surfaces for Kanban cards, dashboards, and panels.
- **Card Foreground (#0a0a0a):** Text on cards and panels.

- **Secondary (#f5f5f5):** Column backgrounds, subtle sections, and low-contrast surfaces.
- **Secondary Foreground (#171717):** Text on secondary surfaces.
- **Muted (#f5f5f5) / Muted Foreground (#737373):** Metadata, helper text, and low-priority labels.
- **Accent (#f5f5f5) / Accent Foreground (#171717):** Hover states and subtle interactive surfaces.

- **Destructive (#ef4444):** Errors, destructive actions, and critical alerts.
- **Destructive Foreground (#ffffff):** Text on destructive surfaces.
- **Border/Input (#e5e5e5):** Dividers, card outlines, and input borders.
- **Ring (#ff6b35):** Focus outlines and interactive emphasis, reinforcing the brand color.

Primary orange should be used **sparingly but decisively**: one main CTA per view, key queue tier markers, and important pipeline transitions.

## Typography

Kazi-AI uses a **three-font system**:

- **Inter** for UI labels, navigation, and compact interface text.
- **Satoshi** for headlines and key section titles, giving a confident, modern voice.
- **Source Sans 3** for body copy, forms, and long-form explanations.

The hierarchy:

- **Display XL (Inter/Satoshi):** High-level marketing or hero headlines (landing, platform overview).
- **Headline LG/MD (Satoshi):** Page titles (Job Tracker, Queue Detail, Institution Management).
- **Body MD/SM (Source Sans 3):** Descriptions, form labels, helper text, and table content.
- **Label MD/SM (Inter):** Tags, chips, button labels, and small UI metadata.
- **Code SM (Source Sans 3):** Any technical snippets or identifiers (IDs, codes).

Typography should:

- Maintain **clear contrast** between headlines and body.
- Avoid more than **two weights per screen** to keep the interface clean.
- Use uppercase labels sparingly for emphasis (e.g., queue tiers, status chips).

## Layout

The layout follows a **dashboard-first mental model**:

- **Top navigation bar** for global actions (auth, role switching, profile, notifications).
- **Left sidebar** for primary navigation (Dashboard, Jobs, Queues, Institutions, Team, Chat, Settings).
- **Main content area** with cards, Kanban columns, and charts.

Spacing is based on a **4/8/16px scale**:

- 8px and 16px for internal component padding.
- 24px and 32px for section spacing and card separation.
- 48px for major vertical rhythm between large sections (e.g., landing page bands).

Key layout principles:

- **Kanban views** (Job Tracker, Queue boards) use full-width columns with consistent gutter spacing and scrollable columns.
- **Dashboards** (Recruiter, Institution, Team) use a **card grid** with clear grouping of metrics, charts, and tables.
- **Multi-step flows** (signup wizards, user creation, job posting) use a centered, constrained width with clear step indicators and consistent button placement.

## Elevation & Depth

Depth is conveyed primarily through **layering and contrast**, not heavy shadows:

- Cards sit on a slightly lighter or neutral background with subtle borders.
- Shadows, when used, are **soft and minimal**, reserved for modals, popovers, and drag-and-drop previews.
- Kanban cards and queue tiles should feel **lifted** when dragged (slightly stronger shadow and scale).

Elevation rules:

- **Base cards:** Border + subtle background contrast, minimal or no shadow.
- **Interactive overlays (modals, sheets, popovers):** Slightly stronger shadow and clear separation from the background.
- **Drag states:** Increased elevation and subtle scale to reinforce movement.

## Shapes

The shape language is **softly geometric**:

- Default corner radius is **10px** for cards and primary buttons, matching the warm, approachable brand.
- Small controls (inputs, chips, tags) use **4px** radius.
- Pills (queue tier tags, filters) use **full/pill** radius for a friendly, badge-like feel.

Guidelines:

- Avoid mixing sharp and heavily rounded corners in the same component cluster.
- Maintain consistent radii across similar components (all primary buttons share the same radius; all cards share the same radius).

## Components

### Buttons

- **Primary Button (`button-primary`):**
  - Background: `{colors.primary}`
  - Hover: `{colors.primary-light}`
  - Active: `{colors.primary-dark}`
  - Text: white
  - Use for: main CTAs (Apply, Post Job, Join Queue, Upgrade, Save Changes).

- **Secondary Button (`button-secondary`):**
  - Background: `{colors.secondary}`
  - Text: `{colors.secondary-foreground}`
  - Use for: secondary actions, filters, and non-destructive navigation.

- **Link-style actions:**
  - Use primary color text with underline on hover for low-weight actions (e.g., “View details”, “Learn more”).

### Tags & Chips

- **Queue Tier Tags (`tag-queue-tier-basic`, `tag-queue-tier-premium`):**
  - Basic: neutral background, muted text.
  - Premium: primary-light background, white or dark text depending on contrast.
  - Used in queue lists, dashboards, and pricing contexts.

- **Filter Chips (`chip-filter`):**
  - Neutral background with clear label text.
  - Selected state may use primary-light background and stronger text color.

### Cards

- **Surface Cards (`card-surface`):**
  - Used for dashboard panels, profile sections, and settings.
  - Include clear headings (headline-md) and body text (body-sm/md).

- **Kanban Column Cards (`card-kanban-column`):**
  - Column background: secondary.
  - Individual job cards: white with subtle border and hover elevation.

### Navigation

- **Topbar (`nav-topbar`):**
  - White background, strong foreground text.
  - Contains logo, role switcher, notifications, and profile menu.

- **Sidebar (`nav-sidebar`):**
  - Secondary background, muted text.
  - Active item uses primary accent (left border or background) and stronger text color.

### Inputs & Forms

- **Input Fields (`input-field`):**
  - White background, subtle border, small radius.
  - Clear focus ring using `{colors.ring}`.
  - Used consistently across auth, signup wizards, job posting, and filters.

- **Form Layout:**
  - Single-column on mobile, two-column where appropriate on desktop (e.g., institution setup, team management).
  - Real-time validation with inline error text in destructive color.

### Feedback & Notifications

- **Toasts (`toast-notification`):**
  - Card-style with subtle elevation.
  - Use primary or neutral accents depending on message type.

- **Empty States:**
  - Use illustration-light layouts with a short explanation and a single primary CTA (e.g., “Create your first queue”, “Post your first job”).

### Data & Analytics

- **Charts (`chart-panel`):**
  - Card container with clear title and legend.
  - Use primary and deep accent for key series; neutrals for baselines.

- **Tables & Lists:**
  - Zebra striping optional; rely on spacing and typography for clarity.
  - Status chips for job status, queue position, and approval states.

## Do's and Don'ts

- **Do** use the primary orange for the single most important action per screen.
- **Do** keep Kanban columns visually consistent across job seeker and recruiter views.
- **Do** reuse card, chip, and button patterns across dashboards, queues, and institution management.
- **Do** maintain WCAG AA contrast ratios for all text and interactive elements.
- **Do** use skeleton loaders and optimistic updates to keep flows feeling responsive.

- **Don't** introduce additional brand colors beyond the defined warm orange and neutral palette.
- **Don't** mix too many font weights or sizes on a single screen; keep hierarchy simple.
- **Don't** overload screens with borders; prefer spacing and subtle background shifts to create structure.
- **Don't** use destructive red for non-critical actions or neutral warnings.
- **Don't** break established flows visually—auth, signup wizards, Kanban, and queue management should feel like parts of the same system.
