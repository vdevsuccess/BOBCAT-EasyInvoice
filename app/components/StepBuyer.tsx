import type { BuyerInfo } from "../lib/types";

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function StepBuyer({ buyer, setBuyer }: { buyer: BuyerInfo; setBuyer: (b: BuyerInfo) => void }) {
  const u = (k: keyof BuyerInfo, v: string | boolean) => setBuyer({ ...buyer, [k]: v });
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-head-left"><span className="ctag">Step 2</span><span className="card-title">Buyer Information</span></div>
        <span style={{ fontSize: 11, background: "#FFF7ED", color: "#C2410C", border: "1px solid #FED7AA", padding: "3px 9px", borderRadius: 3, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" as const }}>Must Match RIF Exactly</span>
      </div>
      <div className="card-body">
        <div className="fg2">
          <div className="f s2">
            <label>Buyer Full Legal Name <span className="r">*</span></label>
            <input value={buyer.name} onChange={e => u("name", e.target.value)} placeholder="Exact name as on Required Information Form (RIF)" />
            <div className="hint">Must match the RIF exactly</div>
          </div>
          <div className="f"><label>Customer ID</label><input value={buyer.custid} onChange={e => u("custid", e.target.value)} placeholder="e.g. GELEASE001" /></div>
          <div className="f"><label>Email</label><input type="email" value={buyer.email} onChange={e => u("email", e.target.value)} /></div>
          <div className="f"><label>Phone</label><input type="tel" value={buyer.phone} onChange={e => u("phone", e.target.value)} /></div>
          <div className="f"><label>Contact Person</label><input value={buyer.contact} onChange={e => u("contact", e.target.value)} /></div>
        </div>
        <hr className="fdiv" />
        <div className="fsub">Bill To Address</div>
        <div className="fg2">
          <div className="f s2"><label>Street <span className="r">*</span></label><input value={buyer.billStreet} onChange={e => u("billStreet", e.target.value)} /></div>
          <div className="f"><label>City <span className="r">*</span></label><input value={buyer.billCity} onChange={e => u("billCity", e.target.value)} /></div>
          <div className="f" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="f">
              <label>State <span className="r">*</span></label>
              <select value={buyer.billState} onChange={e => u("billState", e.target.value)}>
                <option value="">Select...</option>{STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="f"><label>ZIP <span className="r">*</span></label><input value={buyer.billZip} onChange={e => u("billZip", e.target.value)} maxLength={10} /></div>
          </div>
        </div>
        <hr className="fdiv" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11, flexWrap: "wrap" as const, gap: 7 }}>
          <div className="fsub" style={{ marginBottom: 0, flex: 1 }}>Ship To Address</div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "var(--text-2)", fontWeight: 600 }}>
            <input type="checkbox" checked={buyer.sameAddress} onChange={e => u("sameAddress", e.target.checked)} style={{ width: 14, height: 14, accentColor: "var(--orange)", padding: 0 }} />
            Same as Bill To
          </label>
        </div>
        {!buyer.sameAddress && (
          <div className="fg2">
            <div className="f s2"><label>Street <span className="r">*</span></label><input value={buyer.shipStreet} onChange={e => u("shipStreet", e.target.value)} /></div>
            <div className="f"><label>City <span className="r">*</span></label><input value={buyer.shipCity} onChange={e => u("shipCity", e.target.value)} /></div>
            <div className="f" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="f">
                <label>State <span className="r">*</span></label>
                <select value={buyer.shipState} onChange={e => u("shipState", e.target.value)}>
                  <option value="">Select...</option>{STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="f"><label>ZIP <span className="r">*</span></label><input value={buyer.shipZip} onChange={e => u("shipZip", e.target.value)} maxLength={10} /></div>
            </div>
          </div>
        )}
        <div style={{ marginTop: 11, display: "flex", alignItems: "center", gap: 9 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase" as const, letterSpacing: ".04em", whiteSpace: "nowrap" as const }}>Ship Via:</label>
          <input value={buyer.shipVia} onChange={e => u("shipVia", e.target.value)} placeholder="e.g. DELIVERY, PICK-UP" style={{ maxWidth: 250 }} />
        </div>
      </div>
    </div>
  );
}
