# Agentic AI Shopping Assistant (2026 E-commerce Trend)

## Overview
Upgrading the existing `ChatWidget` and `/api/chat` from a standard conversational bot to an **Agentic AI Shopping Assistant**. This agent can understand complex, multi-parameter user intents (e.g., "Carikan bahan sambal dan lauk untuk 3 hari di bawah Rp 150.000"), query the database for matching products, and render actionable UI components directly inside the chat (e.g., "Add All to Cart").

## Architecture & Data Flow

### 1. `api/chat/route.ts` (The Agentic Backend)
- **Function Calling / Structured Output:** We will update the LLM prompt to allow structured JSON responses. If the user's intent is to find/buy products, the LLM will output a specific JSON schema instead of plain text.
- **Intent Parsing:**
  - If it's a general question -> return standard conversational text.
  - If it's a product search/recommendation request -> LLM parses the constraints (budget, category, keywords).
- **Backend Query Execution:** When the LLM outputs a search intent, the backend will immediately query the database using Prisma (`prisma.product.findMany`) with the extracted filters (e.g., `price: { lte: maxPrice }`, `category: { in: categories }`).
- **Response Format:**
  ```typescript
  type ChatResponse = {
    role: "assistant";
    content: string; // The conversational text
    type?: "RECOMMENDATION";
    data?: {
      products: Product[]; // The queried products
      totalPrice: number;
    }
  }
  ```

### 2. `ChatWidget.tsx` (The Agentic UI)
- **Multi-modal Rendering:** If a message has `type: "RECOMMENDATION"`, the widget will render a mini product carousel or list *inside* the chat bubble.
- **One-Click Action:** A prominent button `[ Tambahkan Semua ke Keranjang ]` (Add All to Cart) will appear.
- **State Integration:** Clicking the action button triggers `useCartStore.getState().addItem()` for each recommended product in one batch, then responds automatically in chat: "Produk berhasil ditambahkan ke keranjang!".

## Implementation Plan (Step-by-Step)

### Phase 1: Backend System Prompt & Parsing
- Modify `api/chat/route.ts` to instruct the LLM to output JSON wrapped in a specific tag (e.g., `<agent_action>...</agent_action>`) when a product search is needed, to bypass standard streaming/text constraints.
- *Or* utilize native tool calling / JSON mode if the LLM provider supports it. Since the current code uses raw fetch to an OpenAI-compatible endpoint, we can inject a system prompt that enforces a JSON response format.
- Add Prisma logic inside the route: if JSON action is detected, parse it, query `prisma.product`, attach the results to the response, and send it back to the client.

### Phase 2: UI Component Rendering
- In `ChatWidget.tsx`, update the `msgs` state typing to accept the new `type` and `data` fields.
- Build a sub-component `ProductRecommendationCard` inside the chat bubble to display the `data.products`.
- Add the `handleAutoAddToCart(products)` function which loops over the array and calls `useCartStore.getState().addItem(p)`.

### Phase 3: Polish & Error Handling
- Handle cases where the budget is too low (e.g., "Maaf, dengan budget segitu belum dapat semua, tapi ini yang mendekati...").
- Add loading skeletons inside the chat while the DB query is running.
- Ensure the scrolling behavior (`scrollRef`) accounts for the taller recommendation cards.

## Trade-offs & Decisions
- **LLM Routing:** Doing the DB query *inside* the `/api/chat` route is faster than sending a JSON back to the client and having the client fetch `/api/products`. It saves one network round-trip.
- **Security:** We only query active/approved products. The LLM does not generate raw SQL/Prisma queries; it only outputs filter parameters (maxPrice, keywords, categories) which are safely sanitized before passing to Prisma.
