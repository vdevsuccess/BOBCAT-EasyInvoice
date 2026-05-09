import type { DealerInfo } from "../lib/types";

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function StepDealer({ dealer, setDealer }: { dealer: DealerInfo; setDealer: (d: DealerInfo) => void }) {
  const u = (k: keyof DealerInfo, v: string) => setDealer({ ...dealer, [k]: v });
  return (
    <div className="card">
      <div className="card-head">
        <div className="card-head-left"><span className="ctag">Step 1</span><span className="card-title">Dealer Information</span></div>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}><span style={{ color: "var(--err)" }}>*</span> Required</span>
      </div>
      <div className="card-body">
        <div className="fg2">
          <div className="f s2"><label>Dealer / Business Name <span className="r">*</span></label><input value={dealer.name} onChange={e => u("name", e.target.value)} placeholder="Legal business name" /></div>
          <div className="f"><label>Dealer Code <span className="o">(opt)</span></label><input value={dealer.code} onChange={e => u("code", e.target.value)} placeholder="e.g. D-10042" /></div>
          <div className="f"><label>Phone</label><input type="tel" value={dealer.phone} onChange={e => u("phone", e.target.value)} placeholder="(555) 400-1200" /></div>
          <div className="f"><label>Fax</label><input value={dealer.fax} onChange={e => u("fax", e.target.value)} placeholder="(555) 400-1201" /></div>
          <div className="f"><label>Email</label><input type="email" value={dealer.email} onChange={e => u("email", e.target.value)} placeholder="info@dealer.com" /></div>
          <div className="f"><label>Website</label><input value={dealer.web} onChange={e => u("web", e.target.value)} placeholder="www.dealer.com" /></div>
        </div>
        <hr className="fdiv" />
        <div className="fsub">Dealer Address</div>
        <div className="fg2">
          <div className="f s2"><label>Street <span className="r">*</span></label><input value={dealer.street} onChange={e => u("street", e.target.value)} /></div>
          <div className="f"><label>City <span className="r">*</span></label><input value={dealer.city} onChange={e => u("city", e.target.value)} /></div>
          <div className="f" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="f">
              <label>State <span className="r">*</span></label>
              <select value={dealer.state} onChange={e => u("state", e.target.value)}>
                <option value="">Select...</option>
                {STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="f"><label>ZIP <span className="r">*</span></label><input value={dealer.zip} onChange={e => u("zip", e.target.value)} maxLength={10} /></div>
          </div>
        </div>
        <hr className="fdiv" />
        <div className="fsub">Invoice Details</div>
        <div className="fg4">
          <div className="f"><label>Invoice # <span className="r">*</span></label><input value={dealer.invNum} onChange={e => u("invNum", e.target.value)} placeholder="01-607907" /></div>
          <div className="f"><label>Date <span className="r">*</span></label><input type="date" value={dealer.invDate} onChange={e => u("invDate", e.target.value)} /></div>
          <div className="f"><label>PO # <span className="o">(opt)</span></label><input value={dealer.po} onChange={e => u("po", e.target.value)} /></div>
          <div className="f"><label>Salesperson <span className="o">(opt)</span></label><input value={dealer.sales} onChange={e => u("sales", e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}
