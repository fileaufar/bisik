"use client";
import Link from "next/link";
import { useState } from "react";
import { MessageCategory, CATEGORY_LABELS, CATEGORY_EMOJI, CATEGORY_DESC } from "@/lib/types";

const CATS: MessageCategory[] = ["admirer", "barista", "friend", "story"];

export default function Compose() {
  const [cat, setCat]         = useState<MessageCategory | "">("");
  const [content, setContent] = useState("");
  const [initials, setInit]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  async function send() {
    setError("");
    if (!cat)                        { setError("Pilih kategori dulu."); return; }
    if (content.trim().length < 10)  { setError("Pesan terlalu pendek (min 10 karakter)."); return; }
    if (!initials.trim())            { setError("Tulis inisialmu ya."); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category: cat, content, initials }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Gagal mengirim."); return; }
      setDone(true);
    } catch { setError("Koneksi bermasalah. Coba lagi."); }
    finally { setLoading(false); }
  }

  /* ── SUCCESS STATE ── */
  if (done) return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "22px", alignItems: "center" }}>
        <span style={{ fontSize: "2.2rem" }}>✉️</span>
        <h2 className="title" style={{ fontSize: "2rem", color: "var(--forest)" }}>
          <em>Pesanmu</em> <span>tersampaikan</span>
        </h2>
        <p style={{ fontFamily: "var(--ff)", color: "var(--mist)", lineHeight: 1.75, fontSize: "0.92rem" }}>
          Diam-diam namun tulus. Pesanmu kini ada di antara bisikan-bisikan lainnya.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => { setDone(false); setCat(""); setContent(""); setInit(""); }} className="btn btn-outline">Tulis Lagi</button>
          <Link href="/dashboard" className="btn btn-primary">Lihat Semua Pesan</Link>
        </div>
      </div>
    </main>
  );

  /* ── FORM ── */
  return (
    <main style={{ minHeight: "100vh" }}>

      <nav className="nav">
        <Link href="/" className="nav-logo">bisik</Link>
        <Link href="/dashboard" style={{ fontFamily: "var(--ff)", fontSize: "0.75rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--mist)", textDecoration: "none" }}>Lihat Pesan</Link>
      </nav>

      <div className="page" style={{ maxWidth: "580px" }}>

        {/* header */}
        <div className="fu" style={{ marginBottom: "48px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontFamily: "var(--ff)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mist)" }}>Tulis Pesanmu</span>
          <h1 className="title" style={{ fontSize: "2.2rem", color: "var(--forest)", lineHeight: 1.18 }}>
            <em>Apa yang ingin</em><br /><span>kamu bisikkan?</span>
          </h1>
        </div>

        {/* STEP 1 — kategori */}
        <div className="fu1" style={{ marginBottom: "36px" }}>
          <span className="label">01 — Pilih kategori</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`cat-card ${cat === c ? "active" : ""}`}>
                <span style={{ fontSize: "1.1rem" }}>{CATEGORY_EMOJI[c]}</span>
                <span className="cat-label">{CATEGORY_LABELS[c]}</span>
                <span className="cat-desc">{CATEGORY_DESC[c]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2 — isi pesan */}
        <div className="fu2" style={{ marginBottom: "36px" }}>
          <span className="label">02 — Tuliskan pesanmu</span>
          <textarea
            className="textarea"
            placeholder="Tulis apa yang selama ini tersimpan di dalam hatimu..."
            value={content}
            onChange={e => setContent(e.target.value.slice(0, 1000))}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
            <span className="muted" style={{ color: content.length > 900 ? "var(--bark)" : undefined }}>{content.length} / 1000</span>
          </div>
        </div>

        {/* STEP 3 — inisial */}
        <div className="fu3" style={{ marginBottom: "40px" }}>
          <span className="label">03 — Inisialmu (hanya ini yang terlihat)</span>
          <input className="input" type="text" placeholder="contoh: A.R. atau R.T.S." value={initials} maxLength={8} onChange={e => setInit(e.target.value)} />
          <p className="muted" style={{ marginTop: "7px" }}>Nama lengkapmu tidak akan pernah ditampilkan.</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <button onClick={send} disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
          {loading ? "Mengirim..." : "Kirim Pesan Rahasiamu →"}
        </button>
      </div>
    </main>
  );
}
