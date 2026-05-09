"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { LineItem, MiscFee, PayRow, DealerInfo, BuyerInfo } from "../lib/types";
import { fmt, calcLineNet, getSubTotal, getTotalTax, getTotalMisc, getGrandTotal } from "../lib/calc";
import StepDealer from "../components/StepDealer";
import StepBuyer from "../components/StepBuyer";
import StepLineItems from "../components/StepLineItems";
import StepTotals from "../components/StepTotals";
import StepInvoice from "../components/StepInvoice";

const STEPS = ["Dealer", "Buyer", "Line Items", "Totals", "Invoice"];

const EMPTY_DEALER: DealerInfo = {
  name: "", code: "", phone: "", fax: "", email: "", web: "",
  street: "", city: "", state: "", zip: "",
  invNum: "", invDate: new Date().toISOString().split("T")[0], po: "", sales: "",
};
const EMPTY_BUYER: BuyerInfo = {
  name: "", custid: "", email: "", phone: "", contact: "",
  billStreet: "", billCity: "", billState: "", billZip: "",
  shipStreet: "", shipCity: "", shipState: "", shipZip: "",
  sameAddress: false, shipVia: "",
};

export default function PortalPage() {
  const router = useRouter();
  const [dealerName, setDealerName] = useState("");
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [dealer, setDealer] = useState<DealerInfo>(EMPTY_DEALER);
  const [buyer, setBuyer] = useState<BuyerInfo>(EMPTY_BUYER);
  const [lines, setLines] = useState<LineItem[]>([]);
  const [miscFees, setMiscFees] = useState<MiscFee[]>([
    { idx: 0, label: "Sales Tax", amount: "" },
    { idx: 1, label: "Doc / Admin Fee", amount: "" },
  ]);
  const [miscIdx, setMiscIdx] = useState(2);
  const [pays, setPays] = useState<PayRow[]>([{ idx: 0, type: "", desc: "", amount: "" }]);
  const [payIdx, setPayIdx] = useState(1);
  const [scheduleTotal, setScheduleTotal] = useState("");

  useEffect(() => {
    const dn = sessionStorage.getItem("dealer");
    if (!dn) { router.push("/"); return; }
    setDealerName(dn);
    setDealer(d => ({ ...d, name: dn }));
  }, [router]);

  function validate(s: number): string[] {
    const errs: string[] = [];
    if (s === 0) {
      if (!dealer.name) errs.push("Dealer name");
      if (!dealer.street) errs.push("Dealer street");
      if (!dealer.city) errs.push("Dealer city");
      if (!dealer.state) errs.push("Dealer state");
      if (!dealer.zip) errs.push("Dealer ZIP");
      if (!dealer.invNum) errs.push("Invoice number");
      if (!dealer.invDate) errs.push("Invoice date");
    }
    if (s === 1) {
      if (!buyer.name) errs.push("Buyer legal name");
      if (!buyer.billStreet) errs.push("Billing street");
      if (!buyer.billCity) errs.push("Billing city");
      if (!buyer.billState) errs.push("Billing state");
      if (!buyer.billZip) errs.push("Billing ZIP");
      if (!buyer.sameAddress) {
        if (!buyer.shipStreet) errs.push("Shipping street");
        if (!buyer.shipCity) errs.push("Shipping city");
        if (!buyer.shipState) errs.push("Shipping state");
        if (!buyer.shipZip) errs.push("Shipping ZIP");
      }
    }
    if (s === 2) {
      if (lines.length === 0) errs.push("Add at least one line item (Unit, Part, or Trade-in)");
      lines.forEach((l, i) => {
        if (!l.desc) errs.push(`Item ${i + 1}: description required`);
        if (!l.price) errs.push(`Item ${i + 1}: price required`);
        if ((l.type === "UN" || l.type === "TR") && !l.serialized) errs.push(`Item ${i + 1}: select Yes/No for serialized`);
        if (l.serialized === "Y" && !l.sn) errs.push(`Item ${i + 1}: serial/VIN required`);
      });
    }
    if (s === 3) {
      const sv = parseFloat(scheduleTotal.replace(/[^0-9.]/g, "")) || 0;
      if (!sv) errs.push("WF Equipment schedule total is required");
      else {
        const grand = getGrandTotal(lines, miscFees);
        if (Math.abs(grand - sv) > 0.01) {
          errs.push(`Invoice total ($${fmt(grand)}) does not match schedule ($${fmt(sv)}) — difference: $${fmt(Math.abs(grand - sv))}`);
        }
      }
    }
    return errs;
  }

  function next() {
    const errs = validate(step);
    if (errs.length > 0) { setErrors(errs); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setErrors([]);
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() { setErrors([]); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function goStep(n: number) { if (n < step) { setErrors([]); setStep(n); window.scrollTo({ top: 0, behavior: "smooth" }); } }

  function logout() { sessionStorage.removeItem("dealer"); router.push("/"); }

  // Line item helpers
  function addLine(type: "UN" | "PA" | "TR") {
    const idx = lines.length > 0 ? Math.max(...lines.map(l => l.idx)) + 1 : 0;
    setLines(ls => [...ls, {
      idx, type, item: "", desc: "", year: "", condition: "",
      serialized: "", sn: "", meter: "", qty: "1",
      tax: "Y", price: "", taxAmt: "", discount: "", net: 0,
    }]);
  }
  function removeLine(idx: number) { setLines(ls => ls.filter(l => l.idx !== idx)); }
  function updateLine(idx: number, field: string, value: string) {
    setLines(ls => ls.map(l => {
      if (l.idx !== idx) return l;
      const updated = { ...l, [field]: value };
      if (["price", "qty", "discount"].includes(field)) updated.net = calcLineNet(updated);
      if (field === "tax" && value === "N") { updated.taxAmt = ""; }
      return updated;
    }));
  }
  function recalcLine(idx: number) {
    setLines(ls => ls.map(l => l.idx === idx ? { ...l, net: calcLineNet(l) } : l));
  }

  // Misc fee helpers
  function addMiscFee() {
    setMiscFees(f => [...f, { idx: miscIdx, label: "", amount: "" }]);
    setMiscIdx(i => i + 1);
  }
  function removeMiscFee(idx: number) { setMiscFees(f => f.filter(x => x.idx !== idx)); }
  function updateMiscFee(idx: number, field: string, value: string) {
    setMiscFees(f => f.map(x => x.idx === idx ? { ...x, [field]: value } : x));
  }

  // Pay row helpers
  function addPay() {
    setPays(p => [...p, { idx: payIdx, type: "", desc: "", amount: "" }]);
    setPayIdx(i => i + 1);
  }
  function removePay(idx: number) { setPays(p => p.filter(x => x.idx !== idx)); }
  function updatePay(idx: number, field: string, value: string) {
    setPays(p => p.map(x => x.idx === idx ? { ...x, [field]: value } : x));
  }

  const invoiceProps = {
    dealer, buyer, lines, miscFees, pays, scheduleTotal,
    subTotal: getSubTotal(lines),
    totalTax: getTotalTax(lines),
    totalMisc: getTotalMisc(miscFees),
    grandTotal: getGrandTotal(lines, miscFees),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* APP BAR */}
      <div className="no-print" style={{ background: "var(--red)", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", position: "sticky", top: 0, zIndex: 300, boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Bobcat" style={{ height: 26, filter: "brightness(0) invert(1)" }} />
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.22)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase" }}>Dealer Invoice Portal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 3, padding: "5px 12px 5px 8px" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--orange)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white" }}>
              {dealerName.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.88)", fontWeight: 500 }}>{dealerName}</span>
          </div>
          <button onClick={logout} style={{ fontSize: 12, color: "rgba(255,255,255,.6)", background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.18)", cursor: "pointer", padding: "5px 12px", borderRadius: 3 }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* STEPPER */}
      <div className="no-print" style={{ background: "white", borderBottom: "3px solid var(--gray-2)", padding: "0 28px", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", maxWidth: 1000, margin: "0 auto" }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div
                onClick={() => goStep(i)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", gap: 9,
                  padding: "13px 0", cursor: i < step ? "pointer" : "default",
                  borderBottom: i === step ? "3px solid var(--orange)" : "3px solid transparent",
                  marginBottom: -3, opacity: i === step ? 1 : i < step ? 0.7 : 0.3,
                  transition: "all .2s",
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: `2px solid ${i === step ? "var(--orange)" : i < step ? "var(--ok-br)" : "var(--border-d)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  background: i === step ? "var(--orange)" : i < step ? "var(--ok-bg)" : "transparent",
                  color: i === step ? "white" : i < step ? "var(--ok)" : "var(--text-3)",
                  flexShrink: 0,
                }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: i === step ? "var(--text)" : "var(--text-2)", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: ".03em" }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div style={{ width: 18, height: 1, background: "var(--border)", flexShrink: 0, margin: "0 4px" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "22px 28px 88px", flex: 1, width: "100%" }}>
        {errors.length > 0 && (
          <div className="no-print" style={{ background: "var(--err-bg)", border: "1px solid var(--err-br)", borderRadius: "var(--rl)", padding: "12px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--err)", marginBottom: 6 }}>⚠ Please fix the following:</div>
            <ul style={{ paddingLeft: 18 }}>
              {errors.map((e, i) => <li key={i} style={{ fontSize: 12, color: "var(--err)", padding: "2px 0" }}>{e}</li>)}
            </ul>
          </div>
        )}

        {step === 0 && <StepDealer dealer={dealer} setDealer={setDealer} />}
        {step === 1 && <StepBuyer buyer={buyer} setBuyer={setBuyer} />}
        {step === 2 && (
          <StepLineItems
            lines={lines} addLine={addLine} removeLine={removeLine}
            updateLine={updateLine} recalcLine={recalcLine}
          />
        )}
        {step === 3 && (
          <StepTotals
            lines={lines} miscFees={miscFees} pays={pays}
            scheduleTotal={scheduleTotal} setScheduleTotal={setScheduleTotal}
            addMiscFee={addMiscFee} removeMiscFee={removeMiscFee} updateMiscFee={updateMiscFee}
            addPay={addPay} removePay={removePay} updatePay={updatePay}
          />
        )}
        {step === 4 && <StepInvoice {...invoiceProps} />}
      </div>

      {/* NAV BAR */}
      <div className="no-print" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "3px solid var(--orange)", padding: "11px 28px", zIndex: 100, boxShadow: "0 -4px 16px rgba(0,0,0,.07)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {step > 0
            ? <button className="btn btn-ghost" onClick={back}>← Back</button>
            : <span />
          }
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11, color: "var(--text-2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>Step {step + 1} of {STEPS.length}</span>
            <div style={{ display: "flex", gap: 5 }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ width: i === step ? 18 : 7, height: 7, borderRadius: i === step ? 3 : "50%", background: i === step ? "var(--orange)" : i < step ? "var(--ok)" : "var(--border-d)", transition: "all .2s" }} />
              ))}
            </div>
          </div>
          {step < STEPS.length - 1
            ? <button className="btn btn-primary" onClick={next}>Next →</button>
            : <button className="btn btn-primary" onClick={() => window.print()}>🖨 Print Invoice</button>
          }
        </div>
      </div>
    </div>
  );
}
