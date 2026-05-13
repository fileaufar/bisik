"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SecretMessage, MessageCategory, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/types";

// ── CSV Export ────────────────────────────────────────────────────
function formatDate(d: string) {
  return new Date(d).toLocaleString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function exportCSV(messages: SecretMessage[]) {
  const header = ["ID", "Kategori", "Pesan", "Inisial", "Waktu"];
  const rows   = messages.map(m => [
    m.id,
    CATEGORY_LABELS[m.category],
    `"${m.content.replace(/"/g, '""')}"`,
    m.initials,
    formatDate(m.createdAt),
  ]);
  const csv  = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `bisik-admin-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Helpers ───────────────────────────────────────────────────────
function ago(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1)  return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

type Filter = "all" | MessageCategory;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",     label: "Semua" },
  { id: "admirer", label: "Admirer" },
  { id: "barista", label: "Barista" },
  { id: "friend",  label: "Teman" },
  { id: "story",   label: "Cerita" },
];

// ── Component ─────────────────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword]   = useState("");
  const [authed, setAuthed]       = useState(false);
  const [authErr, setAuthErr]     = useState("");
  const [msgs, setMsgs]           = useState<SecretMessage[]>([]);
  const [loading, setLoad]        = useState(false);
  const [filter, setFilter]       = useState<Filter>("all");
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [exporting, setExp]       = useState(false);
  const [toast, setToast]         = useState("");

  // ── Load pesan setelah login ──
  async function loadMessages(pass: string) {
    setLoad(true);
    try {
      const res  = await fetch("/api/messages");
      const data = await res.json();
      setMsgs(data.messages || []);
    } catch {
      showToast("Gagal memuat pesan.");
    } finally {
      setLoad(false);
    }
  }

  // ── Login ──
  async function handleLogin() {
    setAuthErr("");
    if (!password.trim()) { setAuthErr("Masukkan password."); return; }
    // Verifikasi dengan mencoba akses API delete (dry-run)
    const res = await fetch("/api/messages/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id: "__check__" }),
    });
    if (res.status === 401) { setAuthErr("Password salah."); return; }
    // 404 = password benar tapi ID tidak ada — itu berarti autentikasi berhasil
    setAuthed(true);
    loadMessages(password);
  }

  // ── Delete ──
  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch("/api/messages/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-password": password },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) { showToast("Gagal menghapus."); return; }
      setMsgs(prev => prev.filter(m => m.id !== id));
      showToast("Pesan berhasil dihapus.");
    } catch {
      showToast("Gagal menghapus pesan.");
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  }

  // ── Export ──
  async function handleExport() {
    setExp(true);
    try {
      const res  = await fetch("/api/messages");
      const data = await res.json();
      exportCSV(data.messages || []);
      showToast("CSV berhasil didownload!");
    } catch {
      showToast("Gagal export.");
    } finally {
      setExp(false);
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const shown = filter === "all" ? msgs : msgs.filter(m => m.category === filter);

  // ── LOGIN SCREEN ──────────────────────────────────────────────
  if (!authed) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "360px", display: "flex", flexDirection: "column", gap: "28px" }}>

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "1.6rem" }}>🔒</span>
          <h1 className="title" style={{ fontSize: "1.8rem", color: "var(--forest)" }}>
            <em>Admin</em> <span>bisik</span>
          </h1>
          <p style={{ fontFamily: "var(--ff)", fontSize: "0.82rem", color: "var(--mist)" }}>
            Halaman ini hanya untuk pengelola.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <span className="label">Password</span>
            <input
              className="input"
              type="password"
              placeholder="Masukkan password admin"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
          {authErr && <p style={{ fontFamily: "var(--ff)", fontSize: "0.82rem", color: "var(--bark)" }}>{authErr}</p>}
          <button onClick={handleLogin} className="btn btn-primary" style={{ width: "100%", marginTop: "4px" }}>
            Masuk
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ fontFamily: "var(--ff)", fontSize: "0.75rem", color: "var(--mist)", textDecoration: "none" }}>
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </main>
  );

  // ── ADMIN DASHBOARD ───────────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: "var(--forest)", color: "var(--cream)", fontFamily: "var(--ff)",
          fontSize: "0.82rem", padding: "10px 20px", borderRadius: "100px",
          zIndex: 9999, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}>
          {toast}
        </div>
      )}

      {/* NAV */}
      <nav className="nav">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" className="nav-logo">bisik</Link>
          <span style={{ fontFamily: "var(--ff)", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--mist)", paddingLeft: "12px", borderLeft: "1px solid rgba(33,59,42,0.15)" }}>Admin</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={handleExport}
            disabled={exporting || msgs.length === 0}
            style={{
              fontFamily: "var(--ff)", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "7px 16px", borderRadius: "100px", cursor: "pointer", transition: "all 200ms ease",
              border: "1.5px solid rgba(33,59,42,0.2)", background: "transparent", color: "var(--forest)",
              display: "flex", alignItems: "center", gap: "6px",
              opacity: (exporting || msgs.length === 0) ? 0.4 : 1,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {exporting ? "Mengexport..." : "Export CSV"}
          </button>
          <button
            onClick={() => { setAuthed(false); setPassword(""); setMsgs([]); }}
            style={{
              fontFamily: "var(--ff)", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "7px 16px", borderRadius: "100px", cursor: "pointer",
              border: "1.5px solid rgba(33,59,42,0.15)", background: "transparent", color: "var(--mist)",
            }}
          >Keluar</button>
        </div>
      </nav>

      <div className="page" style={{ maxWidth: "720px" }}>

        {/* HEADER */}
        <div className="fu" style={{ marginBottom: "36px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <h1 className="title" style={{ fontSize: "2rem", color: "var(--forest)" }}>
            <em>Kelola</em> <span>Pesan</span>
          </h1>
          <p style={{ fontFamily: "var(--ff)", fontSize: "0.82rem", color: "var(--mist)" }}>
            {msgs.length} pesan tersimpan · klik hapus untuk menghapus pesan
          </p>
        </div>

        {/* INFO EXPORT */}
        <div style={{ marginBottom: "28px", padding: "13px 16px", background: "rgba(33,59,42,0.03)", border: "1px solid rgba(33,59,42,0.08)", borderRadius: "var(--r-md)" }}>
          <p style={{ fontFamily: "var(--ff)", fontSize: "0.76rem", color: "var(--mist)", lineHeight: 1.75 }}>
            <strong style={{ color: "var(--forest)", fontWeight: 500 }}>Import ke Google Sheets:</strong>
            {" "}Klik Export CSV di kanan atas → buka{" "}
            <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" style={{ color: "var(--bark)" }}>sheets.new</a>
            {" "}→ <strong style={{ fontWeight: 500 }}>File → Import → Upload</strong> → pilih file CSV.
          </p>
        </div>

        {/* FILTER */}
        <div className="fu1" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                fontFamily: "var(--ff)", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "6px 16px", borderRadius: "100px", cursor: "pointer", transition: "all 200ms ease",
                border: `1.5px solid ${filter === f.id ? "var(--forest)" : "rgba(33,59,42,0.15)"}`,
                background: filter === f.id ? "var(--forest)" : "transparent",
                color: filter === f.id ? "var(--cream)" : "var(--mist)",
              }}
            >{f.label}</button>
          ))}
        </div>

        <p className="muted" style={{ marginBottom: "24px" }}>
          {loading ? "Memuat..." : `Menampilkan ${shown.length} pesan`}
        </p>

        {/* MESSAGES */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[1, 2, 3].map(i => <div key={i} className="card" style={{ height: "120px", opacity: 0.3 }} />)}
          </div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <p style={{ fontFamily: "var(--fp)", fontStyle: "italic", color: "var(--mist)" }}>Tidak ada pesan.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {shown.map((msg, i) => (
              <article key={msg.id} className="card fu" style={{ padding: "22px 24px", animationDelay: `${i * 0.03}s`, opacity: 0, position: "relative" }}>

                {/* top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{CATEGORY_EMOJI[msg.category]}</span>
                    <span className={`badge badge-${msg.category}`}>{CATEGORY_LABELS[msg.category]}</span>
                  </div>
                  <span className="muted">{ago(msg.createdAt)}</span>
                </div>

                {/* content */}
                <p style={{ fontFamily: "var(--ff)", fontSize: "0.93rem", color: "var(--forest)", lineHeight: 1.78, marginBottom: "16px" }}>
                  {msg.content}
                </p>

                <div className="sep" />

                {/* bottom row: inisial + hapus */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                  <span style={{ fontFamily: "var(--fp)", fontStyle: "italic", fontSize: "0.88rem", color: "var(--bark)" }}>
                    — {msg.initials}
                  </span>

                  {/* confirm delete */}
                  {confirmId === msg.id ? (
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--ff)", fontSize: "0.72rem", color: "var(--mist)" }}>Yakin hapus?</span>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        disabled={deleting === msg.id}
                        style={{
                          fontFamily: "var(--ff)", fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase",
                          padding: "4px 12px", borderRadius: "4px", cursor: "pointer",
                          background: "var(--bark)", color: "var(--cream)", border: "none",
                          opacity: deleting === msg.id ? 0.5 : 1,
                        }}
                      >{deleting === msg.id ? "..." : "Hapus"}</button>
                      <button
                        onClick={() => setConfirmId(null)}
                        style={{
                          fontFamily: "var(--ff)", fontSize: "0.68rem", letterSpacing: "0.06em", textTransform: "uppercase",
                          padding: "4px 12px", borderRadius: "4px", cursor: "pointer",
                          background: "transparent", color: "var(--mist)", border: "1px solid rgba(33,59,42,0.15)",
                        }}
                      >Batal</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(msg.id)}
                      style={{
                        fontFamily: "var(--ff)", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase",
                        padding: "4px 12px", borderRadius: "4px", cursor: "pointer", transition: "all 200ms ease",
                        background: "transparent", color: "var(--mist)", border: "1px solid rgba(33,59,42,0.12)",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--bark)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(74,38,25,0.3)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--mist)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(33,59,42,0.12)"; }}
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <footer className="footer" style={{ marginTop: "60px" }}>
        bisik admin · {msgs.length} pesan total
      </footer>
    </main>
  );
}
