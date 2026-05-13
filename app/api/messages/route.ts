import { NextRequest, NextResponse } from "next/server";
import { getAllMessages, addMessage } from "@/lib/storage";
import { SecretMessage, MessageCategory } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const messages = await getAllMessages();
    return NextResponse.json({ messages });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil pesan." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { category, content, initials } = await req.json() as {
      category: MessageCategory;
      content: string;
      initials: string;
    };

    const valid: MessageCategory[] = ["admirer", "barista", "friend", "story"];
    if (!valid.includes(category)) return NextResponse.json({ error: "Kategori tidak valid." }, { status: 400 });
    if (!content || content.trim().length < 10) return NextResponse.json({ error: "Pesan terlalu pendek (min 10 karakter)." }, { status: 400 });
    if (content.trim().length > 1000) return NextResponse.json({ error: "Pesan terlalu panjang (maks 1000 karakter)." }, { status: 400 });
    if (!initials || !initials.trim()) return NextResponse.json({ error: "Inisial wajib diisi." }, { status: 400 });

    const msg: SecretMessage = {
      id: uuidv4(),
      category,
      content: content.trim(),
      initials: initials.trim().toUpperCase().replace(/[^A-Z.]/g, "").substring(0, 8) || "—",
      createdAt: new Date().toISOString(),
    };

    await addMessage(msg);
    return NextResponse.json({ success: true, message: msg }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan pesan." }, { status: 500 });
  }
}
