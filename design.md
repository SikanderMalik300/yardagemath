# Design System: YardageMath

## 1. Design Direction

YardageMath should feel like a dependable professional utility rather than an entertainment product or AI experiment.

The interface should communicate:

- Accuracy.
- Clarity.
- Practical usefulness.
- Trust.
- Speed.
- Professional construction and landscaping expertise.

Use a light, restrained visual style with strong typography, clear spacing, subtle borders, and minimal decoration. Avoid neon colors, purple gradients, glassmorphism, excessive rounded cards, animated backgrounds, oversized illustrations, and unnecessary visual effects.

The design should feel appropriate for:

- Homeowners planning projects.
- Contractors estimating materials.
- Landscapers and lawn-care professionals.
- Users accessing the site on mobile while working outdoors.

The interface must remain highly usable at 360px wide and should not depend on color alone to communicate meaning.

***

## 2. Visual Style

### Overall Appearance

Use a warm, neutral light theme:

- Page background: soft off-white or very light gray.
- Content surfaces: white.
- Primary text: deep charcoal, not pure black.
- Borders: light neutral gray.
- Accent color: professional muted green or blue-green.
- Warning color: restrained amber.
- Error color: clear red.
- Success color: dark green.

The interface should feel compact but not cramped. Content should be easy to scan, with enough spacing around important controls and results.

### Recommended Color Tokens

```css
:root {
  --background: #f7f8f6;
  --surface: #ffffff;
  --surface-muted: #f1f3f1;
  --surface-emphasis: #e9efeb;

  --text-primary: #17201b;
  --text-secondary: #53605a;
  --text-muted: #748078;
  --text-inverse: #ffffff;

  --border: #dfe5e1;
  --border-strong: #c8d1cb;

  --brand: #236b4b;
  --brand-hover: #1b583d;
  --brand-soft: #e7f1eb;

  --success: #28734c;
  --warning: #94641d;
  --warning-soft: #fff6df;
  --error: #b33b36;
  --error-soft: #fff0ef;

  --focus-ring: #4c9c77;
  --shadow-soft: 0 1px 2px rgba(23, 32, 27, 0.05);
  --shadow-card: 0 4px 14px rgba(23, 32, 27, 0.06);
}
```

Do not use gradients as a primary design element. If a subtle background treatment is required, use a solid color or very light tint instead.

***

## 3. Typography

Use a clean, highly legible sans-serif typeface with strong support for numbers, tables, and compact form controls.

### Font Recommendation

Use **Inter** as the primary interface font through `next/font`.

Recommended weights:

- 400: body text.
- 500: labels and secondary emphasis.
- 600: buttons, card titles, and section headings.
- 700: page titles and primary result values.

Use no more than two font families. Prefer Inter throughout the product for consistency and performance.

```ts
Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
})
```

### Type Scale

```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
```

### Typography Rules

- Body text: 16px with a line height of 1.55.
- Form labels: 14px, weight 600.
- Supporting form text: 13px or 14px.
- Page H1: 32px on desktop, 28px on mobile.
- Section H2: 24px on desktop, 21px on mobile.
- Card titles: 17px or 18px.
- Primary result value: 32px to 40px depending on available space.
- Table text: 14px on desktop and 13px on mobile.
- Avoid all-uppercase headings except for very short labels.
- Use tabular numbers for measurement and currency values where supported.

```css
body {
  font-family: var(--font-inter), sans-serif;
  color: var(--text-primary);
  background: var(--background);
  font-size: 1rem;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.numeric {
  font-variant-numeric: tabular-nums;
}
```

***

## 4. Layout System

### Content Widths

Use a consistent centered layout:

```css
--content-max-width: 1180px;
--reading-max-width: 760px;
--calculator-max-width: 1080px;
```

Recommended page structure:

- Full-width header.
- Centered content container.
- Main content with a maximum width of 1180px.
- Long-form article text limited to approximately 760px.
- Calculator layouts allowed to expand to approximately 1080px.

### Spacing Scale

Use a predictable spacing scale:

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

Use smaller spacing between related form fields and larger spacing between major page sections.

### Border Radius

Keep the interface professional with moderate rounding:

```css
--radius-sm: 0.375rem; /* 6px */
--radius-md: 0.5rem;   /* 8px */
--radius-lg: 0.75rem;  /* 12px */
```

Avoid highly rounded pill-shaped containers except for small status labels or compact toggles.

***

## 5. Header and Navigation

The header should be clean, compact, and immediately communicate the site identity.

### Desktop Header

- White background.
- Bottom border using the standard border color.
- Maximum content width aligned with the main content.
- Logo or wordmark on the left.
- Primary navigation on the right.
- One visually distinct but restrained action for the calculator directory.
- Header height between 64px and 72px.

Suggested navigation:

- Calculators.
- Categories.
- How We Calculate.
- About.

Avoid adding too many navigation items. Legal links should remain in the footer.

### Mobile Header

- Height between 56px and 64px.
- Logo remains visible.
- Use a compact menu button with a clear accessible label.
- Navigation menu should open as a simple panel or dropdown.
- Avoid full-screen animated menus unless necessary.
- Keep the calculator directory easy to access.

### Logo Treatment

The brand should use a text-based wordmark or simple geometric mark. It should not use an AI-style sparkle, robot, brain, circuit, or gradient icon.

Recommended direction:

- Wordmark: `YardageMath`.
- Use the brand green for the mathematical or measurement-related portion only if it remains readable.
- Keep the logo usable at small sizes.
- Provide a monochrome version for print and low-contrast contexts.

***

## 6. Page Hierarchy

Every page should establish a clear visual hierarchy immediately.

### Page Introduction

Use a compact introductory area containing:

- Breadcrumbs.
- One H1.
- Short supporting description.
- Optional quick-answer or summary panel.

Do not create large hero sections that push the primary content below the fold.

The calculator or primary page action should appear quickly, especially on mobile.

### Breadcrumbs

Breadcrumbs should be:

- Small and muted.
- Positioned above the H1.
- Keyboard accessible.
- Separated with a simple slash or chevron.
- Visible on every page except the homepage.

Example visual structure:

```text
Home / Landscaping / Topsoil Calculator
```

Use links for every breadcrumb item except the current page.

***

## 7. Calculator Interface

The calculator is the primary product interface and should feel reliable, predictable, and easy to complete.

### Calculator Layout

On desktop:

- Use a two-column layout.
- Left column: inputs and controls.
- Right column: results and supporting actions.
- Keep both columns aligned from the top.
- Use a maximum width of approximately 1080px.

On mobile:

- Stack inputs above results.
- Keep the result section close to the input section.
- Do not place advertisements, decorative content, or long explanations between the form and results.
- Ensure the primary result remains visible without excessive scrolling.

```css
.calculator-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 800px) {
  .calculator-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

### Calculator Surface

Use a white card with:

- 1px border.
- Subtle shadow.
- 12px radius.
- Consistent internal padding.
- Clear section divisions.

Do not use multiple heavily nested cards. The calculator should feel like one coherent tool.

```css
.calculator-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
}

@media (max-width: 640px) {
  .calculator-card {
    padding: 1rem;
    border-radius: var(--radius-md);
  }
}
```

### Form Sections

Group related controls under concise section labels:

- Project dimensions.
- Material or calculation type.
- Additional options.
- Pricing or cost inputs.

Use a subtle horizontal divider between major groups. Avoid excessive explanatory text inside the form.

### Input Design

Inputs should be easy to scan and comfortable to use with one hand.

Requirements:

- Minimum height: 44px.
- Preferred height: 46px to 48px.
- Visible label above every input.
- Clear unit indicators.
- Input text aligned consistently.
- Decimal keyboard on mobile.
- No placeholder text used as the only label.
- Use sensible default values where appropriate.
- Keep units visually connected to their inputs.

```css
.input,
.select,
.textarea {
  width: 100%;
  min-height: 46px;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface);
  color: var(--text-primary);
  font-size: 1rem;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;
}

.input:hover,
.select:hover {
  border-color: #9eaca3;
}

.input:focus,
.select:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(35, 107, 75, 0.15);
}
```

### Feet and Inches Controls

For measurement inputs:

- Use clearly separated feet and inches fields.
- Keep the fields in the same row on desktop.
- Stack them only when necessary on narrow screens.
- Show units inside compact suffix labels or directly beside the fields.
- Keep field widths proportional to their expected values.

Example:

```text
Length
[ 10 ] ft    [ 0 ] in
```

Do not make users guess whether a value is in feet, inches, yards, or another unit.

### Validation

Validation should be calm and specific.

- Show errors close to the relevant field.
- Use plain language.
- Avoid red borders on every field before the user interacts with it.
- Preserve valid input when another field contains an error.
- Do not clear the entire form because of one invalid value.

Example:

```text
Enter a value greater than 0.
```

### Unit Toggle

Use a segmented control or compact tabs for unit selection.

- Clearly indicate the active unit system.
- Keep the control close to the relevant inputs.
- Use text labels such as `US customary` and `Metric`.
- Do not rely on icons or flags alone.
- Ensure the active state has sufficient contrast.

***

## 8. Results Panel

The result panel should provide immediate visual confirmation without looking flashy.

### Primary Result

Use a visually emphasized but restrained result area:

- Very light brand-tinted background.
- Clear result label.
- Large numeric value.
- Unit displayed with the value.
- Supporting text below if necessary.
- Accessible live-region behavior.

```css
.primary-result {
  background: var(--brand-soft);
  border: 1px solid #cfe1d6;
  border-radius: var(--radius-md);
  padding: 1.25rem;
}

.primary-result__label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
}

.primary-result__value {
  margin-top: 0.25rem;
  color: var(--text-primary);
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
```

Avoid:

- Animated counters.
- Glowing result boxes.
- Confetti or celebration effects.
- Excessive color changes.
- Large decorative icons competing with the number.

### Secondary Results

Display supporting values in a compact grid:

```css
.secondary-results {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
```

Each secondary result should contain:

- Small label.
- Bold value.
- Unit included in the value or label.
- Consistent alignment.

On mobile, two columns are acceptable if the values remain readable. Stack them when labels become cramped.

### Result Actions

Place actions below the result:

- Copy result.
- Share link.
- Print or save.
- Reset example.

Use one primary action style and secondary outlined or ghost buttons for the rest.

Do not make every action look equally important.

### Show the Math

Use a compact disclosure or accordion.

- Closed by default.
- Clear label such as `Show the math`.
- Formula content should be easy to read.
- Use a muted background for the expanded calculation.
- Use monospace only for formula notation or values where helpful.
- Avoid overly technical formatting on mobile.

***

## 9. Buttons and Controls

### Primary Button

Use the brand color for the main action only.

```css
.button-primary {
  min-height: 44px;
  padding: 0.625rem 1rem;
  border: 1px solid var(--brand);
  border-radius: var(--radius-sm);
  background: var(--brand);
  color: var(--text-inverse);
  font-size: 0.9375rem;
  font-weight: 600;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    transform 150ms ease;
}

.button-primary:hover {
  background: var(--brand-hover);
  border-color: var(--brand-hover);
}

.button-primary:active {
  transform: translateY(1px);
}
```

### Secondary Button

Use white or transparent backgrounds with visible borders.

- Suitable for reset, print, share, and secondary actions.
- Maintain at least 44px height.
- Avoid low-contrast gray text.

### Button Rules

- Use direct action labels.
- Prefer `Calculate`, `Copy result`, `Share`, and `Reset`.
- Do not use vague labels such as `Continue` when a more specific action is available.
- Keep icons secondary to text.
- Every icon-only button must include an accessible label and tooltip.

***

## 10. Homepage and Directory

The homepage should immediately explain the purpose of the website and guide users to a relevant tool.

### Homepage Structure

Recommended order:

1. Header.
2. Compact introduction.
3. Search or browse affordance if included.
4. Most popular tools.
5. Category sections.
6. Trust and methodology section.
7. Latest updates.
8. Footer.

Do not create a marketing-heavy hero section. The homepage should prioritize useful navigation over decorative branding.

### Tool Cards

Tool cards should be compact and consistent.

Each card may include:

- Tool name.
- One-sentence description.
- Category label.
- Simple text link or arrow.
- Optional small monochrome icon.

```css
.tool-card {
  display: flex;
  min-height: 142px;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.125rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  box-shadow: var(--shadow-soft);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    transform 150ms ease;
}

.tool-card:hover {
  border-color: #aebdb3;
  box-shadow: var(--shadow-card);
  transform: translateY(-1px);
}
```

Avoid making every card visually loud. The user should be able to scan several tools quickly.

***

## 11. Content and Article Sections

Long-form supporting content should use a narrow reading width and strong hierarchy.

### Content Rules

- Use short paragraphs.
- Keep line length between 60 and 80 characters where possible.
- Use descriptive H2 and H3 headings.
- Use tables for reference values.
- Use bullet lists for practical advice.
- Keep important information near the heading it explains.
- Avoid large blocks of centered text.

### Quick Answer Panel

Use a distinct but subtle panel directly below the page introduction.

Recommended style:

- Light green or neutral background.
- Left border in the brand color.
- 15px or 16px text.
- Comfortable padding.
- No decorative illustration.

```css
.quick-answer {
  border-left: 3px solid var(--brand);
  border-radius: var(--radius-sm);
  background: var(--brand-soft);
  padding: 1rem 1.125rem;
  color: var(--text-primary);
}
```

### Reference Tables

Tables should prioritize readability over visual styling.

- White or very light background.
- Clear header row.
- Thin borders.
- Right-align numeric values.
- Use tabular numerals.
- Allow horizontal scrolling on narrow screens.
- Keep the table header visible where practical.

```css
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
}

table {
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
}

th,
td {
  padding: 0.75rem 0.875rem;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

th {
  background: var(--surface-muted);
  color: var(--text-primary);
  font-size: 0.8125rem;
  font-weight: 600;
}

td {
  color: var(--text-secondary);
  font-size: 0.875rem;
}
```

***

## 12. FAQ and Disclosure Components

### FAQ

Use an accessible accordion.

- Question text should be clear and sentence case.
- Use a simple chevron indicator.
- Animate expansion subtly or not at all.
- Do not hide important information only inside animation.
- Keep adequate vertical spacing between questions.

### Disclosures and Notices

Use notices sparingly.

- Informational notice: neutral or light blue-gray.
- Warning: light amber.
- Error: light red.
- Disclaimer: muted text with a visible link.

Avoid red or yellow styling for ordinary explanatory content.

***

## 13. Responsive Behavior

Design mobile-first.

### Breakpoints

```css
/* Small mobile: default */
/* Large mobile / small tablet */
@media (min-width: 480px) {}

/* Tablet */
@media (min-width: 768px) {}

/* Desktop */
@media (min-width: 1024px) {}

/* Wide desktop */
@media (min-width: 1280px) {}
```

### Mobile Requirements

At 360px width:

- No horizontal page scroll.
- Inputs remain fully visible.
- Buttons are easy to tap.
- Text does not overlap.
- Tables scroll inside their own container.
- Header navigation remains usable.
- Result values do not wrap awkwardly.
- Form fields stack logically.
- Cards do not become unnecessarily tall.

Use responsive typography and spacing rather than simply shrinking desktop layouts.

***

## 14. Motion and Interaction

Motion should support orientation and feedback, not attract attention.

### Motion Rules

- Use transitions between 120ms and 180ms.
- Avoid large page transitions.
- Avoid bouncing, pulsing, and looping animations.
- Avoid animated gradients.
- Do not animate calculator results in a way that slows feedback.
- Respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

Use visible focus states and immediate interaction feedback.

***

## 15. Accessibility

The design must meet WCAG AA expectations.

### Requirements

- Maintain at least 4.5:1 contrast for normal text.
- Maintain at least 3:1 contrast for large text and UI boundaries where applicable.
- Use semantic HTML.
- Provide visible labels for all fields.
- Use logical keyboard navigation.
- Provide a strong focus indicator.
- Ensure interactive targets are at least 44px high or wide.
- Use `aria-live="polite"` for updated results.
- Do not rely on color alone for validation or status.
- Ensure all dialogs, menus, tabs, and accordions are keyboard accessible.
- Keep focus behavior predictable when menus or panels open.

```css
:focus-visible {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}
```

***

## 16. Icons and Illustrations

Use icons only when they clarify an action or concept.

Recommended icon style:

- Simple outline icons.
- Consistent stroke width.
- 16px to 20px for controls.
- 24px to 32px for supporting sections.
- Muted brand or neutral color.

Avoid:

- 3D illustrations.
- Cartoon construction workers.
- Stock photography used as decoration.
- AI-generated decorative images.
- Large colorful icon grids.
- Decorative icons beside every paragraph.

For diagrams, use simple inline SVGs with:

- Clear labels.
- Neutral lines.
- One restrained accent color.
- Sufficient contrast.
- Responsive sizing.
- Accessible title or description where needed.

***

## 17. Footer

The footer should be practical and trustworthy.

Include:

- Brand name and short description.
- Calculator categories.
- Important site links.
- Methodology link.
- About and contact links.
- Legal pages.
- Copyright or ownership line.

Use a slightly darker neutral background rather than a dramatic dark theme unless required for contrast.

Suggested footer styling:

```css
.site-footer {
  margin-top: 4rem;
  border-top: 1px solid var(--border);
  background: #eef1ee;
  color: var(--text-secondary);
}

.site-footer a {
  color: var(--text-secondary);
  text-decoration: none;
}

.site-footer a:hover {
  color: var(--brand);
  text-decoration: underline;
}
```

***

## 18. Ads and Reserved Areas

Reserved advertising areas must not disrupt the calculator experience.

- Do not place ads above the calculator on mobile.
- Do not place ads between form inputs and results.
- Use fixed-height reserved containers where ads may later appear.
- Keep empty areas visually quiet.
- Do not show placeholder advertising content during development.
- Ensure reserved areas do not create unexpected layout shifts.

The primary tool interaction should always receive visual priority.

***

## 19. Performance-Oriented Design

The visual system should support fast page loading.

- Use `next/font` for self-hosted fonts.
- Limit font weights.
- Avoid heavy animation libraries.
- Avoid large background images.
- Prefer CSS and inline SVG for visual elements.
- Keep icons lightweight.
- Use optimized WebP or AVIF images only when they provide real value.
- Reserve space for below-the-fold media.
- Avoid third-party UI widgets that add unnecessary JavaScript.
- Keep the initial interface usable before nonessential scripts load.

***

## 20. Design Quality Checklist

Before considering a page complete, verify:

- The page looks professional without gradients or decorative effects.
- The primary calculator is visible quickly.
- The H1 and page purpose are immediately clear.
- The form can be completed comfortably on mobile.
- Every field has a visible label and unit.
- The primary result is visually prominent but restrained.
- Secondary results are easy to scan.
- Buttons have clear priority.
- Focus states are visible.
- Error messages are specific and helpful.
- Tables work on narrow screens.
- Cards and controls use consistent spacing and radius.
- Text contrast meets accessibility requirements.
- No component feels visually louder than the calculator itself.
- The interface still feels coherent with JavaScript disabled or delayed.
- The design feels like a reliable professional utility, not a promotional landing page.

## 21. Core Design Principle

Every visual choice should answer one question:

> Does this help the user understand the tool, enter information, or trust the result?

If it does not, remove it.