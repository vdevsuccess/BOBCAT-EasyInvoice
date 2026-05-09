import type { LineItem } from "../lib/types";
import { fmt } from "../lib/calc";

const CONDS = ["", "New", "Used", "Demo / Rental", "Reconditioned", "Certified Pre-Owned"];
const TYPE_LABELS: Record<string, string> = { UN: "Unit (UN)", PA: "Part / Attachment (PA)", TR: "Trade-in (TR)" };

interface Props {
  lines: LineItem[];
  addLine: (t: "UN" | "PA" | "TR") => void;
  removeLine: (idx: number) => void;
  updateLine: (idx: number, field: string, value: string) => void;
  recalcLine: (idx: number) => void;
}

export default function StepLineItems({ lines, addLine, removeLine, updateLine, recalcLine }: Props) {
  function numInput(idx: number, field: string, val: string) {
    const clean = val.replace(/[^0-9.]/g, "");
    updateLine(idx, field, clean);
    recalcLine(idx);
  }

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-head-left">
          <span className="ctag">Step 3</span>
          <span className="card-title">Line Items</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11, color: "var(--text-3)" }}>
          <span className="tbadge tUN">UN</span> Unit &nbsp;
          <span className="tbadge tPA">PA</span> Part &nbsp;
          <span className="tbadge tTR">TR</span> Trade-in
        </div>
      </div>
      <div className="card-body">
        {lines.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-3)", padding: 28, fontSize: 13, background: "var(--gray)", borderRadius: "var(--rl)", border: "2px dashed var(--border-d)", marginBottom: 12 }}>
            No line items yet. Use the buttons below to add a unit, part, or trade-in.
          </div>
        ) : lines.map((l, i) => {
          const isNeg = l.type === "TR";
          const hasUnit = l.type === "UN" || l.type === "TR";
          const taxDis = l.tax === "N";
          return (
            <div key={l.idx} style={{ background: "white", border: "1.5px solid var(--border-d)", borderRadius: "var(--rl)", marginBottom: 14, overflow: "hidden", boxShadow: "var(--shadow)" }}>
              {/* Card head */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: "var(--gray)", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "var(--text-3)" }}>Item {i + 1}</span>
                <span className={`tbadge t${l.type}`}>{TYPE_LABELS[l.type]}</span>
                <button onClick={() => removeLine(l.idx)} style={{ background: "none", border: "1px solid var(--err-br)", color: "var(--err)", borderRadius: 3, fontSize: 11, fontWeight: 600, padding: "3px 10px", cursor: "pointer" }}>Remove</button>
              </div>
              <div style={{ padding: 16 }}>
                <div className="fg2">
                  {/* Item # + Description */}
                  <div className="f"><label>Item # <span className="o">(opt)</span></label><input value={l.item} onChange={e => updateLine(l.idx, "item", e.target.value)} placeholder="e.g. 54123" /></div>
                  <div className="f">
                    <label>Description <span className="r">*</span></label>
                    <input value={l.desc} onChange={e => updateLine(l.idx, "desc", e.target.value)} placeholder={l.type === "UN" ? "Equipment name / model" : l.type === "TR" ? "Trade item description" : "Part / attachment name"} />
                  </div>

                  {hasUnit && <>
                    {/* Divider */}
                    <div style={{ gridColumn: "span 2", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--text-3)", paddingTop: 12, borderTop: "1px dashed var(--border-d)", display: "flex", alignItems: "center", gap: 8 }}>
                      Equipment Details
                      <div style={{ flex: 1, height: 1, background: "var(--border-d)" }} />
                    </div>
                    <div className="f"><label>Model Year</label><input value={l.year} onChange={e => updateLine(l.idx, "year", e.target.value)} placeholder="e.g. 2026" maxLength={4} /></div>
                    <div className="f">
                      <label>Condition</label>
                      <select value={l.condition} onChange={e => updateLine(l.idx, "condition", e.target.value)}>
                        {CONDS.map(c => <option key={c} value={c}>{c || "Select..."}</option>)}
                      </select>
                    </div>
                    {/* Serialized */}
                    <div className="f s2">
                      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-2)", marginBottom: 6 }}>Is this serialized equipment?</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[["Y", "Yes — Enter Serial / VIN"], ["N", "No — Not Serialized"]].map(([v, lbl]) => (
                          <button key={v} onClick={() => updateLine(l.idx, "serialized", v)}
                            style={{ flex: 1, padding: "8px 12px", border: `1.5px solid ${l.serialized === v ? (v === "Y" ? "var(--ok-br)" : "var(--border-d)") : "var(--border-d)"}`, borderRadius: "var(--r)", background: l.serialized === v ? (v === "Y" ? "var(--ok-bg)" : "var(--gray)") : "white", color: l.serialized === v ? (v === "Y" ? "var(--ok)" : "var(--text-3)") : "var(--text-2)", fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "center" as const }}>
                            {lbl}
                          </button>
                        ))}
                      </div>
                      {l.serialized === "Y" && <div style={{ marginTop: 8 }}><input value={l.sn} onChange={e => updateLine(l.idx, "sn", e.target.value)} placeholder="Enter serial number or VIN" /></div>}
                      {l.serialized === "N" && <div style={{ fontSize: 11, color: "var(--text-3)", fontStyle: "italic", marginTop: 6 }}>Not serialized equipment</div>}
                    </div>
                    <div className="f s2"><label>Meter / Hours <span className="o">(if used equipment)</span></label><input value={l.meter} onChange={e => updateLine(l.idx, "meter", e.target.value)} placeholder="e.g. 2.50 Hours" /></div>
                  </>}

                  {/* Pricing section divider */}
                  <div style={{ gridColumn: "span 2", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "var(--text-3)", paddingTop: 12, borderTop: "1px dashed var(--border-d)", display: "flex", alignItems: "center", gap: 8 }}>
                    Pricing
                    <div style={{ flex: 1, height: 1, background: "var(--border-d)" }} />
                  </div>

                  <div className="f"><label>Quantity</label><input inputMode="decimal" value={l.qty} onChange={e => numInput(l.idx, "qty", e.target.value)} placeholder="1" /></div>
                  <div className="f">
                    <label>Tax</label>
                    <select value={l.tax} onChange={e => updateLine(l.idx, "tax", e.target.value)}>
                      <option value="Y">Y</option><option value="N">N</option>
                    </select>
                  </div>
                  <div className="f"><label>Price (USD) <span className="r">*</span></label><input inputMode="decimal" value={l.price} onChange={e => numInput(l.idx, "price", e.target.value)} placeholder="0.00" /></div>
                  <div className="f">
                    <label>Tax Amount ($)</label>
                    <input inputMode="decimal" value={l.taxAmt} onChange={e => { updateLine(l.idx, "taxAmt", e.target.value.replace(/[^0-9.]/g, "")); }} placeholder="0.00" disabled={taxDis} style={{ opacity: taxDis ? 0.3 : 1 }} />
                  </div>
                  <div className="f"><label>Discount</label><input inputMode="decimal" value={l.discount} onChange={e => numInput(l.idx, "discount", e.target.value)} placeholder="0.00" /></div>
                  <div className="f">
                    <label>Net Price</label>
                    <div style={{ background: "var(--dark)", borderRadius: "var(--r)", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "rgba(255,255,255,.45)" }}>{isNeg ? "Deduction" : "Amount"}</span>
                      <span style={{ fontFamily: "var(--fc)", fontSize: 20, fontWeight: 700, color: isNeg ? "#F87171" : "var(--orange)" }}>
                        {isNeg ? "- " : ""}${fmt(Math.abs(l.net))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginTop: 4 }}>
          {([["UN", "var(--ok)", "Unit (UN)"], ["PA", "#0C447C", "Part / Attachment (PA)"], ["TR", "var(--err)", "Trade-in (TR)"]] as const).map(([t, color, label]) => (
            <button key={t} className="add-btn" onClick={() => addLine(t as "UN" | "PA" | "TR")}>
              <span style={{ color, fontSize: 16, fontWeight: 700, lineHeight: 1 }}>+</span> {label}
            </button>
          ))}
        </div>
        <div className="hint" style={{ marginTop: 8 }}>
          Misc fees and taxes are added in Step 4 — Totals.
        </div>
      </div>
    </div>
  );
}
