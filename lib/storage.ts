import { SecretMessage } from "./types";

const KEY = "bisik_messages";

// ── Upstash Redis helper ──────────────────────────────────────────
async function getRedis() {
  try {
    const { Redis } = await import("@upstash/redis");
    return new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } catch {
    return null;
  }
}

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

// ── Public API ────────────────────────────────────────────────────
export async function getAllMessages(): Promise<SecretMessage[]> {
  const redis = await getRedis();
  if (redis) {
    const msgs = await redis.lrange<SecretMessage>(KEY, 0, -1);
    return (msgs || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return [...devStore];
}

export async function addMessage(msg: SecretMessage): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    await redis.lpush(KEY, msg);
    return;
  }
  devStore.unshift(msg);
}
