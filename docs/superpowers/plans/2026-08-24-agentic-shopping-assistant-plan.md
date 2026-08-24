# Agentic AI Shopping Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the ChatWidget and `/api/chat` backend into an Agentic AI Shopping Assistant that can parse user intents for product searches (e.g., "bahan sambal < 150rb"), query the DB, render recommendations inline in chat, and add-to-cart with one click.

**Architecture:** The backend `/api/chat` route will enforce structured JSON output from the LLM. If a shopping intent is detected, the backend runs the Prisma DB query and embeds the results in the response. The `ChatWidget` frontend interprets the response type and conditionally renders product cards and a bulk "Add All to Cart" button.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Prisma 7, Zustand (cart state), TailwindCSS, React Icons (existing UI primitives).

**Spec:** `docs/superpowers/specs/2026-08-24-agentic-shopping-assistant-design.md`

## Global Constraints
- Use only existing dependencies ( Prisma, Zustand, Tailwind, etc.). No new packages.
- Follow the established patterns in `src/app/api/chat/route.ts` (raw fetch to OpenAI compitable endpoint) and `src/components/ChatWidget.tsx` (`"use client"`, Zustand, Tailwind).
- Keep UI changes scoped to `ChatWidget.tsx` and new co-located sub-components.
- Ensure DB queries in the backend are safe; LLM only outputs filter parameters (budget, keywords, categories). Never raw SQL from LLM.

---

### Task 1: Update Backend System Prompt for Structured Output

**Files:**
- Modify: `src/app/api/chat/route.ts`

**Interfaces:**
- Consumes: N/A (modifies the prompt string).
- Produces: Updated system prompt text that instructs the LLM on a JSON response format.

- [ ] **Step 1: Update the system prompt string** to append instructions on structured output.
  Add text like: "If the user's request is a shopping recommendation or search task (e.g., finding products under a certain price, listing ingredients), respond with ONLY valid JSON matching this exact schema: {...}. For all other conversational turns, respond in the normal natural language format."

- [ ] **Step 2: Verify the prompt string is correctly placed and readable.**

- [ ] **Step 3: Run the dev server and send a generic greeting to ensure prompt breakage doesn't crash the API.**

- [ ] **Step 4: Commit.**

### Task 2: Add Backend Logic for Intent Parsing and DB Query

**Files:**
- Modify: `src/app/api/chat/route.ts`
- Test: `src/app/api/chat/route.test.ts` (if not exists)

**Interfaces:**
- Consumes: The Prisma `Product` model and its fields (`name`, `price`, `category`, `stock`).
- Produces: A new response shape that includes optional `type` and `data` (products) fields.

- [ ] **Step 1: Define a `ChatResponse` type** in the route file (or a shared `types` file) that supports both conversational messages and `RECOMMENDATION` messages.

- [ ] **Step 2: Write a failing test** that simulates the API receiving a shopping intent and asserts that the response `data.products` array is populated. Use Jest/Vitest with the standard test setup the project uses.

- [ ] **Step 3: Run the test to confirm it fails.**

- [ ] **Step 4: Implement the parsing logic**: After receiving the raw LLM response, check if it matches the shopping-intent JSON schema. If so, extract filter params (maxPrice, keywords, categories) and run `prisma.product.findMany({ where: { category: { in: [...] }, price: { lte: maxPrice }, OR: [{ name: { contains: ... } }, ...] } })`.

- [ ] **Step 5: Run the test to confirm it passes.**

- [ ] **Step 6: Commit.**

### Task 3: Update ChatWidget Message Typing

**Files:**
- Modify: `src/components/ChatWidget.tsx`

**Interfaces:**
- Consumes: The new `ChatResponse` type from the backend.
- Produces: A typed `msgs` array that can hold recommendation data.

- [ ] **Step 1: Update the `msgs` state type** to `Array<{ role: string; content: string; type?: "RECOMMENDATION"; data?: { products: Product[]; totalPrice: number } }>`.

- [ ] **Step 2: Ensure the existing `send` function stores the full response (including `data` and `type` if present).**

- [ ] **Step 3: Commit.**

### Task 4: Render Recommendation Cards in Chat

**Files:**
- Create: `src/components/chat/ProductRecommendationCard.tsx`
- Modify: `src/components/ChatWidget.tsx`

**Interfaces:**
- Consumes: `data.products` from the chat message.
- Produces: A presentational card component and its integration into the chat message list.

- [ ] **Step 1: Scaffold `ProductRecommendationCard.tsx`** — a simple component that accepts a `product` prop and displays image, name, price, and a "[ Add ]" button using `useCartStore`.

- [ ] **Step 2: Render the card inside the assistant's chat bubble** when `m.type === "RECOMMENDATION"`.

- [ ] **Step 3: Commit.**

### Task 5: Add Bulk "Add All to Cart" Action

**Files:**
- Modify: `src/components/ChatWidget.tsx`
- Modify: `src/components/chat/ProductRecommendationCard.tsx` (or inline)

**Interfaces:**
- Consumes: `useCartStore.getState().addItem` to add items.
- Produces: A button handler that adds all recommended products to the cart.

- [ ] **Step 1: Build a `handleAutoAddToCart(products)` utility** that maps over the `products` array and calls `addItem` for each.

- [ ] **Step 2: Render a "[ Tambahkan Semua ke Keranjang ]" button below the product list.**

- [ ] **Step 3: Disable the button if any product is out of stock (use `stock` field).**

- [ ] **Step 4: Commit.**

### Task 6: Polish — Loading, Errors, and Edge Cases

**Files:**
- Modify: `src/app/api/chat/route.ts`
- Modify: `src/components/ChatWidget.tsx`

**Interfaces:**
- Consumes: Backend LLM response parsing, frontend cart store.
- Produces: Improved UX with loading states and helpful fallbacks.

- [ ] **Step 1: Add a loading state** inside the chat bubble while the DB query resolves on the backend (e.g., a shimmer or spinner).

- [ ] **Step 2: Handle budget-too-low gracefully**: If the query returns 0 results, the assistant should respond conversationally, e.g., "Hmm, belum ada produk di bawah RpX. Coba naikkan budget segikit?".

- [ ] **Step 3: Commit and run an end-to-end smoke test** in the browser (log in, ask for a product, verify cards + cart icon update).
