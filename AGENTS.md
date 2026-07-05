<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# AGENTS.md - Next.js Production Standards

This project uses Next.js (App Router) in a production environment. The agent must prioritize correctness, maintainability, and performance.

## Core Principles
- Stability > speed of implementation.
- Prefer minimal, incremental changes.
- Do not introduce unnecessary complexity.
- Maintain compatibility with existing architecture.

## Framework Rules
- Use App Router exclusively.
- Prefer Server Components by default.
- Use Client Components only when necessary ("use client").
- Avoid mixing server/client logic incorrectly.

## Data Fetching
- Prefer server-side data fetching (Server Components, Route Handlers).
- Avoid unnecessary client-side fetching unless required for interactivity.
- Use caching strategies appropriately (fetch caching, revalidation).

## Code Quality
- Use TypeScript where applicable.
- Follow existing project structure strictly.
- Do not refactor unrelated code.
- Keep functions small and single-purpose.

## Dependencies
- Do not add new dependencies without clear justification.
- Prefer built-in Next.js features before external libraries.

## Performance
- Optimize for Core Web Vitals (LCP, CLS, INP).
- Avoid unnecessary re-renders and client bundle bloat.
- Use dynamic imports for heavy components when needed.

## Routing & Structure
- Do not modify routing structure without instruction.
- Keep route organization consistent with existing patterns.

## Safety Rules
- Do not modify `package.json` without confirmation.
- Do not break public API contracts or existing endpoints.
- Ensure backward compatibility.

## Testing & Validation
- Ensure build passes before completion.
- Run lint/typecheck if available.
- Verify no runtime errors introduced.

## Completion Criteria
- No build errors.
- No lint violations.
- No regressions introduced.

# AGENTS.md - Modern Parallax (General Web Standards)

This project may use parallax and scroll-based animations. The goal is to enhance user experience while maintaining performance, accessibility, and readability.

## Core Principle
- Parallax is a subtle enhancement, not a primary feature.
- Content clarity and usability always come first.
- Motion should support user understanding, not distract from it.

## Animation Rules
- Use transform and opacity only (translate, scale, rotate).
- Avoid animating layout properties (top, left, width, height).
- Do not use raw scroll event listeners for animations.
- Prefer established animation libraries (e.g. GSAP, Framer Motion).

## Parallax Guidelines
- Keep movement subtle and controlled.
- Use relative speed differences between layers.
- Limit number of moving layers to avoid visual noise.
- Ensure motion feels consistent across the page.

## Scroll Behavior
- Do not block or override native scrolling behavior.
- Avoid scroll-jacking unless explicitly required.
- Optional smooth scrolling must not interfere with accessibility.

## Performance Rules
- Maintain 60fps performance target.
- Use GPU-accelerated properties (transform/opacity).
- Avoid layout reflow during animations.
- Lazy-load heavy assets when possible.

## Accessibility Considerations
- Respect user preference for reduced motion (prefers-reduced-motion).
- Ensure content remains readable during animation.
- Do not rely on motion alone to convey information.

## Structure Guidelines
- Keep animation logic modular and component-based.
- Each UI section should manage its own animation scope.
- Avoid global scroll state coupling.

## Completion Criteria
- Smooth scrolling experience with no jank.
- No layout shifts caused by animations.
- Consistent behavior across devices and screen sizes.

<!-- END:nextjs-agent-rules -->