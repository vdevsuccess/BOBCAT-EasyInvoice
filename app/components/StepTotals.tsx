import type { LineItem, MiscFee, PayRow } from "../lib/types";
import { fmt, getSubTotal, getTotalTax, getTotalMisc, getGrandTotal } from "../lib/calc";

interface Props {
  lines: LineItem[];
  miscFees: MiscFee[];
  pays: PayRow[];
  scheduleTotal: string;
  setScheduleTotal: (v: string) => void;
  addMiscFee: () => void;
  removeMiscFee: (idx: number) => void;
  updateMiscFee: (idx: number, f: string, v: string) => void;
  addPay: () => void;
  removePay: (idx: number) => void;
  updatePay: (idx: number, f: string, v: string) => void;
}

export default function StepTotals({ lines, miscFees, pays, scheduleTotal, setScheduleTotal, addMiscFee, removeMiscFee, updateMiscFee, addPay, removePay, updatePay }: Props) {
  const sub = getSubTotal(lines);
  const tax = getTotalTax(lines);
  const misc = getTotalMisc(miscFees);
  const grand = getGrandTotal(lines, miscFees);
  const sv = parseFloat(scheduleTotal.replace(/[^0-9.]/g, "")) || 0;
  const matchOk = sv > 0 && Math.abs(grand - sv) < 0.01;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 310px", gap: 15, alignItems: "start" }}>
      <div>
        {/* MISC FEES & TAXES */}
        <div className="card">
          <div className="card-head">
            <div className="card-head-left"><span className="ctag">Step 4</span><span className="card-title">Fees &amp; Taxes (added to invoice total)</span></div>
            <button className="add-btn" style={{ fontSize: 11, padding: "4px 12px" }} onClick={addMiscFee}>+ Add Fee / Tax</button>
          </div>
          <div className="card-body">
            <div className="hint" style={{ marginBottom: 14 }}>
              These appear in the invoice totals breakdown — not as line items. Add sales tax, doc fees, freight, warranty, etc.
            </div>
            {miscFees.map(fee => (
              <div key={fee.idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end", marginBottom: 10 }}>
                <div className="f">
                  <label>Fee / Tax Label</label>
                  <input value={fee.label} onChange={e => updateMiscFee(fee.idx, "label", e.target.value)} placeholder="e.g. Sales Tax, Doc Fee, Freight" />
                </div>
                <div className="f">
                  <label>Amount ($)</label>
                  <input inputMode="decimal" value={fee.amount} onChange={e => updateMiscFee(fee.idx, "amount", e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" />
                </div>
                <button onClick={() => removeMiscFee(fee.idx)} style={{ background: "none", border: "1px solid var(--err-br)", color: "var(--err)", borderRadius: 3, fontSize: 11, fontWeight: 600, padding: "8px 10px", cursor: "pointer", height: 37 }}>✕</button>
              </div>
            ))}
            {miscFees.length === 0 && (
              <div style={{ fontSize: 12, color: "var(--text-3)", fontStyle: "italic" }}>No fees added yet. Click "+ Add Fee / Tax" to add sales tax, doc fees, etc.</div>
            )}
          </div>
        </div>

        {/* FORMS OF PAYMENT */}
        <div className="card">
          <div className="card-head">
            <div className="card-head-left"><span className="ctag">Payment</span><span className="card-title">Forms of Payment</span></div>
            <button className="add-btn" style={{ fontSize: 11, padding: "4px 12px" }} onClick={addPay}>+ Add Row</button>
          </div>
          <div className="card-body">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr>
                {["Type", "Description / Customer ID", "Amount", ""].map((h, i) => (
                  <th key={i} style={{ textAlign: i === 2 ? "right" : "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: ".07em", color: "var(--text-3)", padding: "0 8px 8px", width: i === 0 ? "28%" : i === 2 ? "18%" : i === 3 ? 28 : undefined }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {pays.map(p => (
                  <tr key={p.idx}>
                    <td><input value={p.type} onChange={e => updatePay(p.idx, "type", e.target.value)} placeholder="e.g. A7-Contr GE-01" /></td>
                    <td><input value={p.desc} onChange={e => updatePay(p.idx, "desc", e.target.value)} placeholder="Customer Id: GELEASE001" /></td>
                    <td><input inputMode="decimal" value={p.amount} onChange={e => updatePay(p.idx, "amount", e.target.value)} placeholder="0.00" style={{ textAlign: "right" }} /></td>
                    <td><button onClick={() => removePay(p.idx)} style={{ background: "none", border: "none", color: "var(--err)", cursor: "pointer", fontSize: 14, padding: "2px 4px" }}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SCHEDULE MATCH */}
        <div className="card">
          <div className="card-head"><div className="card-head-left"><span className="ctag">Verify</span><span className="card-title">Equipment Schedule Match</span></div></div>
          <div className="card-body">
            <div style={{ background: "var(--gray)", border: "2px solid var(--border-d)", borderRadius: "var(--rl)", padding: "15px 18px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" as const }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", whiteSpace: "nowrap" as const, textTransform: "uppercase" as const, letterSpacing: ".04em" }}>WF Schedule Total:</label>
                <input inputMode="decimal" value={scheduleTotal} onChange={e => setScheduleTotal(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" style={{ maxWidth: 130, fontSize: 16, fontWeight: 700, fontFamily: "var(--fc)" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: sv > 0 ? (matchOk ? "var(--ok)" : "var(--err)") : "var(--border-d)", flexShrink: 0, transition: "background .2s" }} />
                <span style={{ fontSize: 12, color: sv > 0 ? (matchOk ? "var(--ok)" : "var(--err)") : "var(--text-3)", fontWeight: sv > 0 ? 700 : 400 }}>
                  {sv === 0 ? "Enter the WF equipment schedule amount to verify" : matchOk ? `✓ Invoice total matches schedule — ready to submit` : `✗ Mismatch — invoice $${fmt(grand)} vs schedule $${fmt(sv)} (difference: $${fmt(Math.abs(grand - sv))})`}
                </span>
              </div>
            </div>
            <div className="hint" style={{ marginTop: 7 }}>Invoice total must exactly match the equipment schedule. Mismatches delay funding.</div>
          </div>
        </div>
      </div>

      {/* LIVE TOTALS */}
      <div className="card">
        <div className="card-head"><div className="card-head-left"><span className="ctag">Live</span><span className="card-title">Invoice Totals</span></div></div>
        <div style={{ borderCollapse: "collapse" } as React.CSSProperties}>
          {[
            ["Line Items Subtotal", `$${fmt(sub)}`, false],
            ["Tax (from lines)", `$${fmt(tax)}`, false],
            ...miscFees.filter(f => parseFloat(f.amount) > 0).map(f => [f.label || "Fee", `$${fmt(parseFloat(f.amount) || 0)}`, false]),
          ].map(([label, value, bold], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid var(--border)", fontSize: 13, background: i % 2 === 0 ? "white" : "var(--gray)" }}>
              <span style={{ color: "var(--text-3)" }}>{label as string}</span>
              <span style={{ fontWeight: bold ? 700 : 600 }}>{value as string}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", fontSize: 13, fontWeight: 700, background: "var(--gray-2)", borderBottom: "1px solid var(--border-d)" }}>
            <span>Invoice Total</span>
            <span style={{ fontSize: 15 }}>${fmt(grand)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: "var(--black)" }}>
            <span style={{ color: "rgba(255,255,255,.6)", fontWeight: 600, fontSize: 13 }}>Grand Total</span>
            <span style={{ fontFamily: "var(--fc)", fontSize: 20, fontWeight: 900, color: "var(--orange)" }}>${fmt(grand)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
