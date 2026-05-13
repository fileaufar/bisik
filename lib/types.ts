export type MessageCategory = "admirer" | "barista" | "friend" | "story";

export interface SecretMessage {
  id: string;
  category: MessageCategory;
  content: string;
  initials: string;
  createdAt: string;
}

export const CATEGORY_LABELS: Record<MessageCategory, string> = {
  admirer: "Secret Admirer",
  barista: "Untuk Barista",
  friend: "Untuk Teman",
  story: "Cerita Kecil",
};

export const CATEGORY_EMOJI: Record<MessageCategory, string> = {
  admirer: "🌸",
  barista: "☕",
  friend: "🌿",
  story: "✦",
};

export const CATEGORY_DESC: Record<MessageCategory, string> = {
  admirer: "Perasaan yang selalu tersimpan",
  barista: "Apresiasi untuk yang meracik hari-harimu",
  friend: "Kesan dan pesan yang belum sempat terucap",
  story: "Sepotong cerita yang ingin kamu bagikan",
};
