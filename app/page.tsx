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
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

      {/* ── ANIMATED GRADIENT BACKGROUND ── */}
      <style>{`
        @keyframes blobMove1 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(40px, -30px) scale(1.08); }
          66%  { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blobMove2 {
          0%   { transform: translate(0px, 0px) scale(1); }
          33%  { transform: translate(-35px, 25px) scale(1.05); }
          66%  { transform: translate(30px, -15px) scale(0.97); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blobMove3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(20px, 30px) scale(1.06); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes titleReveal {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes letterShimmer {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.6; }
        }
        .hero-title-word {
          display: inline-block;
          animation: titleReveal 0.7s ease forwards;
          opacity: 0;
        }
        .hero-title-word:nth-child(1)  { animation-delay: 0.05s; }
        .hero-title-word:nth-child(2)  { animation-delay: 0.15s; }
        .hero-title-word:nth-child(3)  { animation-delay: 0.25s; }
        .hero-title-word:nth-child(4)  { animation-delay: 0.35s; }
        .hero-title-word:nth-child(5)  { animation-delay: 0.45s; }
        .hero-title-word:nth-child(6)  { animation-delay: 0.55s; }
        .hero-title-word:nth-child(7)  { animation-delay: 0.65s; }
        .hero-title-word:nth-child(8)  { animation-delay: 0.75s; }

        .gradient-text {
          background: linear-gradient(135deg, #213B2A 0%, #2d5a3d 40%, #4A2619 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Blob 1 — kiri atas, hijau muda */}
      <div style={{
        position: "fixed", top: "-120px", left: "-100px",
        width: "520px", height: "520px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(33,59,42,0.13) 0%, rgba(33,59,42,0.04) 60%, transparent 100%)",
        animation: "blobMove1 9s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Blob 2 — kanan tengah, hijau tua */}
      <div style={{
        position: "fixed", top: "20%", right: "-150px",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,90,61,0.10) 0%, rgba(33,59,42,0.03) 60%, transparent 100%)",
        animation: "blobMove2 12s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Blob 3 — bawah kiri, aksen bark */}
      <div style={{
        position: "fixed", bottom: "-80px", left: "20%",
        width: "440px", height: "440px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(33,59,42,0.08) 0%, rgba(74,38,25,0.03) 55%, transparent 100%)",
        animation: "blobMove3 15s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Blob 4 — kanan bawah */}
      <div style={{
        position: "fixed", bottom: "10%", right: "-80px",
        width: "380px", height: "380px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(45,90,61,0.08) 0%, transparent 70%)",
        animation: "blobMove1 18s ease-in-out infinite reverse",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── NAV ── */}
      <nav className="nav" style={{ position: "relative", zIndex: 10 }}>
        <span className="nav-logo">bisik</span>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link href="/dashboard" style={{ fontFamily: "var(--ff)", fontSize: "0.75rem", letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--mist)", textDecoration: "none" }}>
            Lihat Pesan
          </Link>
          <Link href="/compose" className="btn btn-primary">Tulis Pesan</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", gap: "28px", position: "relative", zIndex: 10 }}>

        {/* eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }} className="fu">
          <div style={{ width: "36px", height: "1px", background: "var(--mist)" }} />
          <span style={{ fontFamily: "var(--ff)", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--mist)" }}>pesan rahasia</span>
          <div style={{ width: "36px", height: "1px", background: "var(--mist)" }} />
        </div>

        {/* ── ANIMATED TITLE ── */}
        <h1 style={{ fontSize: "clamp(2.6rem, 7vw, 5rem)", lineHeight: 1.12, maxWidth: "700px", letterSpacing: "-0.01em" }}>
          {/* baris 1: "Bisikkan hal yang" */}
          <span style={{ display: "block", marginBottom: "0.05em" }}>
            <span className="hero-title-word" style={{ fontFamily: "var(--fp)", fontStyle: "italic", fontWeight: 400, color: "var(--forest)", marginRight: "0.22em" }}>Bisikkan</span>
            <span className="hero-title-word" style={{ fontFamily: "var(--ff)", fontWeight: 600, color: "var(--forest)", marginRight: "0.22em" }}>hal</span>
            <span className="hero-title-word" style={{ fontFamily: "var(--ff)", fontWeight: 600, color: "var(--forest)" }}>yang</span>
          </span>
          {/* baris 2: "tak bisa kamu ucapkan" */}
          <span style={{ display: "block" }}>
            <span className="hero-title-word" style={{ fontFamily: "var(--fp)", fontStyle: "italic", fontWeight: 400, marginRight: "0.22em" }} className="gradient-text hero-title-word">tak</span>
            <span className="hero-title-word" style={{ fontFamily: "var(--fp)", fontStyle: "italic", fontWeight: 400, marginRight: "0.22em" }} className="gradient-text hero-title-word">bisa</span>
            <span className="hero-title-word" style={{ fontFamily: "var(--ff)", fontWeight: 600, color: "var(--forest)", marginRight: "0.22em" }}>kamu</span>
            <span className="hero-title-word" style={{ fontFamily: "var(--ff)", fontWeight: 600, color: "var(--forest)" }}>ucapkan</span>
          </span>
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

      {/* ── CATEGORIES ── */}
      <section style={{ borderTop: "1px solid rgba(33,59,42,0.08)", padding: "52px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "28px", maxWidth: "860px", margin: "0 auto", width: "100%", position: "relative", zIndex: 10 }}>
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

      <footer className="footer" style={{ position: "relative", zIndex: 10 }}>
        bisik · semua pesan anonim · hanya inisial yang tersimpan
      </footer>
    </main>
  );
}
