## Overview

Bold and energetic with a sophisticated technical edge. The design balances vibrant gradient illustrations with clean, minimal typography and generous whitespace. The personality is confident and modern, appealing to tech-savvy professionals while remaining approachable. The density is spacious and breathable, with a tone that's both professional and innovative.

Centered layout with a maximum width constraint (1280px). Generous section spacing using clamp() functions for responsive scaling. The hero section dominates the viewport with large typography and illustration. Grid systems appear minimal, favoring centered single-column layouts with ample breathing room.

Uses a 8px base grid with scale: 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10.

## Colors

### Light Theme
- **Manila** (#f3e6c4): Primary background color, warm cream tone
- **Stone** (#9a958a): Secondary text and muted elements
- **Bond White** (#ffffff): Surface backgrounds and cards
- **Charcoal** (#141413): Primary text color, deep dark
- **Success Green** (#22c55e): Success states and positive actions
- **Warning Orange** (#f59e0b): Warning states and attention

### Dark Theme
- **Charcoal** (#141413): Primary dark background
- **Manila** (#f3e6c4): Primary text on dark backgrounds
- **Stone** (#9a958a): Secondary text and muted elements
- **Dark Surface** (#2f2c28): Elevated surfaces and cards
- **Success Green** (#22c55e): Success states and CTAs
- **Light Green** (#86efac): Lighter success variant

## Typography
- **Headline Font**: Inter Tight
- **Body Font**: Inter
- **Label Font**: Inter Tight
- **Code Font**: JetBrains Mono

The typography hierarchy uses Inter Tight for headings with tight letter-spacing (-1.344px) and Inter for body text. Weight conventions follow a clear pattern: 600 for headings, 500 for emphasized text, and 400 for regular body copy. The size relationships create strong contrast between the large 44.8px hero text and 16px body text. JetBrains Mono provides technical credibility for code elements. Line-height ratios are generous (1.55x for body text) ensuring excellent readability.

## Elevation

The design uses subtle shadows sparingly, primarily for interactive elements like buttons (rgba(34, 197, 94, 0.8) glows). Depth is mainly created through color contrast between dark backgrounds and light text, rather than heavy shadow work. The gradient illustrations add visual depth through color transitions rather than traditional elevation techniques.

## Components
- **Gradient Hero Illustration**: Vibrant gradient pill shapes arranged in a flowing pattern, creating visual interest and brand identity
- **Pill Buttons**: Rounded buttons with pill-shaped corners (9999px radius) for primary actions
- **Dark Navigation**: Minimal top navigation with logo, links, and star count badge on dark background
- **Centered Hero Layout**: Large centered content area with illustration, heading, description, and action buttons
- **Theme Toggle**: Light/dark mode toggle control in the interface

## Do's and Don'ts
- Do use the manila cream (#f3e6c4) as the primary light background to maintain brand warmth
- Don't mix border radius values - stick to the defined system (4px, 8px, 12px, pill)
- Do maintain high contrast between text and backgrounds, especially in dark mode
- Don't use gradients outside of illustrations - keep UI elements solid colored
- Do use Inter Tight for headings and Inter for body text consistently
- Don't exceed the maximum width constraint of 1280px for main content
- Do use generous spacing with the clamp() functions for responsive design
- Don't use heavy shadows - prefer subtle glows for interactive states only
