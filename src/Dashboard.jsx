import { useState, useEffect, useCallback } from "react";

/* ── Backend (Spring Boot) agent marketplace API ── */
const AGENT_API = "https://bsnjavabackend.onrender.com/api/agents";

/* Per-agent visual accents (backend supplies the rest). */
const META = {
  "investment":   { accent:"#10b981", accentBg:"rgba(16,185,129,.07)" },
  "3d-world":     { accent:"#38bdf8", accentBg:"rgba(56,189,248,.07)" },
  "ops":          { accent:"#a78bfa", accentBg:"rgba(167,139,250,.07)" },
  "digital-twin": { accent:"#f59e0b", accentBg:"rgba(245,158,11,.07)" },
  "ocean":        { accent:"#22d3ee", accentBg:"rgba(34,211,238,.07)" },
  "multiverse":   { accent:"#c084fc", accentBg:"rgba(192,132,252,.07)" },
};
const TAG_STYLE = {
  LIVE:     { c:"#10b981", bg:"rgba(16,185,129,.15)" },
  BETA:     { c:"#38bdf8", bg:"rgba(56,189,248,.15)" },
  RESEARCH: { c:"#22d3ee", bg:"rgba(34,211,238,.15)" },
  SOON:     { c:"#c084fc", bg:"rgba(192,132,252,.15)" },
};

/* Offline fallback if the backend is unreachable. */
const FALLBACK_AGENTS = [
  { id:"investment", icon:"📊", name:"Investment Analyzer", tag:"LIVE",
    description:"AI-powered analysis of investment memos, pitch decks & financials. Confidence scores, risk flags, and follow-up questions instantly.",
    features:["Confidence scoring","Risk & red-flag detection","Follow-up questions"], priceInr:4999, purchasable:true, purchaseStatus:"NONE", owned:false, deployed:false },
  { id:"3d-world", icon:"🌐", name:"3D World Architect", tag:"BETA",
    description:"Design, simulate and deploy immersive 3D business environments. Build photorealistic digital twins of your operations.",
    features:["Virtual environment builder","Real-time physics sim","Export to Unity / Unreal"], priceInr:14999, purchasable:true, purchaseStatus:"NONE", owned:false, deployed:false },
  { id:"ops", icon:"🤖", name:"Autonomous Ops Agent", tag:"LIVE",
    description:"Deploy intelligent agents that automate operations end-to-end — procurement, scheduling, reporting — slashing costs by 70%+.",
    features:["Workflow automation","Cost reduction analytics","24/7 agent monitoring"], priceInr:9999, purchasable:true, purchaseStatus:"NONE", owned:false, deployed:false },
  { id:"digital-twin", icon:"♾️", name:"Digital Twin Engine", tag:"BETA",
    description:"Create real-time AI digital twins for any industry — manufacturing, healthcare, logistics — and run predictive simulations.",
    features:["Real-time sensor sync","Predictive failure modeling","Industry templates"], priceInr:12999, purchasable:true, purchaseStatus:"NONE", owned:false, deployed:false },
  { id:"ocean", icon:"🌊", name:"Ocean Revival Agent", tag:"RESEARCH",
    description:"Monitor marine ecosystems, coordinate AI-guided ocean cleanup fleets, and track real-time health metrics globally.",
    features:["Satellite data ingestion","Cleanup fleet coordination","Ecosystem health reports"], priceInr:0, purchasable:false, purchaseStatus:"NONE", owned:false, deployed:false },
  { id:"multiverse", icon:"🌌", name:"Multiverse Explorer", tag:"SOON",
    description:"Theoretical AI research into consciousness across dimensions. Access multiverse simulations and emotion-driven energy mappings.",
    features:["Consciousness mapping AI","Dimension-shift modeling","Research paper access"], priceInr:0, purchasable:false, purchaseStatus:"NONE", owned:false, deployed:false },
];

const NAV = [
  { id:"overview", icon:"⊞", label:"Overview"       },
  { id:"agents",   icon:"⬡", label:"Marketplace"    },
  { id:"impact",   icon:"✦", label:"Mission Impact" },
  { id:"profile",  icon:"◎", label:"My Profile"     },
];

const STATS = [
  { value:"70%+", label:"Cost Reduction",   icon:"📉", color:"#10b981" },
  { value:"10%",  label:"Profits→Research", icon:"🧬", color:"#38bdf8" },
  { value:"4",    label:"Research Pillars", icon:"🌊", color:"#a78bfa" },
  { value:"∞",    label:"Multiverse Reach", icon:"🌌", color:"#f59e0b" },
];

const HOME = import.meta.env.BASE_URL || "/";
const fmtINR = n => "₹" + Number(n || 0).toLocaleString("en-IN");

function useWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise(res => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => res(true);
    s.onerror = () => res(false);
    document.head.appendChild(s);
  });
}

/* Opens Google Calendar with a pre-filled 30-min BSN demo. */
function bookDemo(agentName) {
  const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
  start.setMinutes(0, 0, 0);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = d => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `BSN Demo — ${agentName || "AI Agents"}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `30-minute walkthrough of the ${agentName || "BSN AI"} agent with the BSN team.`,
    add: "aryan.datta.940@gmail.com",
  });
  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, "_blank");
}

function AgentCard({ agent, busy, onBuy, onDeploy, onKnow }) {
  const m = META[agent.id] || { accent:"#38bdf8", accentBg:"rgba(56,189,248,.07)" };
  const tag = TAG_STYLE[agent.tag] || TAG_STYLE.BETA;
  const [hov, setHov] = useState(false);
  const soon = agent.tag === "SOON";
  const isBusy = busy === agent.id;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:"rgba(2,11,18,.88)",
        border:`1px solid ${hov ? m.accent+"55" : m.accent+"22"}`,
        borderRadius:16, padding:"22px",
        display:"flex", flexDirection:"column", gap:13,
        position:"relative", overflow:"hidden",
        transition:"border-color .2s,transform .2s,box-shadow .2s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 12px 40px ${m.accent}18` : "none",
      }}
    >
      <div style={{position:"absolute",top:0,left:"15%",right:"15%",height:1,background:`linear-gradient(90deg,transparent,${m.accent}44,transparent)`}}/>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
        <div style={{width:44,height:44,borderRadius:12,background:m.accentBg,border:`1px solid ${m.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{agent.icon}</div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
          <span style={{padding:"3px 9px",borderRadius:100,fontSize:9,fontWeight:700,letterSpacing:"1.5px",background:tag.bg,color:tag.c,border:`1px solid ${tag.c}33`,whiteSpace:"nowrap"}}>{agent.tag}</span>
          {agent.deployed && (
            <span style={{padding:"3px 9px",borderRadius:100,fontSize:9,fontWeight:700,letterSpacing:"1px",background:"rgba(16,185,129,.14)",color:"#34d399",border:"1px solid rgba(16,185,129,.3)",whiteSpace:"nowrap"}}>● DEPLOYED</span>
          )}
          {agent.owned && !agent.deployed && (
            <span style={{padding:"3px 9px",borderRadius:100,fontSize:9,fontWeight:700,letterSpacing:"1px",background:"rgba(56,189,248,.14)",color:"#38bdf8",border:"1px solid rgba(56,189,248,.3)",whiteSpace:"nowrap"}}>OWNED</span>
          )}
        </div>
      </div>

      <div>
        <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:5}}>{agent.name}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.4)",lineHeight:1.65}}>{agent.description}</div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {(agent.features || []).map(f => (
          <div key={f} style={{display:"flex",alignItems:"center",gap:7,fontSize:11,color:"rgba(255,255,255,.32)"}}>
            <span style={{color:m.accent}}>→</span>{f}
          </div>
        ))}
      </div>

      {/* price row */}
      <div style={{display:"flex",alignItems:"baseline",gap:6,marginTop:2}}>
        {agent.purchasable ? (
          <>
            <span style={{fontSize:18,fontWeight:800,color:"#fff",letterSpacing:"-.5px"}}>{fmtINR(agent.priceInr)}</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,.32)"}}>one-time</span>
          </>
        ) : (
          <span style={{fontSize:12,fontWeight:600,color:tag.c}}>{soon ? "Coming soon" : "Research access"}</span>
        )}
      </div>

      {agent.deployed && agent.deployUrl && (
        <a href={agent.deployUrl} target="_blank" rel="noreferrer"
          style={{fontSize:11,color:"#34d399",textDecoration:"none",wordBreak:"break-all",padding:"6px 10px",borderRadius:8,background:"rgba(16,185,129,.06)",border:"1px solid rgba(16,185,129,.18)"}}>
          🔗 {agent.deployUrl}
        </a>
      )}

      {/* actions */}
      <div style={{marginTop:"auto",display:"flex",flexDirection:"column",gap:8}}>
        {agent.purchasable && !agent.owned && (
          <button disabled={isBusy} onClick={() => onBuy(agent)}
            style={{padding:"10px 14px",borderRadius:9,background:`${m.accent}1f`,border:`1px solid ${m.accent}55`,color:m.accent,fontSize:12,fontWeight:700,cursor:isBusy?"wait":"pointer",transition:"all .18s"}}
            onMouseEnter={e=>{if(!isBusy)e.currentTarget.style.background=m.accent+"33"}}
            onMouseLeave={e=>{e.currentTarget.style.background=m.accent+"1f"}}>
            {isBusy ? "Processing…" : `Buy ${fmtINR(agent.priceInr)} →`}
          </button>
        )}

        {agent.owned && !agent.deployed && (
          <button disabled={isBusy} onClick={() => onDeploy(agent)}
            style={{padding:"10px 14px",borderRadius:9,background:"linear-gradient(90deg,#34d399,#38bdf8)",border:"none",color:"#04140e",fontSize:12,fontWeight:700,cursor:isBusy?"wait":"pointer"}}>
            {isBusy ? "Deploying…" : "Deploy Agent ⚡"}
          </button>
        )}

        {agent.deployed && (
          <a href={agent.deployUrl || "#"} target="_blank" rel="noreferrer"
            style={{padding:"10px 14px",borderRadius:9,background:"rgba(16,185,129,.12)",border:"1px solid rgba(16,185,129,.35)",color:"#34d399",fontSize:12,fontWeight:700,textAlign:"center",textDecoration:"none"}}>
            Open Agent →
          </a>
        )}

        <div style={{display:"flex",gap:8}}>
          <button onClick={() => onKnow(agent)}
            style={{flex:1,padding:"8px 10px",borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.62)",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .18s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>
            Know More
          </button>
          <button onClick={() => bookDemo(agent.name)}
            style={{flex:1,padding:"8px 10px",borderRadius:9,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.62)",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .18s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}>
            Book Demo
          </button>
        </div>
      </div>
    </div>
  );
}

function KnowMoreModal({ agent, onClose, onBuy, onDeploy, busy }) {
  if (!agent) return null;
  const m = META[agent.id] || { accent:"#38bdf8", accentBg:"rgba(56,189,248,.07)" };
  const isBusy = busy === agent.id;
  return (
    <div onClick={onClose}
      style={{position:"fixed",inset:0,zIndex:300,background:"rgba(2,8,14,.78)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div onClick={e=>e.stopPropagation()}
        style={{maxWidth:520,width:"100%",borderRadius:20,padding:"28px",background:"linear-gradient(155deg,#0b1622,#070d14)",border:`1px solid ${m.accent}33`,boxShadow:"0 30px 80px rgba(0,0,0,.55)",position:"relative",maxHeight:"88vh",overflowY:"auto"}}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:14}}>✕</button>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
          <div style={{width:54,height:54,borderRadius:14,background:m.accentBg,border:`1px solid ${m.accent}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{agent.icon}</div>
          <div>
            <div style={{fontSize:19,fontWeight:700,color:"#fff"}}>{agent.name}</div>
            <div style={{fontSize:11,color:m.accent,letterSpacing:"1px",fontWeight:600,marginTop:2}}>{agent.tag}{agent.purchasable?` · ${fmtINR(agent.priceInr)}`:""}</div>
          </div>
        </div>
        <p style={{fontSize:13,color:"rgba(255,255,255,.55)",lineHeight:1.7,marginBottom:20}}>{agent.description}</p>
        <div style={{fontSize:10,letterSpacing:"1.5px",color:"rgba(255,255,255,.3)",fontWeight:600,marginBottom:10}}>WHAT'S INCLUDED</div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:24}}>
          {(agent.features || []).map(f => (
            <div key={f} style={{display:"flex",alignItems:"center",gap:9,fontSize:13,color:"rgba(255,255,255,.7)"}}>
              <span style={{color:m.accent,fontWeight:700}}>→</span>{f}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {agent.purchasable && !agent.owned && (
            <button disabled={isBusy} onClick={() => onBuy(agent)}
              style={{flex:1,minWidth:160,padding:"12px",borderRadius:10,background:"linear-gradient(90deg,#34d399,#38bdf8)",border:"none",color:"#04140e",fontSize:13,fontWeight:700,cursor:isBusy?"wait":"pointer"}}>
              {isBusy ? "Processing…" : `Buy ${fmtINR(agent.priceInr)}`}
            </button>
          )}
          {agent.owned && !agent.deployed && (
            <button disabled={isBusy} onClick={() => onDeploy(agent)}
              style={{flex:1,minWidth:160,padding:"12px",borderRadius:10,background:"linear-gradient(90deg,#34d399,#38bdf8)",border:"none",color:"#04140e",fontSize:13,fontWeight:700,cursor:isBusy?"wait":"pointer"}}>
              {isBusy ? "Deploying…" : "Deploy Agent ⚡"}
            </button>
          )}
          {agent.deployed && agent.deployUrl && (
            <a href={agent.deployUrl} target="_blank" rel="noreferrer"
              style={{flex:1,minWidth:160,padding:"12px",borderRadius:10,background:"rgba(16,185,129,.12)",border:"1px solid rgba(16,185,129,.35)",color:"#34d399",fontSize:13,fontWeight:700,textAlign:"center",textDecoration:"none"}}>
              Open Agent →
            </a>
          )}
          <button onClick={() => bookDemo(agent.name)}
            style={{flex:1,minWidth:160,padding:"12px",borderRadius:10,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.12)",color:"rgba(255,255,255,.72)",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            Book a Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser]   = useState(null);
  const [tab,  setTab]    = useState("overview");
  const [agents, setAgents] = useState(FALLBACK_AGENTS);
  const [busy, setBusy]   = useState(null);     // agentId currently processing
  const [know, setKnow]   = useState(null);     // agent shown in Know-More modal
  const [chooser, setChooser] = useState(null); // agent shown in payment-method chooser
  const [paypal, setPaypal]   = useState(null); // agent awaiting PayPal.me confirmation
  const [toast, setToast] = useState(null);
  const w      = useWidth();
  const mobile = w < 768;
  const tablet = w >= 768 && w < 1100;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bsnUser") || "null");
    if (!saved?.email) { window.location.href = HOME; return; }
    setUser(saved);
  }, []);

  const refreshAgents = useCallback(async (email) => {
    try {
      const r = await fetch(`${AGENT_API}?email=${encodeURIComponent(email)}`);
      if (!r.ok) throw new Error("bad status");
      const data = await r.json();
      if (Array.isArray(data) && data.length) setAgents(data);
    } catch (_) {
      /* keep fallback list — backend may be cold-starting */
    }
  }, []);

  useEffect(() => { if (user?.email) refreshAgents(user.email); }, [user, refreshAgents]);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  const logout = useCallback(() => {
    localStorage.removeItem("bsnUser");
    window.location.href = HOME;
  }, []);

  const buyAgent = useCallback(async (agent) => {
    if (!user?.email) { window.location.href = HOME; return; }
    setBusy(agent.id);
    try {
      const oRes = await fetch(`${AGENT_API}/order`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email:user.email, agentId:agent.id }),
      });
      const order = await oRes.json();
      if (!oRes.ok) { flash(order.message || "Could not start payment."); setBusy(null); return; }

      const ok = await loadRazorpay();
      if (!ok) { flash("Could not load Razorpay checkout."); setBusy(null); return; }

      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: order.orderId,
        name: `BSN — ${order.agentName}`,
        description: "AI Agent — one-time purchase",
        prefill: { email:user.email, name:user.name || user.fullName || "" },
        theme: { color:"#34d399" },
        modal: { ondismiss: () => setBusy(null) },
        handler: async (resp) => {
          try {
            const vRes = await fetch(`${AGENT_API}/verify`, {
              method:"POST", headers:{ "Content-Type":"application/json" },
              body: JSON.stringify({
                email: user.email,
                agentId: agent.id,
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              }),
            });
            if (vRes.ok) { await refreshAgents(user.email); flash(`✅ ${agent.name} purchased — deploy it anytime.`); }
            else { const e = await vRes.json(); flash(e.message || "Payment verification failed."); }
          } finally { setBusy(null); }
        },
      });
      rzp.open();
    } catch (_) {
      flash("Payment setup failed. Please try again.");
      setBusy(null);
    }
  }, [user, refreshAgents]);

  const deployAgent = useCallback(async (agent) => {
    if (!user?.email) return;
    setBusy(agent.id);
    try {
      const r = await fetch(`${AGENT_API}/deploy`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email:user.email, agentId:agent.id }),
      });
      if (r.ok) { await refreshAgents(user.email); flash(`⚡ ${agent.name} deployed.`); }
      else { const e = await r.json(); flash(e.message || "Deploy failed."); }
    } catch (_) {
      flash("Could not reach the backend. Try again shortly.");
    } finally { setBusy(null); }
  }, [user, refreshAgents]);

  /* open the payment-method chooser */
  const startPurchase = useCallback((agent) => { setKnow(null); setChooser(agent); }, []);

  /* PayPal.me: open the pre-filled pay link, then await manual confirmation */
  const payWithPaypal = useCallback(async (agent) => {
    if (!user?.email) { window.location.href = HOME; return; }
    setChooser(null);
    setBusy(agent.id);
    try {
      const r = await fetch(`${AGENT_API}/paypal/checkout`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email:user.email, agentId:agent.id }),
      });
      const data = await r.json();
      if (!r.ok || !data.payUrl) { flash(data.message || "Could not start PayPal checkout."); return; }
      window.open(data.payUrl, "_blank", "noopener");
      setPaypal({ ...agent, payUrl:data.payUrl });
    } catch (_) {
      flash("Could not reach the backend. Try again shortly.");
    } finally { setBusy(null); }
  }, [user]);

  const confirmPaypal = useCallback(async (agent) => {
    if (!user?.email) return;
    setBusy(agent.id);
    try {
      const r = await fetch(`${AGENT_API}/paypal/confirm`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ email:user.email, agentId:agent.id }),
      });
      if (r.ok) { await refreshAgents(user.email); flash(`✅ ${agent.name} unlocked — deploy it anytime.`); setPaypal(null); }
      else { const e = await r.json(); flash(e.message || "Could not confirm payment."); }
    } catch (_) {
      flash("Could not reach the backend. Try again shortly.");
    } finally { setBusy(null); }
  }, [user, refreshAgents]);

  if (!user) return null;

  const displayName = user.name || user.fullName || "User";
  const firstName   = displayName.split(" ")[0];
  const initials    = displayName.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase();
  const agentCols   = mobile ? "1fr" : tablet ? "repeat(2,1fr)" : "repeat(3,1fr)";
  const statCols    = mobile ? "repeat(2,1fr)" : "repeat(4,1fr)";
  const ownedCount  = agents.filter(a => a.owned).length;
  const deployedCount = agents.filter(a => a.deployed).length;

  function AvatarImg({ size=34 }) {
    return (
      <div style={{width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,#082640,#1254a4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.36,fontWeight:700,flexShrink:0,overflow:"hidden",border:"2px solid rgba(56,189,248,.28)"}}>
        {user.picture ? <img src={user.picture} alt={displayName} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : initials}
      </div>
    );
  }

  const gridProps = { busy, onBuy:startPurchase, onDeploy:deployAgent, onKnow:setKnow };

  /* ── SIDEBAR ── */
  const Sidebar = () => (
    <aside style={{width:220,boxSizing:"border-box",borderRight:"1px solid rgba(14,165,233,.1)",background:"rgba(2,11,18,.92)",backdropFilter:"blur(24px)",display:"flex",flexDirection:"column",padding:"24px 0",position:"fixed",top:0,left:0,bottom:0,zIndex:120,overflowY:"auto"}}>
      <a href={HOME} style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none",padding:"0 18px",marginBottom:28}}>
        <img src="/logo.png" alt="BSN" style={{height:28,filter:"drop-shadow(0 0 10px rgba(16,185,129,.6))"}}/>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#34d399"}}>BSN</div>
          <div style={{fontSize:7,letterSpacing:"2.5px",color:"rgba(255,255,255,.22)"}}>AI DASHBOARD</div>
        </div>
      </a>
      <nav style={{flex:1,display:"flex",flexDirection:"column",gap:3,padding:"0 8px"}}>
        {NAV.map(item => {
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={()=>setTab(item.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:active?"rgba(14,165,233,.12)":"transparent",border:active?"1px solid rgba(14,165,233,.22)":"1px solid transparent",color:active?"#38bdf8":"rgba(255,255,255,.42)",fontSize:13,fontWeight:active?600:400,cursor:"pointer",textAlign:"left",transition:"all .16s"}}
              onMouseEnter={e=>{if(!active)e.currentTarget.style.background="rgba(255,255,255,.04)"}}
              onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent"}}
            ><span style={{fontSize:13}}>{item.icon}</span>{item.label}</button>
          );
        })}
      </nav>
      <div style={{margin:"0 8px",padding:"12px",borderRadius:12,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
          <AvatarImg size={32}/>
          <div style={{overflow:"hidden"}}>
            <div style={{fontSize:12,fontWeight:600,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{displayName}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.28)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.email}</div>
          </div>
        </div>
        <button onClick={logout} style={{width:"100%",padding:"7px 10px",borderRadius:8,background:"rgba(239,68,68,.07)",border:"1px solid rgba(239,68,68,.2)",color:"rgba(239,68,68,.7)",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .18s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.14)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,.07)"}
        >Log Out</button>
      </div>
    </aside>
  );

  /* ── MOBILE HEADER ── */
  const MobileHeader = () => (
    <header style={{position:"sticky",top:0,zIndex:100,height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",background:"rgba(2,11,18,.96)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(14,165,233,.1)"}}>
      <a href={HOME} style={{display:"flex",alignItems:"center",gap:8,textDecoration:"none"}}>
        <img src="/logo.png" alt="BSN" style={{height:26,filter:"drop-shadow(0 0 8px rgba(16,185,129,.6))"}}/>
        <span style={{fontSize:14,fontWeight:700,color:"#34d399"}}>BSN</span>
      </a>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>{firstName}</span>
        <AvatarImg size={30}/>
      </div>
    </header>
  );

  /* ── BOTTOM NAV ── */
  const BottomNav = () => (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,height:60,display:"flex",alignItems:"stretch",background:"rgba(2,11,18,.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(14,165,233,.12)"}}>
      {NAV.map(item => {
        const active = tab === item.id;
        return (
          <button key={item.id} onClick={()=>setTab(item.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:active?"#38bdf8":"rgba(255,255,255,.32)",borderTop:active?"2px solid #38bdf8":"2px solid transparent",transition:"all .16s"}}>
            <span style={{fontSize:16}}>{item.icon}</span>
            <span style={{fontSize:9,fontWeight:active?600:400,letterSpacing:".5px"}}>{item.label.split(" ")[0]}</span>
          </button>
        );
      })}
    </nav>
  );

  /* ── TAB: OVERVIEW ── */
  const Overview = () => (
    <div>
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <span style={{fontSize:10,letterSpacing:"2px",color:"rgba(56,189,248,.65)",fontWeight:600}}>WELCOME BACK</span>
          <span style={{width:24,height:1,background:"rgba(56,189,248,.3)"}}/>
        </div>
        <h1 style={{fontSize:mobile?22:26,fontWeight:700,letterSpacing:"-.5px"}}>
          Hello, <span style={{background:"linear-gradient(90deg,#34d399,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{firstName}</span> 👋
        </h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,.35)",marginTop:5}}>
          {ownedCount > 0 ? `You own ${ownedCount} agent${ownedCount>1?"s":""} · ${deployedCount} deployed.` : "Browse the marketplace and deploy your first AI agent."}
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:statCols,gap:12,marginBottom:32}}>
        {STATS.map(s=>(
          <div key={s.label} style={{padding:"18px 16px",borderRadius:14,background:"rgba(2,11,18,.8)",border:`1px solid ${s.color}22`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:"20%",right:"20%",height:1,background:`linear-gradient(90deg,transparent,${s.color}44,transparent)`}}/>
            <div style={{fontSize:22}}>{s.icon}</div>
            <div style={{fontSize:mobile?22:26,fontWeight:800,color:s.color,letterSpacing:"-1px",marginTop:8}}>{s.value}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:"1px",marginTop:1}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <h2 style={{fontSize:15,fontWeight:700}}>Agent Marketplace</h2>
        <button onClick={()=>setTab("agents")} style={{fontSize:11,color:"#38bdf8",background:"none",border:"none",cursor:"pointer",fontWeight:600}}>VIEW ALL →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:agentCols,gap:14}}>
        {agents.map(a=><AgentCard key={a.id} agent={a} {...gridProps}/>)}
      </div>
    </div>
  );

  /* ── TAB: MARKETPLACE ── */
  const Agents = () => (
    <div>
      <div style={{marginBottom:28}}>
        <span style={{fontSize:10,letterSpacing:"2px",color:"rgba(56,189,248,.65)",fontWeight:600}}>BUY · DEPLOY · BOOK</span>
        <h1 style={{fontSize:mobile?22:24,fontWeight:700,marginTop:6}}>AI Agent Marketplace</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,.35)",marginTop:5,maxWidth:500,lineHeight:1.7}}>Buy an agent with secure Razorpay checkout, deploy it in one click, or book a demo first. 10% of every purchase funds our research mission.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:agentCols,gap:16}}>
        {agents.map(a=><AgentCard key={a.id} agent={a} {...gridProps}/>)}
      </div>
    </div>
  );

  /* ── TAB: IMPACT ── */
  const PILLARS = [
    {icon:"🧬",title:"Biotechnology",color:"#34d399",desc:"Innovative biotech that recycles plastics, cleans oceans, and restores marine ecosystems at global scale.",pct:34},
    {icon:"🌊",title:"Ocean Revival",color:"#22d3ee",desc:"AI-guided cleanup fleets and nature-based technologies to heal our blue planet for generations.",pct:22},
    {icon:"🧘",title:"Emotion-Driven Energies",color:"#a78bfa",desc:"Scientific exploration of higher emotional states and emotion-driven energies made universally accessible.",pct:18},
    {icon:"🌌",title:"Universe & Multiverse",color:"#f59e0b",desc:"Theoretical research into consciousness across dimensions and multiversal pathways.",pct:26},
  ];
  const Impact = () => (
    <div>
      <div style={{marginBottom:28}}>
        <span style={{fontSize:10,letterSpacing:"2px",color:"rgba(16,185,129,.65)",fontWeight:600}}>THE BIGGER PICTURE</span>
        <h1 style={{fontSize:mobile?22:24,fontWeight:700,marginTop:6}}>Mission Impact</h1>
        <p style={{fontSize:13,color:"rgba(255,255,255,.35)",marginTop:5,lineHeight:1.7,maxWidth:480}}>Every rupee generated funds four pioneering research pillars.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"repeat(2,1fr)",gap:16,marginBottom:20}}>
        {PILLARS.map(p=>(
          <div key={p.title} style={{padding:"22px",borderRadius:16,background:"rgba(2,11,18,.8)",border:`1px solid ${p.color}22`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:"15%",right:"15%",height:1,background:`linear-gradient(90deg,transparent,${p.color}55,transparent)`}}/>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <span style={{fontSize:28}}>{p.icon}</span>
              <div><div style={{fontSize:14,fontWeight:700}}>{p.title}</div><div style={{fontSize:9,color:p.color,letterSpacing:"1px",fontWeight:600}}>RESEARCH PILLAR</div></div>
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,.38)",lineHeight:1.65,marginBottom:14}}>{p.desc}</p>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:9,color:"rgba(255,255,255,.28)",letterSpacing:"1px"}}>FUNDING</span>
              <span style={{fontSize:12,fontWeight:700,color:p.color}}>{p.pct}%</span>
            </div>
            <div style={{height:4,borderRadius:4,background:"rgba(255,255,255,.06)"}}>
              <div style={{height:"100%",width:`${p.pct}%`,background:`linear-gradient(90deg,${p.color}88,${p.color})`,borderRadius:4}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"20px 22px",borderRadius:14,background:"rgba(16,185,129,.06)",border:"1px solid rgba(16,185,129,.15)",display:"flex",alignItems:"center",gap:16}}>
        <span style={{fontSize:32,flexShrink:0}}>🌱</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>10% of all revenue goes directly to research</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.38)",lineHeight:1.6}}>When you buy or use any agent, you automatically fund ocean cleanup, biotech breakthroughs, and multiverse research.</div>
        </div>
      </div>
    </div>
  );

  /* ── TAB: PROFILE ── */
  const Profile = () => (
    <div>
      <div style={{marginBottom:28}}>
        <span style={{fontSize:10,letterSpacing:"2px",color:"rgba(56,189,248,.65)",fontWeight:600}}>ACCOUNT</span>
        <h1 style={{fontSize:mobile?22:24,fontWeight:700,marginTop:6}}>My Profile</h1>
      </div>
      <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 2fr",gap:18,alignItems:"start"}}>
        <div style={{padding:"28px 20px",borderRadius:16,textAlign:"center",background:"rgba(2,11,18,.8)",border:"1px solid rgba(14,165,233,.12)"}}>
          <div style={{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#082640,#1254a4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:700,margin:"0 auto 14px",overflow:"hidden",border:"2px solid rgba(56,189,248,.3)"}}>
            {user.picture ? <img src={user.picture} alt={displayName} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : initials}
          </div>
          <div style={{fontSize:16,fontWeight:700}}>{displayName}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.32)",marginTop:3,wordBreak:"break-all"}}>{user.email}</div>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:6,marginTop:12}}>
            <span style={{padding:"3px 10px",borderRadius:100,background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.25)",fontSize:9,fontWeight:700,letterSpacing:"1.5px",color:"#34d399",display:"inline-flex",alignItems:"center",gap:5}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:"#10b981",boxShadow:"0 0 5px #10b981"}}/>ACTIVE
            </span>
            {user.authProvider==="google" && (
              <span style={{padding:"3px 10px",borderRadius:100,background:"rgba(66,133,244,.1)",border:"1px solid rgba(66,133,244,.25)",fontSize:9,fontWeight:700,letterSpacing:"1.5px",color:"#4285F4"}}>Google</span>
            )}
          </div>
          <div style={{marginTop:16,paddingTop:14,borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-around"}}>
            <div><div style={{fontSize:20,fontWeight:800,color:"#34d399"}}>{ownedCount}</div><div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"1px"}}>OWNED</div></div>
            <div><div style={{fontSize:20,fontWeight:800,color:"#38bdf8"}}>{deployedCount}</div><div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"1px"}}>DEPLOYED</div></div>
          </div>
        </div>
        <div style={{padding:mobile?"20px":"24px",borderRadius:16,background:"rgba(2,11,18,.8)",border:"1px solid rgba(14,165,233,.12)"}}>
          <div style={{fontSize:11,fontWeight:600,letterSpacing:"1px",color:"rgba(255,255,255,.28)",marginBottom:16}}>ACCOUNT DETAILS</div>
          {[
            {label:"Full Name",  value:displayName},
            {label:"Email",      value:user.email},
            {label:"Role",       value:user.role||(user.authProvider==="google"?"Google User":"Member")},
            {label:"Looking For",value:user.lookingFor||(user.authProvider==="google"?"BSN Platform Access":"—")},
            {label:"Phone",      value:user.phone||"—"},
            {label:"Auth Method",value:user.authProvider==="google"?"Google OAuth":"Email & Password"},
          ].map(row=>(
            <div key={row.label} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,padding:"11px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <span style={{fontSize:11,color:"rgba(255,255,255,.3)",flexShrink:0}}>{row.label}</span>
              <span style={{fontSize:12,color:"rgba(255,255,255,.78)",fontWeight:500,textAlign:"right",wordBreak:"break-word",maxWidth:"60%"}}>{row.value}</span>
            </div>
          ))}
          <button onClick={logout} style={{marginTop:20,width:"100%",padding:"10px",borderRadius:10,background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.22)",color:"rgba(239,68,68,.8)",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.16)"}
            onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,.08)"}
          >Log Out</button>
        </div>
      </div>
    </div>
  );

  const tabs = { overview:<Overview/>, agents:<Agents/>, impact:<Impact/>, profile:<Profile/> };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#030d0a 0%,#020b10 50%,#030d0a 100%)",fontFamily:"'Inter',system-ui,sans-serif",color:"#fff",cursor:"auto",display:"flex",flexDirection:mobile?"column":"row"}}>
      {!mobile && <Sidebar/>}
      {mobile  && <MobileHeader/>}
      <main style={{flex:1,minWidth:0,marginLeft:mobile?0:220,overflowY:"auto",padding:mobile?"20px 16px 80px":tablet?"28px 28px":"36px 40px",position:"relative",zIndex:1}}>
        {tabs[tab]}
      </main>
      {mobile && <BottomNav/>}

      <KnowMoreModal agent={know} onClose={()=>setKnow(null)} onBuy={startPurchase} onDeploy={deployAgent} busy={busy}/>

      {/* ── PAYMENT METHOD CHOOSER ── */}
      {chooser && (
        <div onClick={()=>setChooser(null)}
          style={{position:"fixed",inset:0,zIndex:320,background:"rgba(2,8,14,.78)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div onClick={e=>e.stopPropagation()}
            style={{maxWidth:400,width:"100%",borderRadius:20,padding:"26px",background:"linear-gradient(155deg,#0b1622,#070d14)",border:"1px solid rgba(56,189,248,.22)",boxShadow:"0 30px 80px rgba(0,0,0,.55)",position:"relative"}}>
            <button onClick={()=>setChooser(null)} style={{position:"absolute",top:14,right:14,width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:14}}>✕</button>
            <div style={{fontSize:11,letterSpacing:"1.5px",color:"rgba(56,189,248,.7)",fontWeight:600,marginBottom:4}}>CHECKOUT</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:2}}>{chooser.name}</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.45)",marginBottom:22}}>Choose a payment method · {fmtINR(chooser.priceInr)}</div>

            <button onClick={()=>{ const a=chooser; setChooser(null); buyAgent(a); }}
              style={{width:"100%",padding:"13px",borderRadius:12,marginBottom:10,background:"linear-gradient(90deg,#34d399,#38bdf8)",border:"none",color:"#04140e",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <span style={{fontSize:15}}>⚡</span> Pay with Razorpay <span style={{opacity:.7,fontWeight:500}}>· cards / UPI</span>
            </button>

            <button onClick={()=>payWithPaypal(chooser)}
              style={{width:"100%",padding:"13px",borderRadius:12,background:"#ffc439",border:"none",color:"#003087",fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:".3px"}}>
              Pay<span style={{color:"#0070ba"}}>Pal</span>
            </button>

            <p style={{fontSize:10.5,color:"rgba(255,255,255,.3)",lineHeight:1.55,marginTop:16,textAlign:"center"}}>
              Razorpay confirms instantly. PayPal opens a payment link — you'll confirm here once it's sent.
            </p>
          </div>
        </div>
      )}

      {/* ── PAYPAL.ME CONFIRM ── */}
      {paypal && (
        <div onClick={()=>setPaypal(null)}
          style={{position:"fixed",inset:0,zIndex:330,background:"rgba(2,8,14,.8)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
          <div onClick={e=>e.stopPropagation()}
            style={{maxWidth:420,width:"100%",borderRadius:20,padding:"28px",background:"linear-gradient(155deg,#0b1622,#070d14)",border:"1px solid rgba(255,196,57,.3)",boxShadow:"0 30px 80px rgba(0,0,0,.55)",position:"relative",textAlign:"center"}}>
            <button onClick={()=>setPaypal(null)} style={{position:"absolute",top:14,right:14,width:30,height:30,borderRadius:8,background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",color:"rgba(255,255,255,.5)",cursor:"pointer",fontSize:14}}>✕</button>
            <div style={{fontSize:40,marginBottom:10}}>💸</div>
            <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:8}}>Complete your PayPal payment</div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.65,marginBottom:18}}>
              A PayPal tab opened for <strong style={{color:"#fff"}}>{paypal.name}</strong> ({fmtINR(paypal.priceInr)}).
              Send the payment there, then confirm below to unlock the agent.
            </p>
            <a href={paypal.payUrl} target="_blank" rel="noreferrer"
              style={{display:"block",fontSize:11.5,color:"#ffc439",textDecoration:"none",marginBottom:18,wordBreak:"break-all"}}>
              ↗ Re-open payment link
            </a>
            <button disabled={busy===paypal.id} onClick={()=>confirmPaypal(paypal)}
              style={{width:"100%",padding:"13px",borderRadius:12,background:"linear-gradient(90deg,#34d399,#38bdf8)",border:"none",color:"#04140e",fontSize:13,fontWeight:700,cursor:busy===paypal.id?"wait":"pointer"}}>
              {busy===paypal.id ? "Confirming…" : "I've Paid — Unlock Agent"}
            </button>
            <p style={{fontSize:10,color:"rgba(255,255,255,.28)",marginTop:12,lineHeight:1.5}}>
              PayPal.me payments are verified manually by our team. Misuse may revoke access.
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div style={{position:"fixed",bottom:mobile?72:24,left:"50%",transform:"translateX(-50%)",zIndex:400,padding:"12px 20px",borderRadius:12,background:"rgba(8,22,34,.96)",border:"1px solid rgba(56,189,248,.3)",color:"#fff",fontSize:13,fontWeight:500,boxShadow:"0 12px 40px rgba(0,0,0,.5)",maxWidth:"90vw",textAlign:"center"}}>
          {toast}
        </div>
      )}
    </div>
  );
}
