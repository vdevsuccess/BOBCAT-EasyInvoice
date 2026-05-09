"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkCredentials } from "./lib/dealers";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !pass) { setError("Please enter both dealer name and password."); return; }
    if (checkCredentials(name, pass)) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("dealer", name.trim());
      }
      router.push("/portal");
    } else {
      setError("Incorrect dealer name or password. Please try again.");
      setPass("");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* TOP BAR */}
      <div style={{ background: "var(--red)", height: 54, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--fc)", fontSize: 26, fontWeight: 900, color: "white", letterSpacing: ".16em", textTransform: "uppercase" }}>BOBCAT</span>
      </div>

      {/* HERO */}
      <div style={{
        position: "relative", minHeight: 480, background: "#111",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "56px 80px", gap: 60, overflow: "hidden", flex: 1
      }}>
        {/* Grid texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(241,90,34,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(241,90,34,.055) 1px,transparent 1px)", backgroundSize: "52px 52px", pointerEvents: "none" }} />
        {/* Glows */}
        <div style={{ position: "absolute", top: -200, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(241,90,34,.18) 0%,transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -150, left: -150, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(204,0,0,.12) 0%,transparent 65%)", pointerEvents: "none" }} />
        {/* Orange left bar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: "var(--orange)", zIndex: 2 }} />

        {/* LEFT: tagline */}
        <div style={{ maxWidth: 460, zIndex: 2, position: "relative" }}>
          <h1 style={{ fontFamily: "var(--fc)", fontSize: 46, fontWeight: 900, color: "white", lineHeight: 1.06, textTransform: "uppercase", letterSpacing: "-.01em", marginBottom: 14 }}>
            Invoice right.<br /><span style={{ color: "var(--orange)" }}>Fund faster.</span>
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.55)", lineHeight: 1.8, marginBottom: 26 }}>
            Complete, accurate dealer invoices mean faster booking approvals and quicker funding through Wells Fargo. Every required field, every time — no rework, no delays.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Step-by-step guided entry","Matches real invoice format","Auto fee calculation","Schedule match check","Print-ready PDF output"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 3, padding: "5px 12px", fontSize: 11, color: "rgba(255,255,255,.75)", fontWeight: 500 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--orange)", flexShrink: 0 }} />{t}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT: login card */}
        <div style={{ zIndex: 2, position: "relative", flexShrink: 0 }}>
          <div style={{ background: "white", borderRadius: "var(--rx)", width: 350, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,.55)" }}>
            <div style={{ background: "var(--orange)", padding: "18px 24px" }}>
              <h2 style={{ fontFamily: "var(--fc)", fontSize: 18, fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 3 }}>Dealer Sign In</h2>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,.8)" }}>Enter your credentials to access the invoice portal</p>
            </div>
            <form onSubmit={handleLogin} style={{ padding: 24 }}>
              {error && <div style={{ background: "var(--err-bg)", border: "1px solid var(--err-br)", borderRadius: "var(--r)", padding: "9px 12px", fontSize: 12, color: "var(--err)", marginBottom: 12 }}>{error}</div>}
              <div className="f" style={{ marginBottom: 14 }}>
                <label>Dealer Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your dealer business name" autoComplete="username" />
              </div>
              <div className="f" style={{ marginBottom: 16 }}>
                <label>Password</label>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" autoComplete="current-password" />
              </div>
              <button type="submit" style={{ width: "100%", padding: 11, background: "var(--red)", border: "none", borderRadius: "var(--r)", color: "white", fontFamily: "var(--fc)", fontSize: 14, fontWeight: 700, cursor: "pointer", textTransform: "uppercase", letterSpacing: ".06em" }}>
                Sign In to Portal
              </button>
              <p style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", marginTop: 10 }}>
                Need access? Contact your Wells Fargo relationship manager.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background: "var(--orange)", padding: "16px 40px", display: "flex", justifyContent: "center", gap: 64 }}>
        {[["2–4hr","Average Funding Time"],["100%","Field Completeness Check"],["Zero","Rework on Complete Invoices"]].map(([v,l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--fc)", fontSize: 24, fontWeight: 700, color: "white", lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.8)", fontWeight: 500, marginTop: 3, textTransform: "uppercase", letterSpacing: ".05em" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
