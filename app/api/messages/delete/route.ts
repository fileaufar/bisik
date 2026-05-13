import { NextRequest, NextResponse } from "next/server";
import { getAllMessages, saveAllMessages } from "@/lib/storage";

export async function DELETE(req: NextRequest) {
  try {
    // Cek admin password dari header
    const adminPass = req.headers.get("x-admin-password");
    if (adminPass !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await req.json() as { id: string };
    if (!id) return NextResponse.json({ error: "ID tidak ditemukan." }, { status: 400 });

    const all     = await getAllMessages();
    const updated = all.filter(m => m.id !== id);

    if (updated.length === all.length) {
      return NextResponse.json({ error: "Pesan tidak ditemukan." }, { status: 404 });
    }

    await saveAllMessages(updated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus pesan." }, { status: 500 });
  }
}
