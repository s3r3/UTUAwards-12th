"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18NStore } from "@/lib/i18n";
import { useUIStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";

type RecProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
};

type ChatMsg = {
  role: "user" | "assistant";
  content: string;
  type?: "RECOMMENDATION";
  data?: {
    products: RecProduct[];
    totalPrice: number;
  };
};

const TRANSLATIONS = {
  id: {
    greeting: "Hai! 👋 Aku Ara, asisten Acelora. Ada yang bisa kubantu? Tanya soal produk, pengiriman, atau cara belanja aja.",
    placeholder: "Tanya soal produk...",
    online: "Online",
    assistant: "Ara — Acelora",
    error: "Maaf, koneksi bermasalah. Coba lagi ya.",
  },
  en: {
    greeting: "Hi! 👋 I'm Ara, Acelora assistant. How can I help you today? Ask me about products, shipping, or how to shop.",
    placeholder: "Ask about products...",
    online: "Online",
    assistant: "Ara — Acelora",
    error: "Sorry, connection issue. Please try again.",
  },
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const lang = useI18NStore((s) => s.lang);
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [msgs, loading]);

  function toggleChat() {
    if (open) {
      setOpen(false);
      setMsgs([]);
      return;
    }
    // ponytail: greeting only on open; lang switches while open can wait until a future reopen.
    setMsgs([{ role: "assistant", content: t.greeting }]);
    setOpen(true);
  }

  async function send() {
    if (!input.trim()) return;
    const history = [...msgs, { role: "user" as const, content: input }];
    setMsgs(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      if (data.type === "RECOMMENDATION" && data.data?.products) {
        setMsgs([
          ...history,
          {
            role: "assistant",
            content: data.content || "Berikut rekomendasi produk:",
            type: "RECOMMENDATION",
            data: data.data,
          },
        ]);
      } else {
        setMsgs([...history, { role: "assistant", content: data.content }]);
      }
    } catch {
      setMsgs([...history, { role: "assistant", content: t.error }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {open && (
        <div className={`mb-2 flex h-96 w-80 flex-col overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-200 ${
          isDark ? "border-gray-800 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-850"
        }`}>
          <div className={`flex items-center gap-3 border-b px-4 py-3 ${
            isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"
          }`}>
            <div className={`flex h-9 w-9 items-center justify-center rounded-full text-base ring-1 ${
              isDark ? "bg-gray-800 ring-gray-700" : "bg-primary-50 ring-primary-200"
            }`}>
              🌿
            </div>
            <div>
              <p className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-800"}`}>{t.assistant}</p>
              <p className="flex items-center gap-1 text-xs text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                {t.online}
              </p>
            </div>
          </div>

          <div ref={scrollRef} className={`flex-1 space-y-3 overflow-y-auto px-3 py-3 ${
            isDark ? "bg-gray-950" : "bg-white"
          }`}>
            {msgs.map((m, i) => (
              <div key={i} className={`flex items-end gap-1.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                {m.role === "assistant" ? (
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ring-1 ${
                    isDark ? "bg-gray-800 ring-gray-700" : "bg-primary-50 ring-primary-200"
                  }`}>
                    🌿
                  </div>
                ) : (
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  }`}>
                    🙂
                  </div>
                )}
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm bg-primary-600 px-3 py-1.5 text-left text-sm text-white"
                      : `max-w-[80%] rounded-2xl rounded-bl-sm border px-3 py-1.5 text-left text-sm ${
                          isDark ? "border-gray-800 bg-gray-900 text-gray-200" : "border-gray-200 bg-white text-gray-800"
                        }`
                  }
                >
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  {m.type === "RECOMMENDATION" && m.data?.products && (
                    <div className="mt-2 max-w-[260px] space-y-2">
                      <div className="-mx-1 flex max-h-44 gap-2 overflow-x-auto px-1 pb-1">
                        {m.data.products.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.id}`}
                            onClick={() => setOpen(false)}
                            className={`flex w-24 shrink-0 flex-col overflow-hidden rounded-xl border transition hover:border-primary-500 ${
                              isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                            }`}
                          >
                            <div className="relative aspect-square bg-stone-100">
                              {p.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="p-2">
                              <p className="line-clamp-2 text-[11px] font-medium">{p.name}</p>
                              <p className="mt-1 text-[11px] font-semibold">Rp {p.price.toLocaleString("id-ID")}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          m.data!.products.forEach((p) =>
                            addItem({ productId: p.id, name: p.name, price: p.price, image: p.image, stock: p.stock })
                          );
                          setOpen(false);
                          router.push("/checkout");
                        }}
                        className="w-full rounded-full bg-emerald-950 px-3 py-2 text-center text-xs tracking-widest uppercase text-white hover:bg-emerald-800"
                      >
                        Checkout Semua
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-1.5">
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ring-1 ${
                  isDark ? "bg-gray-800 ring-gray-700" : "bg-primary-50 ring-primary-200"
                }`}>
                  🌿
                </div>
                <span className={`inline-block rounded-2xl rounded-bl-sm border px-3 py-2 ${
                  isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"
                }`}>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.3s]" />
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-2 border-t p-2.5 ${
            isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"
          }`}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t.placeholder}
              className={`flex-1 rounded-full border px-4 py-1.5 text-sm outline-none transition ${
                isDark
                  ? "border-gray-700 bg-gray-800 text-white focus:border-primary-500"
                  : "border-gray-200 bg-white text-gray-800 focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              }`}
            />
            <button
              onClick={send}
              disabled={!input.trim()}
              aria-label="Kirim"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white transition hover:bg-primary-700 disabled:opacity-40"
            >
              ➤
            </button>
          </div>
        </div>
      )}
      <button
        onClick={toggleChat}
        aria-label="Chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-xl text-white shadow-lg transition hover:bg-primary-700 active:scale-95"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}