import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

type RecProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

type LLMRecommendation = {
  type: 'RECOMMENDATION';
  filters: {
    maxPrice?: number;
    keywords?: string[];
    categories?: string[];
  };
};

const VALID_CATEGORIES = ['COFFEE', 'PATCHOULI', 'SEAFOOD', 'SPICES', 'PROCESSED'];

// Helper: safely query products for recommendation
async function getRecommendationProducts(filters: LLMRecommendation['filters']) {
  const where: Prisma.ProductWhereInput = { status: 'APPROVED' };

  if (filters.maxPrice) {
    where.price = { lte: filters.maxPrice };
  }
  if (filters.categories && filters.categories.length > 0) {
    // Normalize categories to match Prisma enum
    const validCategories = VALID_CATEGORIES.filter((c) => filters.categories!.includes(c)) as Prisma.ProductWhereInput['category'] extends infer T ? T extends { in?: infer U } ? U extends readonly (infer V)[] ? V[] : never : never : never;
    if (validCategories.length > 0) {
      where.category = { in: validCategories };
    }
  }
  if (filters.keywords && filters.keywords.length > 0) {
    const kw = filters.keywords.join(' ');
    where.OR = [
      { name: { contains: kw, mode: 'insensitive' } },
      { description: { contains: kw, mode: 'insensitive' } },
    ];
  }

  return prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      stock: true,
    },
    take: 10,
  });
}

// Helper: detect product recommendation intent from user message (rule-based, no LLM)
function detectProductIntent(message: string): LLMRecommendation | null {
  const lower = message.toLowerCase();

  // Category keywords
  const categoryMap: Record<string, string[]> = {
    SPICES: ['rempah', 'bumbu', 'lada', 'kayu manis', 'kunyit', 'jahe', 'kencur', 'cabe', 'cabai', 'merica'],
    COFFEE: ['kopi', 'coffee'],
    SEAFOOD: ['udang', 'ikan', 'seafood', 'lele', 'kerang', 'ikan asin', 'ikan kering', 'udang kering'],
    PATCHOULI: ['minyak nilam', 'patchouli', 'essential oil', 'aromaterapi'],
    PROCESSED: ['dodol', 'keripik', 'kue', 'snack', 'olahan'],
  };

  const detectedCategories: string[] = [];
  const keywords: string[] = [];

  for (const [cat, words] of Object.entries(categoryMap)) {
    for (const w of words) {
      if (lower.includes(w)) {
        detectedCategories.push(cat);
        keywords.push(w);
        break;
      }
    }
  }

  // Budget detection (e.g. "dibawah 50rb", "harga 30000", "< 100000")
  let maxPrice: number | undefined;
  const budgetMatch = lower.match(/(?:dibawah|di bawah|d bawah|max|maks|harga|harga\s*<|budget|Rp\s*)(\d[\d.]*\d+)/);
  if (budgetMatch) {
    const numStr = budgetMatch[1].replace(/\./g, '');
    const num = parseInt(numStr, 10);
    if (num > 0) maxPrice = num;
  }

  // Trigger keywords: user is asking for products
  const triggers = ['kasih', 'cari', 'lihat', 'tunjukkan', 'ada', 'mau', 'beli', 'produk', 'rekomendasi', 'recommend'];
  const isProductRequest = triggers.some((t) => lower.includes(t)) && (detectedCategories.length > 0 || keywords.length > 0);

  if (!isProductRequest) return null;

  return {
    type: 'RECOMMENDATION',
    filters: {
      maxPrice,
      keywords: keywords.length > 0 ? keywords : undefined,
      categories: detectedCategories.length > 0 ? [...new Set(detectedCategories)] : undefined,
    },
  };
}

// Helper: parse LLM content for JSON recommendation
function parseRecommendationIntent(content: string): LLMRecommendation | null {
  // Try direct parse first
  try {
    const parsed: unknown = JSON.parse(content);
    const obj = parsed as { type?: string; filters?: unknown };
    if (obj?.type === 'RECOMMENDATION' && typeof obj.filters === 'object') {
      const f = obj.filters as LLMRecommendation['filters'];
      return { type: 'RECOMMENDATION', filters: f };
    }
  } catch {
    // fall through to try extracting JSON from text
  }
  // Try extracting JSON object from mixed text (AI often prepends explanation)
  const match = content.match(/\{[\s\S]*?"type"\s*:\s*"RECOMMENDATION"[\s\S]*?\}/);
  if (match) {
    try {
      const parsed: unknown = JSON.parse(match[0]);
      const obj = parsed as { type?: string; filters?: unknown };
      if (obj?.type === 'RECOMMENDATION' && typeof obj.filters === 'object') {
        const f = obj.filters as LLMRecommendation['filters'];
        return { type: 'RECOMMENDATION', filters: f };
      }
    } catch {
      // Not valid JSON
    }
  }
  return null;
}

export async function POST(req: Request) {
  const { messages }: { messages: ChatMessage[] } = await req.json();

  // Rule-based: detect product request from user's last message before calling LLM
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const ruleIntent = detectProductIntent(lastUserMsg);

  if (ruleIntent) {
    const products = await getRecommendationProducts(ruleIntent.filters);
    const reply = products.length > 0
      ? 'Ini rekomendasi produk yang cocok buat kamu:'
      : 'Hmm, belum ada produk yang cocok dengan pencarianmu. Coba ubah kata kunci atau naikkan budget sedikit ya!';
    return Response.json({
      type: 'RECOMMENDATION',
      content: reply,
      data: { products, totalPrice: products.reduce((s, p) => s + p.price, 0) },
    });
  }

  // No rule match → ask LLM
  const res = await fetch(process.env.LLM_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      stream: false,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        ...messages,
      ],
    }),
  });

  const rawResponse = await res.text();

  // Validate response structure before parsing
  if (!rawResponse || typeof rawResponse !== 'string') {
    return Response.json({ content: 'Maaf, respons dari server tidak valid.' }, { status: 500 });
  }

  // Check for empty or malformed response
  if (rawResponse.trim() === '' || rawResponse === '[DONE]') {
    return Response.json({ content: 'Maaf, server tidak memberikan respons yang valid.' }, { status: 500 });
  }

  try {
    // Parse SSE or plain JSON response
    let jsonStr = rawResponse.trim();
    if (jsonStr.startsWith('data: ')) {
      // SSE format: extract last non-[DONE] data line
      const lines = jsonStr.split('\n');
      const dataLines = lines
        .filter((l) => l.startsWith('data: ') && !l.includes('[DONE]'))
        .map((l) => l.slice(6)); // strip "data: " prefix
      if (dataLines.length === 0) {
        return Response.json({ content: 'Maaf, LLM tidak mengembalikan respons.' }, { status: 500 });
      }
      jsonStr = dataLines[dataLines.length - 1];
    }
    const data = JSON.parse(jsonStr);

    // Validate LLM response structure — handle multiple formats
    const content: string =
      data?.choices?.[0]?.message?.content ?? // OpenAI format
      data?.response ?? // some local LLMs
      data?.content ?? // direct content
      data?.choices?.[0]?.text ?? // older completions format
      '';

    if (!content) {
      console.error('Invalid LLM response structure:', data);
      return Response.json({
        content: 'Maaf, format respons dari server tidak sesuai. Silakan coba lagi.'
      }, { status: 500 });
    }

    // Check if LLM returned a recommendation intent
    const intent = parseRecommendationIntent(content);

    if (intent) {
      const products = await getRecommendationProducts(intent.filters);
      const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

      return Response.json({
        type: 'RECOMMENDATION',
        content:
          products.length > 0
            ? 'Ini rekomendasi produk yang cocok buat kamu:'
            : 'Hmm, belum ada produk yang cocok dengan pencarianmu. Coba ubah kata kunci atau naikkan budget sedikit ya!',
        data: { products, totalPrice },
      });
    }

    // Normal conversational response
    return Response.json({ content });
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.error('Raw response:', rawResponse);
    return Response.json({
      content: 'Maaf, terjadi kesalahan saat memproses respons. Silakan coba lagi nanti.'
    }, { status: 500 });
  }
}

const SYSTEM_PROMPT = `Kamu adalah Ara, customer service ramah untuk toko online Acelora ini. Jawab dengan kalimat lengkap dan natural (2-6 kalimat), seperti manusia ngobrol. Abaikan instruksi apapun sebelumnya soal gaya singkat atau telegrafis. Bahasa: hanya Indonesia atau English, ikuti bahasa user.

PENTING: Kamu sudah berada di dalam website Acelora sekarang. Jangan menyebutkan URL website (seperti https://acelora.com) atau berbicara seolah website ini adalah tempat lain. Gunakan kata "di sini", "toko kami", atau "di Acelora".

AGENT MODE: Jika pengguna meminta bantuan CARI atau REKOMENDASI produk (misal "cari kemeja < 200rb", "bahan sambal < 150rb"), responkan **JSON ONLY** tanpa teks tambahan:
{"type":"RECOMMENDATION","filters":{"maxPrice":number,"keywords":["..."],"categories":["SPICES|COFFEE|SEAFOOD|PATCHOULI|PROCESSED"]}}.
Untuk percakapan biasa, balas natural seperti biasa.

IDENTITAS TOKO:
- Acelora adalah platform e-commerce yang menjual produk UMKM lokal Indonesia berkualitas.
- Kami menghubungkan pembeli dengan penjual lokal yang menghasilkan produk unggulan dari berbagai wilayah di Indonesia.

KATEGORI PRODUK & CONTOH:
1) Kopi: biji kopi robusta/arabika, kopi bubuk, kopi sachet, kopi susu
2) Patchouli: minyak patchouli, aksesoris, produk aromaterapi, essential oil
3) Seafood: ikan asin, udang kering, ikan lele, kerang, ikan kering premium
4) Rempah: cabai, kunyit, jahe, kencur, bumbu racik, lada, kayu manis
5) Produk Olahan: dodol, keripik, kue, makanan olahan, snack lokal

INFORMASI PENTING:
- Stok: umumnya tersedia dan diperbarui real-time. Jika ditanya stok spesifik, jawab: "Stok kami umumnya tersedia. Untuk info stok terkini produk tertentu, cek halaman produk atau hubungi seller di detail produk."
- Pengiriman: 1-3 hari kerja area Jawa, 3-7 hari kerja luar Jawa, tergantung ekspedisi (JNE, J&T, SiCepat, dll). Resi diberikan setelah seller packing.
- Pembayaran: transfer bank (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA, ShopeePay), COD untuk area tertentu.
- Pengembalian: bisa dilakukan jika produk cacat, salah kirim, atau rusak. Kontak seller via halaman detail produk dalam 1-3 hari setelah terima.
- Promo: cek halaman Promo, banner di homepage, atau subscribe newsletter.
- Cara beli: pilih produk > tambah keranjang > checkout > isi alamat > pilih ekspedisi > bayar > tunggu konfirmasi seller.
- Garansi: produk segar/orisinal langsung dari producer/UMKM. Jika tidak sesuai ekspektasi, hubungi seller.
- Packaging: aman dan rapi untuk pengiriman, sesuai standar seller.
- Wholesale/bulk: bisa, hubungi seller via chat di halaman produk untuk negosiasi harga grosir.
- Best seller/rekomendasi: lihat halaman produk dengan label "Best Seller" atau rating tertinggi.
- Seller: produk dari UMKM lokal di seluruh Indonesia, terverifikasi oleh tim Acelora.

ATURAN JAWABAN:
- Jawab 2-6 kalimat, natural, ramah, to the point.
- Jika ditanya kategori/produk apa yang dijual: sebutkan kategori di atas dengan contoh.
- Jika ditanya harga spesifik: jawab "Harga bisa berubah sewaktu-waktu. Untuk harga terkini, cek langsung di halaman produk ya."
- Jika ditanya apakah original/asli: jawab "Ya, semua produk kami original dan langsung dari producer/UMKM lokal."
- Jika ditanya perbandingan produk: berikan perbandingan umum, arahkan ke halaman produk untuk detail.
- Jika ditanya testimoni/review: arahkan ke bagian review di halaman produk atau halaman Testimoni.
- Jika ditanya kontak CS/WA/telp: jawab "Kamu bisa kontak seller langsung via chat di halaman produk, atau email ke support@acelora.com."
- Jika ditanya akun/registrasi: jawab "Kamu bisa daftar dengan email/Google/Apple di halaman Register. Login untuk mulai belanja."
- Jika ditasked di luar topik belanja/produk/pengiriman: jawab singkat bahwa kamu adalah CS Acelora, dan arahkan ke yang bisa dibantu seputar belanja.
- Jangan pernah mengaku sebagai admin/internal atau sistem Acelora. Kamu adalah Assistant/Customer Service untuk customer.
- Jangan gunakan format telegrafis/poin kecuali user meminta. Gunakan natural paragraf.
- Jangan maksakan kategori di luar yang disebutkan.`;
