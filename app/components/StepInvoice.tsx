import type { LineItem, MiscFee, PayRow, DealerInfo, BuyerInfo } from "../lib/types";
import { fmt } from "../lib/calc";

interface Props {
  dealer: DealerInfo;
  buyer: BuyerInfo;
  lines: LineItem[];
  miscFees: MiscFee[];
  pays: PayRow[];
  scheduleTotal: string;
  subTotal: number;
  totalTax: number;
  totalMisc: number;
  grandTotal: number;
}

export default function StepInvoice({ dealer, buyer, lines, miscFees, pays, scheduleTotal, subTotal, totalTax, totalMisc, grandTotal }: Props) {
  const sv = parseFloat(scheduleTotal.replace(/[^0-9.]/g, "")) || 0;
  const matchOk = sv > 0 && Math.abs(grandTotal - sv) < 0.01;
  const fmtDate = dealer.invDate
    ? new Date(dealer.invDate + "T00:00:00").toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
    : "";
  const billAddr = [buyer.name, buyer.contact, buyer.billStreet, `${buyer.billCity}${buyer.billState ? ", " + buyer.billState : ""} ${buyer.billZip}`.trim()].filter(Boolean);
  const shipName = buyer.sameAddress ? buyer.name : buyer.name;
  const shipSt = buyer.sameAddress ? buyer.billStreet : buyer.shipStreet;
  const shipCy = buyer.sameAddress ? buyer.billCity : buyer.shipCity;
  const shipStt = buyer.sameAddress ? buyer.billState : buyer.shipState;
  const shipZp = buyer.sameAddress ? buyer.billZip : buyer.shipZip;
  const shipAddr = [shipName, buyer.contact, shipSt, `${shipCy}${shipStt ? ", " + shipStt : ""} ${shipZp}`.trim()].filter(Boolean);
  const validPays = pays.filter(p => p.type || p.desc || p.amount);
  const payTotal = validPays.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  return (
    <>
      {sv > 0 && (
        <div className="no-print" style={{ borderRadius: "var(--rl)", padding: "12px 17px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 11, fontSize: 13, background: matchOk ? "var(--ok-bg)" : "var(--err-bg)", border: `1px solid ${matchOk ? "var(--ok-br)" : "var(--err-br)"}`, color: matchOk ? "var(--ok)" : "var(--err)" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{matchOk ? "✓" : "✗"}</span>
          <div>
            <strong>{matchOk ? "Invoice verified — schedule amount matches." : "Amount mismatch — do not submit until corrected."}</strong>
            <span>{matchOk ? " Ready to print and submit to Wells Fargo." : " Return to Totals step and correct amounts."}</span>
          </div>
        </div>
      )}
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".03em" }}>Invoice Preview</div>
          <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>Exactly how your invoice will print. Review before submitting to Wells Fargo.</div>
        </div>
        <button className="btn btn-primary" onClick={() => window.print()} style={{ padding: "10px 26px", fontSize: 14 }}>Print Invoice</button>
      </div>

      {/* INVOICE DOCUMENT */}
      <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--rl)", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>

        {/* Header */}
        <div style={{ padding: "22px 28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, borderBottom: "3px solid var(--orange)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Bobcat" style={{ height: 36, objectFit: "contain", display: "block", marginBottom: 8 }} />
            <div style={{ fontFamily: "var(--fc)", fontSize: 19, fontWeight: 700 }}>{dealer.name}</div>
            <div style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.7 }}>
              {dealer.street && <>{dealer.street}<br /></>}
              {dealer.city}{dealer.state && `, ${dealer.state}`} {dealer.zip}<br />
              {dealer.phone && <>Phone: {dealer.phone}{dealer.fax && ` | Fax: ${dealer.fax}`}<br /></>}
              {dealer.email && <>Email: {dealer.email}<br /></>}
              {dealer.web && <>Web site: {dealer.web}</>}
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontFamily: "var(--fc)", fontSize: 30, fontWeight: 900, letterSpacing: ".02em", textTransform: "uppercase", marginBottom: 10 }}>INVOICE</div>
            <table style={{ borderCollapse: "collapse", marginLeft: "auto" }}>
              {[["Invoice:", dealer.invNum], ["Date:", fmtDate], ["PO:", dealer.po || "N/A"], ["CustId:", buyer.custid || "N/A"]].map(([k, v]) => (
                <tr key={k}><td style={{ padding: "2px 6px", fontSize: 12, color: "var(--text-3)", textAlign: "right", fontWeight: 500 }}>{k}</td><td style={{ padding: "2px 6px", fontSize: 12, fontWeight: 700, textAlign: "left" }}>{v}</td></tr>
              ))}
            </table>
          </div>
        </div>

        {/* Addresses */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
          {[["Bill To", billAddr], ["Ship To", shipAddr]].map(([label, addr], i) => (
            <div key={i} style={{ padding: "13px 28px", borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 6, paddingBottom: 3, borderBottom: "2px solid var(--orange)", display: "inline-block" }}>{label}</div>
              <div style={{ fontSize: 12, lineHeight: 1.75 }}>
                {(addr as string[]).map((line, j) => <div key={j}>{j === 0 ? <strong style={{ fontSize: 13, fontWeight: 700 }}>{line}</strong> : line}</div>)}
                {label === "Ship To" && buyer.shipVia && <div style={{ fontStyle: "italic" }}>{buyer.shipVia}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Meta row */}
        {(buyer.email || buyer.phone || dealer.sales || buyer.shipVia) && (
          <div style={{ background: "var(--gray)", borderBottom: "1px solid var(--border)", padding: "7px 28px", display: "flex", gap: 26, flexWrap: "wrap" }}>
            {[buyer.email && ["Cust Email", buyer.email], buyer.phone && ["Phone", buyer.phone], dealer.sales && ["Salesperson", dealer.sales], buyer.shipVia && ["Ship Via", buyer.shipVia]].filter(Boolean).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 5, fontSize: 11 }}>
                <span style={{ color: "var(--text-3)", fontWeight: 500 }}>{(item as string[])[0]}:</span>
                <span style={{ fontWeight: 700 }}>{(item as string[])[1]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Line items table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--black)" }}>
              {["Item", "Type", "Description", "Year", "Condition", "Qty", "Tax", "Price", "Tax Amt", "Discount", "Net Price"].map((h, i) => (
                <th key={i} style={{ padding: "9px 10px", textAlign: i === 10 ? "right" : "left", fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.65)", paddingLeft: i === 0 ? 20 : 10, paddingRight: i === 10 ? 20 : 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lines.map(l => {
              const isNeg = l.type === "TR";
              const subParts = [l.serialized === "Y" && l.sn ? `S/N: ${l.sn}` : "", l.serialized === "N" ? "Not serialized" : "", l.meter ? `Meter: ${l.meter}` : ""].filter(Boolean);
              return (
                <tr key={l.idx} style={{ color: isNeg ? "var(--err)" : "inherit" }}>
                  <td style={{ padding: "10px 10px 10px 20px", color: "var(--text-3)", fontSize: 11 }}>{l.item}</td>
                  <td style={{ padding: "10px 10px" }}><span className={`tbadge t${l.type}`}>{l.type}</span></td>
                  <td style={{ padding: "10px 10px" }}>
                    <div style={{ fontWeight: 700 }}>{l.desc || "N/A"}</div>
                    {subParts.length > 0 && <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1.6, marginTop: 2 }}>{subParts.join(" | ")}</div>}
                  </td>
                  <td style={{ padding: "10px 10px", fontSize: 12 }}>{l.year || "N/A"}</td>
                  <td style={{ padding: "10px 10px", fontSize: 11, color: "var(--text-2)" }}>{l.condition || "N/A"}</td>
                  <td style={{ padding: "10px 10px" }}>{l.qty || 1}</td>
                  <td style={{ padding: "10px 10px", fontWeight: 700 }}>{l.tax}</td>
                  <td style={{ padding: "10px 10px" }}>${fmt(parseFloat(l.price) || 0)}</td>
                  <td style={{ padding: "10px 10px" }}>{parseFloat(l.taxAmt) ? `$${fmt(parseFloat(l.taxAmt))}` : "N/A"}</td>
                  <td style={{ padding: "10px 10px" }}>{parseFloat(l.discount) ? `$${fmt(parseFloat(l.discount))}` : "N/A"}</td>
                  <td style={{ padding: "10px 20px 10px 10px", textAlign: "right", fontWeight: 600 }}>
                    {isNeg ? "(" : ""}${fmt(Math.abs(l.net))}{isNeg ? ")" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--gray)" }}>
              <td colSpan={10} style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700, borderTop: "2px solid var(--border-d)", color: "var(--text-2)" }}>Total:</td>
              <td style={{ padding: "9px 20px 9px 10px", textAlign: "right", fontWeight: 700, borderTop: "2px solid var(--border-d)", fontSize: 14, fontFamily: "var(--fc)" }}>${fmt(grandTotal)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Totals breakdown */}
        <div style={{ padding: "0 28px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 300, border: "1px solid var(--border)", borderRadius: "var(--r)", overflow: "hidden", margin: "14px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 13px", borderBottom: "1px solid var(--border)", fontSize: 12, background: "var(--gray)" }}>
              <span style={{ color: "var(--text-2)" }}>Sub Total:</span>
              <span style={{ fontWeight: 700, fontFamily: "var(--fc)" }}>${fmt(subTotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 13px", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
              <span style={{ color: "var(--text-2)" }}>Total Tax:</span>
              <span style={{ fontWeight: 700, fontFamily: "var(--fc)" }}>${fmt(totalTax)}</span>
            </div>
            {miscFees.filter(f => parseFloat(f.amount) > 0).map(f => (
              <div key={f.idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 13px", borderBottom: "1px solid var(--border)", fontSize: 12 }}>
                <span style={{ color: "var(--text-2)" }}>{f.label || "Fee"}:</span>
                <span style={{ fontWeight: 700, fontFamily: "var(--fc)" }}>${fmt(parseFloat(f.amount) || 0)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 13px", fontSize: 12, background: "var(--black)" }}>
              <span style={{ color: "rgba(255,255,255,.65)", fontWeight: 600 }}>Invoice Total:</span>
              <span style={{ fontFamily: "var(--fc)", fontSize: 17, fontWeight: 900, color: "var(--orange)" }}>${fmt(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Forms of payment */}
        <div style={{ borderTop: "2px solid var(--border-d)" }}>
          <div style={{ background: "var(--gray)", padding: "7px 28px", fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-2)", borderBottom: "1px solid var(--border)" }}>Forms of Payment</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr>
              <th style={{ padding: "7px 10px 7px 20px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>Type</th>
              <th style={{ padding: "7px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>Description</th>
              <th style={{ padding: "7px 20px 7px 10px", textAlign: "right", fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>Amount</th>
            </tr></thead>
            <tbody>
              {validPays.map(p => (
                <tr key={p.idx}><td style={{ padding: "8px 10px 8px 20px", borderBottom: "1px solid var(--gray-2)" }}>{p.type || "N/A"}</td><td style={{ padding: "8px 10px", borderBottom: "1px solid var(--gray-2)" }}>{p.desc}</td><td style={{ padding: "8px 20px 8px 10px", textAlign: "right", fontWeight: 700, borderBottom: "1px solid var(--gray-2)" }}>${fmt(parseFloat(p.amount) || 0)}</td></tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 28px", background: "var(--gray)", borderTop: "2px solid var(--border-d)" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Total Forms of Payment:</span>
            <span style={{ fontSize: 15, fontWeight: 900, fontFamily: "var(--fc)" }}>${fmt(payTotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 28px", background: "var(--black)" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.65)" }}>Balance Due On This Invoice:</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "var(--orange)", fontFamily: "var(--fc)" }}>${fmt(grandTotal)}</span>
          </div>
        </div>

        {/* Schedule strip */}
        {sv > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 28px", borderTop: "1px solid var(--border)", background: matchOk ? "var(--ok-bg)" : "var(--err-bg)" }}>
            <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>WF Equipment Schedule Amount</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: matchOk ? "var(--ok)" : "var(--err)" }}>
              ${fmt(sv)} {matchOk ? "✓ Verified match" : `✗ Mismatch — diff $${fmt(Math.abs(grandTotal - sv))}`}
            </span>
          </div>
        )}

        {/* Footer */}
        <div style={{ background: "var(--gray)", borderTop: "1px solid var(--border)", padding: "8px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Bobcat" style={{ height: 20, opacity: 0.6 }} />
          <span style={{ fontSize: 10, color: "var(--text-3)" }}>Invoice {dealer.invNum} · {fmtDate}</span>
        </div>
      </div>
    </>
  );
}
