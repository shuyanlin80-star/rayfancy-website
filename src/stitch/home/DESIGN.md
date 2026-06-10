---
name: Heritage Electric
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#464741'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#777770'
  outline-variant: '#c7c7be'
  surface-tint: '#5e5f58'
  primary: '#1c1d18'
  on-primary: '#ffffff'
  primary-container: '#31322c'
  on-primary-container: '#9a9a92'
  inverse-primary: '#c7c7be'
  secondary: '#51606f'
  on-secondary: '#ffffff'
  secondary-container: '#d4e4f6'
  on-secondary-container: '#576675'
  tertiary: '#261b01'
  on-tertiary: '#ffffff'
  tertiary-container: '#3c3011'
  on-tertiary-container: '#aa9770'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e3da'
  primary-fixed-dim: '#c7c7be'
  on-primary-fixed: '#1b1c17'
  on-primary-fixed-variant: '#464741'
  secondary-fixed: '#d4e4f6'
  secondary-fixed-dim: '#b9c8da'
  on-secondary-fixed: '#0d1d2a'
  on-secondary-fixed-variant: '#394857'
  tertiary-fixed: '#f6e0b4'
  tertiary-fixed-dim: '#d9c49a'
  on-tertiary-fixed: '#251a01'
  on-tertiary-fixed-variant: '#534525'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  slate-gray: '#536271'
  heritage-gold: '#B5A27A'
  obsidian-black: '#000000'
  off-white: '#F9F9F8'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system is built on the intersection of industrial reliability and editorial elegance. It serves a demographic that values longevity and tactile quality over fleeting tech trends. The brand personality is authoritative yet understated, mirroring the silent utility of high-end hardware.

The design style is **Minimalism** with a **Tactile** influence. It prioritizes expansive whitespace, precise alignment, and high-fidelity product photography. Rather than using digital-first metaphors like glow or transparency, the UI mimics physical materials—smooth matte surfaces, crisp structural lines, and intentional depth that suggests the weight and finish of premium metal and polycarbonate components.

## Colors

The palette is rooted in architectural neutrals. **Primary Charcoal (#31322C)** provides a softer, more sophisticated alternative to pure black for text and structural elements, while **Heritage Gold (#B5A27A)** is introduced as a tertiary accent to signify premium craftsmanship and metallic finishes (brass, bronze).

**Secondary Slate (#536271)** is reserved for secondary information and subtle borders, maintaining a cool, professional tone. The primary background is a clean, bright **White (#FFFFFF)** to allow product photography to serve as the main visual driver. Use **Heritage Gold** sparingly—only for calls to action, quality seals, or specific highlight states—to maintain its perceived value.

## Typography

The typographic hierarchy balances the geometric strength of **Montserrat** with the functional clarity of **Open Sans**. Headlines use Montserrat to project a sense of structural integrity and modern luxury. Large display sizes should utilize tighter letter-spacing to appear more cohesive and impactful.

**Open Sans** is used for all body copy and technical specifications to ensure maximum readability. For product categories or metadata, **Label-Caps** provides a distinctive "industrial stamp" look, reinforcing the heritage manufacturing theme. Line heights are kept generous to maintain the open, premium feel of the layout.

## Layout & Spacing

This design system utilizes a **12-column fixed grid** for desktop and a **4-column fluid grid** for mobile. The layout is defined by dramatic vertical rhythm; section gaps of 120px create a sense of scale and exclusivity, preventing the UI from feeling cluttered.

Content should be centered within a 1280px container to ensure a consistent reading experience on wide monitors. Use asymmetrical layouts where product imagery occupies 6-8 columns and text occupies 4 columns to create visual interest and mimic high-end architectural magazines. Spacing between related elements (e.g., a heading and its description) should follow an 8px base grid for strict alignment.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** and **Ambient Shadows**. Instead of floating elements, depth is used to suggest "inset" or "extruded" surfaces, much like a switch plate on a wall.

- **Level 1 (Surface):** Default background (#FFFFFF).
- **Level 2 (Inlay):** Subtle containers use #F9F9F8 with a 1px solid stroke in #536271 at 10% opacity.
- **Level 3 (Tactile):** Product cards use a soft, large-radius shadow (Blur: 40px, Y: 20px, Color: #31322C at 5% opacity) to suggest they are sitting just above the surface.

Avoid heavy "smart home" blurs or vibrant gradients. Shadows must remain neutral and diffuse to maintain the professional, understated aesthetic.

## Shapes

The shape language is primarily **Soft (0.25rem)**, reflecting the precision-machined edges of premium hardware. While the design is modern, it avoids the overly rounded "bubbliness" of consumer apps. 

- **Primary Elements:** Buttons and input fields use a 4px corner radius.
- **Containers:** Large product cards or imagery blocks can use up to 8px (rounded-lg) for a more approachable feel.
- **Iconography:** Use 2px stroke weights with squared-off ends to mirror the mechanical nature of electrical components.

## Components

### Buttons
Primary buttons are solid **Obsidian Black** or **Heritage Gold** with white Montserrat Bold text in all-caps. Secondary buttons use a 1px slate-gray stroke with no fill. The "tactile feel" is achieved through a subtle shift in background color on hover, rather than a size change.

### Cards
Product cards are minimal, featuring high-resolution photography on an off-white background. No visible borders are used; instead, the card's boundary is defined by the image and a very soft ambient shadow on hover.

### Input Fields
Fields are represented by a single bottom-border (2px solid) rather than a full box, creating a cleaner, architectural look. Labels are placed above the field in **Label-Caps** styling.

### Lists & Specs
Technical specifications for switches and sockets are displayed in a clean, two-column list with a light horizontal divider (1px #536271 at 10% opacity) between rows. Use **Label-MD** for keys and **Body-MD** for values.

### Chips
Used for material finishes (e.g., "Brushed Brass", "Matte Black"). These are small circles containing the actual material texture or a representative hex code, paired with a small text label.