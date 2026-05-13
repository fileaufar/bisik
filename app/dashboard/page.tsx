"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SecretMessage, MessageCategory, CATEGORY_LABELS, CATEGORY_EMOJI } from "@/lib/types";

type Filter = "all" | MessageCategory;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all",     label: "Semua" },
  { id: "admirer", label: "Admirer" },
  { id: "barista", label: "Barista" },
  { id: "friend",  label: "Teman" },
  { id: "story",   label: "Cerita" },
];

function ago(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1)  return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

export default function Dashboard() {
  const [msgs, setMsgs]       = useState<SecretMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<Filter>("all");

  useEffect(() => {
    fetch("/api/messages")
      .then(r => r.json())
      .then(d => { setMsgs(d.messages || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const shown = filter === "all" ? msgs : msgs.filter(m => m.category === filter);

  return (
    <main style={{ minHeight: "100vh" }}>

      <nav className="nav">
        <Link href="/" className="nav-logo">bisik</Link>
        <Link href="/compose" className="btn btn-primary">Tulis Pesan</Link>
      </nav>

      <div className="page" style={{ maxWidth: "720px" }}>

        {/* header */}
        <div className="fu" style={{ textAlign: "center", marginBottom: "44px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
          <span style={{ fontFamily: "var(--ff)", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--mist)" }}>Bisikan-bisikan</span>
          <h1 className="title" style={{ fontSize: "2.4rem", color: "var(--forest)" }}>
            <em>Pesan yang</em> <span>tersembunyi</span>
          </h1>
          <p style={{ fontFamily: "var(--ff)", color: "var(--mist)", fontSize: "0.88rem", maxWidth: "340px", lineHeight: 1.75 }}>
            Semuanya anonim. Hanya inisial pengirim yang terlihat.
          </p>
          <div className="divider" style={{ marginTop: "4px" }} />
        </div>

        {/* filter pills */}
        <div className="fu1" style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "36px" }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                fontFamily: "var(--ff)", fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "6px 18px", borderRadius: "100px", cursor: "pointer", transition: "all 200ms ease",
                border: `1.5px solid ${filter === f.id ? "var(--forest)" : "rgba(33,59,42,0.15)"}`,
                background: filter === f.id ? "var(--forest)" : "transparent",
                color: filter === f.id ? "var(--cream)" : "var(--mist)",
              }}
            >{f.label}</button>
          ))}
        </div>

        {/* count */}
        <p className="muted" style={{ textAlign: "center", marginBottom: "28px" }}>
          {loading ? "Memuat..." : `${shown.length} pesan`}
        </p>

        {/* messages */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[1,2,3].map(i => <div key={i} className="card" style={{ height: "120px", opacity: 0.35 }} />)}
          </div>
        ) : shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "72px 24px", display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
            <span style={{ fontSize: "1.8rem" }}>🌿</span>
            <p style={{ fontFamily: "var(--fp)", fontStyle: "italic", color: "var(--mist)", fontSize: "1.05rem" }}>Belum ada pesan di sini.</p>
            <Link href="/compose" className="btn btn-outline" style={{ marginTop: "8px" }}>Jadilah yang pertama</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {shown.map((msg, i) => (
              <article key={msg.id} className="card fu" style={{ padding: "28px 30px", animationDelay: `${i * 0.04}s`, opacity: 0 }}>

                {/* top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{CATEGORY_EMOJI[msg.category]}</span>
                    <span className={`badge badge-${msg.category}`}>{CATEGORY_LABELS[msg.category]}</span>
                  </div>
                  <span className="muted">{ago(msg.createdAt)}</span>
                </div>

                {/* content */}
                <p style={{ fontFamily: "var(--ff)", fontSize: "0.97rem", color: "var(--forest)", lineHeight: 1.82, marginBottom: "18px" }}>
                  {msg.content}
                </p>

                {/* initials */}
                <div className="sep" />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontFamily: "var(--fp)", fontStyle: "italic", fontSize: "0.9rem", color: "var(--bark)", letterSpacing: "0.05em" }}>
                    — {msg.initials}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && shown.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "52px" }}>
            <Link href="/compose" className="btn btn-outline">Tulis Pesanmu Sendiri →</Link>
          </div>
        )}
      </div>

      <footer className="footer" style={{ marginTop: "60px" }}>
        bisik · semua pesan anonim · hanya inisial yang tersimpan
      </footer>
    </main>
  );
}
