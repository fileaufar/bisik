import { SecretMessage } from "./types";

const KEY = "bisik_messages";

// ── Dev fallback (in-memory) ──────────────────────────────────────
let devStore: SecretMessage[] = [
  {
    id: "d1",
    category: "admirer",
    content: "Setiap pagi aku selalu berharap bisa melihatmu sebentar saja. Senyummu itu bisa membuat hariku terasa lebih ringan dari apapun.",
    initials: "A.R.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "d2",
    category: "barista",
    content: "Terima kasih sudah selalu ingat pesananku tanpa aku harus bilang. Hal kecil itu sangat berarti bagiku.",
    initials: "D.S.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "d3",
    category: "friend",
    content: "Aku harap kamu tahu betapa berartinya kehadiranmu. Bahkan di hari-hari terberat, aku merasa lebih ringan karena ada kamu.",
    initials: "M.L.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "d4",
    category: "story",
    content: "Kemarin aku duduk sendirian di kafe pojok sambil hujan turun deras. Dan untuk pertama kalinya dalam waktu lama, aku merasa damai.",
    initials: "R.T.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

// ── KV helper ─────────────────────────────────────────────────────
async function getKV() {
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch {
    return null;
  }
}

export async function getAllMessages(): Promise<SecretMessage[]> {
  const kv = await getKV();
  if (kv) {
    const msgs = await kv.lrange<SecretMessage>(KEY, 0, -1);
    return (msgs || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return [...devStore];
}

export async function addMessage(msg: SecretMessage): Promise<void> {
  const kv = await getKV();
  if (kv) {
    await kv.lpush(KEY, msg);
    return;
  }
  devStore.unshift(msg);
}
