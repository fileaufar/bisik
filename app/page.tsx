"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const words = ["secret admirer", "untuk kamu", "diam-diam", "tak terucap", "bisikan hati"];

export default function Home() {
  const [idx, setIdx] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      setTimeout(() => { setIdx(i => (i + 1) % words.length); setShow(true); }, 380);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">bisik</span>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link href="/dashboard" style={{ fontFamily: "var(--ff)", fontSize: "0.75rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--mist)", textDecoration: "none" }}>
            Lihat Pesan
          </Link>
          <Link href="/compose" className="btn btn-primary">Tulis Pesan</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", gap: "28px" }}>

        {/* eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "36px", height: "1px", background: "var(--mist)" }} />
          <span style={{ fontFamily: "var(--ff)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mist)" }}>pesan rahasia</span>
          <div style={{ width: "36px", height: "1px", background: "var(--mist)" }} />
        </div>

        {/* heading — Playfair italic + Funnel bold */}
        <h1 className="title fu" style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", lineHeight: 1.12, color: "var(--forest)", maxWidth: "660px" }}>
          <em>Bisikkan</em> <span>hal yang</span>
          <br />
          <em>tak bisa</em> <span>kamu ucapkan</span>
        </h1>

        {/* rotating word */}
        <p style={{ fontFamily: "var(--fp)", fontStyle: "italic", fontSize: "1.05rem", color: "var(--bark)", opacity: show ? 1 : 0, transition: "opacity 380ms ease", minHeight: "1.6rem" }}>
          {words[idx]}
        </p>

        {/* subtitle */}
        <p className="fu2" style={{ fontFamily: "var(--ff)", fontSize: "0.95rem", color: "var(--mist)", maxWidth: "400px", lineHeight: 1.8 }}>
          Anonim, tulus, dan diam-diam. Hanya inisialmu yang tersisa di akhir setiap pesan.
        </p>

        {/* CTA */}
        <div className="fu3" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/compose" className="btn btn-primary">Tulis Pesanmu</Link>
          <Link href="/dashboard" className="btn btn-outline">Baca Semua Pesan</Link>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ borderTop: "1px solid rgba(33,59,42,0.08)", padding: "52px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "28px", maxWidth: "860px", margin: "0 auto", width: "100%" }}>
        {[
          { emoji: "🌸", label: "Secret Admirer", desc: "Perasaan yang selalu tersimpan" },
          { emoji: "☕", label: "Untuk Barista",  desc: "Apresiasi yang tak pernah tersampaikan" },
          { emoji: "🌿", label: "Untuk Teman",    desc: "Kesan yang belum sempat terucap" },
          { emoji: "✦",  label: "Cerita Kecil",   desc: "Sepotong momen yang ingin dibagikan" },
        ].map(c => (
          <div key={c.label} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", padding: "16px 8px" }}>
            <span style={{ fontSize: "1.4rem" }}>{c.emoji}</span>
            <span style={{ fontFamily: "var(--fp)", fontStyle: "italic", fontSize: "0.95rem", color: "var(--forest)" }}>{c.label}</span>
            <span style={{ fontFamily: "var(--ff)", fontSize: "0.76rem", color: "var(--mist)", lineHeight: 1.55 }}>{c.desc}</span>
          </div>
        ))}
      </section>

      <footer className="footer">bisik · semua pesan anonim · hanya inisial yang tersimpan</footer>
    </main>
  );
}
