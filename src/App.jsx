import { useEffect } from "react";

// ── Change this to your deployed Flask URL when you go live ──
const FLASK_API = "http://localhost:5000";

// ── Google OAuth Client ID (set in .env as VITE_GOOGLE_CLIENT_ID) ──
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const pageHtml = `

<div id="gsi-fallback" style="display:none"></div>
<div id="cd"></div>
<div id="cr"></div>
<div id="pb"></div>
<canvas id="bg"></canvas>

<!-- ═══ AUTH LOADING OVERLAY ═══ -->
<div class="auth-loading" id="authLoading">
  <div class="auth-loading-box">
    <img src="/logo.png" alt="BSN" class="auth-loading-logo">
    <div class="auth-spinner"></div>
    <div class="auth-loading-text" id="authLoadingText">Signing you in…</div>
  </div>
</div>

<!-- ═══ STATIC CHATBOT (bottom-left) ═══ -->
<div class="cb-wrap" id="cbWrap">
  <div class="cb-panel" id="cbPanel">
    <div class="cb-head">
      <div class="cb-ava">🤖</div>
      <div>
        <div class="cb-title">BSN Assistant</div>
        <div class="cb-online"><span class="cb-online-dot"></span>Online · Instant answers</div>
      </div>
      <button class="cb-x" onclick="togChat(false)">✕</button>
    </div>
    <div class="cb-msgs" id="cbMsgs"></div>
    <div class="cb-chips-label">COMMON QUESTIONS</div>
    <div class="cb-chips" id="cbChips"></div>
  </div>
  <button class="cb-fab" id="cbFab" onclick="togChat()" aria-label="Chat with BSN">
    <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
    <span class="cb-fab-dot"></span>
  </button>
</div>

<!-- ═══ NAVBAR ═══ -->
<nav id="nav">
  <a href="#" class="nav-logo">
    <img src="/logo.png" alt="BSN">
    <div><div class="nav-bsn">BSN</div><div class="nav-sub">BANDNA SHRI NIKA</div></div>
  </a>

  <div class="nav-links">
    <a href="#vision">Vision</a>
    <a href="#ai3d">AI + 3D</a>
    <a href="/dashboard" class="nav-aidash" onclick="event.preventDefault();goDashboard()"><span class="nav-aidash-dot"></span>AI Dashboard</a>
    <a href="#research">Research</a>
    <a href="#model">Model</a>
    <a href="#pricing">Pricing</a>
    <a href="#join">Join</a>
    <a href="#" class="nav-demo" onclick="bookDemo(event)"><span class="nav-demo-dot"></span>Book a Demo</a>
  </div>

  <div class="nav-right">
    <a href="#join" class="btn-gi">Get Involved</a>

    <div class="profile-wrap" id="profileWrap">
      <div class="profile-btn" id="profileBtn" onclick="togProfile()">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <div class="profile-online" id="onlineDot"></div>
      </div>

      <div class="auth-dd" id="authDD">
        <div id="ddOut" class="dd-out">
          <p>Sign in to track mission impact and manage your AI agents.</p>
          <div class="dd-btns">
            <button class="dd-login" onclick="showModal('login')">Log In</button>
            <button class="dd-reg" onclick="showModal('register')">Register</button>
          </div>
        </div>
        <div id="ddIn" style="display:none">
          <div class="dd-user">
            <div class="dd-avatar" id="ddAvatar">A</div>
            <div class="dd-name" id="ddName">User</div>
            <div class="dd-email" id="ddEmail">user@bsn.ai</div>
            <div class="dd-badge"><span class="dd-badge-dot"></span>ACTIVE AGENT</div>
          </div>
          <a href="/dashboard" class="dd-item">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>AI Dashboard
          </a>
          <a href="#" class="dd-item">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>My Profile
          </a>
          <div class="dd-sep"></div>
          <button class="dd-item red" onclick="doLogout()">
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>Log Out
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="nav-ham" id="navHam" onclick="togMob()"><span></span><span></span><span></span></div>
</nav>

<!-- Mobile menu -->
<div class="mob-menu" id="mobMenu">
  <a href="#vision" onclick="togMob()">Vision</a>
  <a href="#ai3d" onclick="togMob()">AI + 3D</a>
  <a href="/dashboard" class="mob-aidash" onclick="event.preventDefault();togMob();goDashboard()">⊞ AI Dashboard</a>
  <a href="#research" onclick="togMob()">Research</a>
  <a href="#model" onclick="togMob()">Model</a>
  <a href="#pricing" onclick="togMob()">Pricing</a>
  <a href="#join" onclick="togMob()">Join</a>
  <div class="mob-bottom">
    <a href="#" class="mob-demo" onclick="togMob();bookDemo(event)">
      <span style="width:6px;height:6px;border-radius:50%;background:var(--e);box-shadow:0 0 6px var(--e)"></span>Book a Demo
    </a>
    <a href="#join" class="mob-gi" onclick="togMob()">Get Involved →</a>
    <button class="mob-auth" onclick="togMob();showModal('login')">Sign In / Register</button>
  </div>
</div>

<!-- ═══ AUTH MODAL ═══ -->
<div class="modal-ov" id="authModal" onclick="outClose(event)">
  <div class="modal-box">
    <button class="modal-x" onclick="closeModal()">✕</button>
    <div class="modal-brand">
      <img src="/logo.png" alt="BSN">
      <span>BSN</span>
    </div>
    <div class="modal-tabs">
      <div class="modal-tab active" id="tLogin" onclick="switchTab('login')">Log In</div>
      <div class="modal-tab" id="tReg" onclick="switchTab('register')">Register</div>
    </div>
    <div id="fLogin">
      <button class="btn-google" onclick="signInWithGoogle()">
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        Continue with Google
      </button>
      <div class="auth-divider"><span>OR</span></div>
      <div class="fg"><label class="fl">EMAIL</label><input type="email" class="fi2" id="lEmail" placeholder="you@example.com"></div>
      <div class="fg"><label class="fl">PASSWORD</label><input type="password" class="fi2" id="lPass" placeholder="••••••••"></div>
      <p class="fp-link"><a href="#" onclick="showForgot(event)">Forgot password?</a></p>
      <button class="fsub" onclick="doLogin()">Sign In to BSN</button>
      <p class="ffoot">No account? <a href="#" onclick="switchTab('register')">Register free</a></p>
    </div>
    <div id="fForgot" style="display:none">
      <div id="fpStep1">
        <p class="fp-info">Enter your account email and we'll send you a 6-digit reset code.</p>
        <div class="fg"><label class="fl">EMAIL</label><input type="email" class="fi2" id="fpEmail" placeholder="you@example.com"></div>
        <button class="fsub" onclick="doForgotSend()">Send Reset Code</button>
      </div>
      <div id="fpStep2" style="display:none">
        <p class="fp-info">We emailed a 6-digit code to <strong id="fpEmailShow"></strong>. Enter it below with your new password.</p>
        <div class="fg"><label class="fl">6-DIGIT CODE</label><input type="text" class="fi2" id="fpOtp" placeholder="123456" maxlength="6" inputmode="numeric" autocomplete="one-time-code"></div>
        <div class="fg"><label class="fl">NEW PASSWORD</label><input type="password" class="fi2" id="fpPass" placeholder="New password (min 6 chars)"></div>
        <button class="fsub" onclick="doForgotReset()">Reset Password</button>
        <p class="ffoot">Didn't get it? <a href="#" onclick="doForgotSend(event)">Resend code</a></p>
      </div>
      <p class="ffoot"><a href="#" onclick="switchTab('login')">← Back to Sign In</a></p>
    </div>
    <div id="fReg" style="display:none">
      <button class="btn-google" onclick="signInWithGoogle()">
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        Sign up with Google
      </button>
      <div class="auth-divider"><span>OR</span></div>
      <div class="fg"><label class="fl">FULL NAME</label><input type="text" class="fi2" id="rName" placeholder="Your name"></div>
      <div class="fg"><label class="fl">EMAIL</label><input type="email" class="fi2" id="rEmail" placeholder="you@example.com"></div>
      <div class="fg"><label class="fl">PHONE</label><input type="tel" class="fi2" id="rPhone" placeholder="9999999999"></div>
      <div class="fg"><label class="fl">ROLE</label><input type="text" class="fi2" id="rRole" placeholder="Founder / Student / Developer"></div>
      <div class="fg"><label class="fl">LOOKING FOR</label><input type="text" class="fi2" id="rLookingFor" placeholder="What are you looking for?"></div>
      <div class="fg"><label class="fl">PASSWORD</label><input type="password" class="fi2" id="rPass" placeholder="Create a password"></div>
      <button class="fsub" onclick="doRegister()">Create Account — Get 3 Free Analyses</button>
      <p class="ffoot">Have an account? <a href="#" onclick="switchTab('login')">Sign in</a></p>
    </div>
  </div>
</div>

<!-- ═══ HERO ═══ -->
<section class="hero">
  <div class="hero-inner">
    <div>
      <div class="h-eye"><span class="e-dot"></span>SEED STAGE · DELHI, INDIA</div>
      <h1 class="ht">
        Autonomous AI<br>Agents for the<br>
        <span class="hem">3D World</span> &amp;<br>
        <span class="hgrad">the Multiverse</span>
      </h1>
      <p class="h-body">Deploy <strong>enterprise AI agents</strong>, <strong>AI digital twins</strong> and <strong>agentic AI</strong> that slash operations costs by 70%+ — so we can fund pioneering biotechnology, ocean revival, and steps toward the <strong>multiverse</strong>.</p>
      <div class="h-acts">
        <a href="#join" class="bp2">Start the Journey →</a>
        <a href="#" onclick="bookDemo(event)" class="bo2">Book a Demo</a>
      </div>
      <div class="h-stats">
        <div class="hs"><div class="n">70%+</div><div class="l">COST REDUCTION</div></div>
        <div class="sdiv"></div>
        <div class="hs"><div class="n">50%</div><div class="l">PROFITS → RESEARCH</div></div>
        <div class="sdiv"></div>
        <div class="hs"><div class="n">4</div><div class="l">RESEARCH PILLARS</div></div>
      </div>
    </div>
    <div class="hero-vis">
      <div class="orbit o1"><div class="planet" onclick="document.getElementById('ai3d')?.scrollIntoView({behavior:'smooth'})"><span class="planet-ball">🤖</span><span class="planet-label">AI Agents Live</span><div class="planet-tip">We build and deploy intelligent AI agents that automate operations across industries, slashing costs and creating new revenue streams.</div></div></div>
      <div class="orbit o2"><div class="planet" onclick="document.getElementById('research')?.scrollIntoView({behavior:'smooth'})"><span class="planet-ball">🧬</span><span class="planet-label">Biotech R&D</span><div class="planet-tip">Innovative biotech solutions that recycle plastics, clean oceans, and restore marine ecosystems at global scale.</div></div></div>
      <div class="orbit o3"><div class="planet" onclick="document.getElementById('research')?.scrollIntoView({behavior:'smooth'})"><span class="planet-ball">🌊</span><span class="planet-label">Ocean Revival</span><div class="planet-tip">AI-guided cleanup fleets and nature-based technologies to heal our blue planet for generations.</div></div></div>
      <div class="orbit o4"><div class="planet" onclick="document.getElementById('research')?.scrollIntoView({behavior:'smooth'})"><span class="planet-ball">🌌</span><span class="planet-label">Multiverse</span><div class="planet-tip">Theoretical and experimental research into consciousness across dimensions and multiversal pathways.</div></div></div>
      <div class="c3w sun">
        <div class="c3" onclick="document.getElementById('vision')?.scrollIntoView({behavior:'smooth'})">
          <img src="/logo.png" alt="BSN" class="c3-logo">
          <div class="c3-name">BANDNA SHRI NIKA</div>
        </div>
        <div class="sun-tip">
          <div class="sun-tip-tag">AI · 3D WORLD · CONSCIOUSNESS</div>
          <div class="sun-tip-meaning"><b>Bandna</b> — "to bind" · <b>Shri Nika</b> — Sanskrit for "one who is auspicious and bright"</div>
          <div class="sun-tip-row"><span>Operations Reduction</span><b>70%+</b></div>
          <div class="sun-tip-row"><span>Research Funding</span><b>50% PROFITS</b></div>
          <div class="sun-tip-row"><span>Stage</span><b>SEED · DELHI</b></div>
        </div>
      </div>
    </div>
  </div>
  <div class="sc-hint"><span>SCROLL</span><div class="sc-line"></div></div>
</section>

<!-- ═══ CONSULTING ═══ -->
<section id="consulting" class="s-lt">
  <div class="si">
    <div class="cg">
      <div class="rv">
        <div class="cbg"><span style="width:6px;height:6px;border-radius:50%;background:#1254a4;display:inline-block"></span>LIMITED SLOTS · FREE FOR FOUNDERS</div>
        <h2 class="stit" style="color:#030f1e">Book Your Free<br><span style="color:#1254a4;font-weight:300;font-style:italic">3D AI Strategy</span><br>Session</h2>
        <p class="cbody">Speak directly with the founder. Get a personalized roadmap for deploying 3D AI agents that slash costs and fund our research in emotion-driven energy awakening, biotechnology, ocean revival, and the multiverse.</p>
        <ul class="clist">
          <li><span class="cli">🪷</span>Custom 3D AI deployment plan for your business</li>
          <li><span class="cli">🌐</span>Live demo of revenue-generating agents</li>
          <li><span class="cli">🧬</span>See how your success powers the research mission</li>
          <li><span class="cli">🌌</span>30-minute call with Aryan Datta (the founder)</li>
        </ul>
        <a href="#" onclick="bookDemo(event)" class="bd2">Book Free Consultation →</a>
        <p class="cnote">Personally reviewed · Reply within 24 hours</p>
      </div>
      <div class="rv d2">
        <div class="ccard">
          <span class="cemoji">🪷🤖🌌</span>
          <h3 class="ccard-title">Your Free Session Includes</h3>
          <div class="crow"><span class="crl">Operations Audit + 3D AI Roadmap</span><span class="crv">FREE</span></div>
          <div class="crow"><span class="crl">Revenue Projection for Your Industry</span><span class="crv">FREE</span></div>
          <div class="crow"><span class="crl">Mission Impact Overview</span><span class="crv">FREE</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ VISION ═══ -->
<section id="vision" class="s-wh">
  <div class="si">
    <div class="rv" style="text-align:center">
      <span class="slbl" style="color:#1254a4">OUR NORTH STAR</span>
      <h2 class="stit" style="color:#030f1e">From AI Agents to<br><em style="color:#1254a4;font-style:italic;font-weight:300">Awakened Humanity</em></h2>
    </div>
    <div class="vis-grid">
      <div class="vc rv d1"><span class="vcn">01</span><span class="vcico">🤖</span><h3>Deploy AI Agents First</h3><p>We build and deploy intelligent AI agents that automate operations across industries, slashing costs and creating new revenue streams.</p></div>
      <div class="vc rv d2"><span class="vcn">02</span><span class="vcico">🌊</span><h3>Fund the Future</h3><p>Every rupee earned powers biotechnology research, ocean recycling & cleanup, and groundbreaking work in awareness and emotional mastery.</p></div>
      <div class="vc rv d3"><span class="vcn">03</span><span class="vcico">🧘‍♂️</span><h3>Higher Consciousness</h3><p>We research emotion-driven energies, the universe's deepest secrets, and practical steps toward the multiverse — creating Higher Emotional Intelligence.</p></div>
    </div>
    <div class="vquote rv">
      <p>"We are not just building AI. We are building the bridge between silicon intelligence and human transcendence."</p>
      <div class="founders-row">
        <div class="founder-sig">
          <div class="founder-avatar" style="background:linear-gradient(135deg,#082640,#0e3a5e)">
            <div class="av-pulse"></div>A
          </div>
          <div class="founder-name">Aryan Datta</div>
          <div class="founder-role">FOUNDER</div>
        </div>
        <div class="founders-divider"></div>
        <div class="founder-sig">
          <div class="founder-avatar" style="background:linear-gradient(135deg,#0e3a5e,#1254a4)">
            <div class="av-pulse" style="animation-delay:.8s"></div>VD
          </div>
          <div class="founder-name">Vansh Dhiman</div>
          <div class="founder-role">CO-FOUNDER</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ TEAM ═══ -->
<section id="team" class="team-section">
  <div class="si">
    <div class="rv" style="text-align:center">
      <span class="slbl">THE MINDS BEHIND BSN</span>
      <h2 class="stit">Our <em>Founders</em></h2>
      <p style="font-size:14px;color:rgba(245,236,218,.4);margin-top:12px;max-width:440px;margin-left:auto;margin-right:auto;line-height:1.7">Two people building the bridge between silicon intelligence and human transcendence.</p>
    </div>
    <div class="team-grid">
      <div class="team-card rv d1">
        <div class="team-av" style="background:linear-gradient(135deg,#082640,#1254a4)">
          <div class="ring"></div><div class="ring2"></div>A
        </div>
        <div class="team-name">Aryan Datta</div>
        <div class="team-role">FOUNDER & CEO</div>
        <p class="team-bio">Visionary behind BSN's AI-powered 3D world. Steering autonomous agents, digital twins and agentic AI that cut operations costs and fund humanity's awakening.</p>
        <div class="team-tags">
          <span class="team-tag">AI Agents</span>
          <span class="team-tag">3D World</span>
          <span class="team-tag">Vision</span>
        </div>
      </div>
      <div class="team-card rv d2">
        <div class="team-av" style="background:linear-gradient(135deg,#0e3a5e,#1355a4)">
          <div class="ring" style="animation-delay:.5s"></div>
          <div class="ring2" style="animation-delay:1.1s"></div>VD
        </div>
        <div class="team-name">Vansh Dhiman</div>
        <div class="team-role">CO-FOUNDER</div>
        <p class="team-bio">Co-architect of BSN's mission. Building the foundations that connect emotion-driven energies, multiverse research, and the future of intelligent 3D systems.</p>
        <div class="team-tags">
          <span class="team-tag">Co-Founder</span>
          <span class="team-tag">Multiverse</span>
          <span class="team-tag">Strategy</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ AI + 3D ═══ -->
<section id="ai3d" class="s-dk">
  <div class="si">
    <div class="a3g">
      <div class="rv">
        <span class="slbl">CORE BUSINESS · CASH-COW ENGINE</span>
        <h2 class="stit">Running the 3D World<br>with <em>Autonomous AI</em></h2>
        <p class="a3b">As founder I personally steer <strong>autonomous AI agents</strong>, <strong>AI digital twins</strong> and <strong>agentic AI</strong> operating in immersive 3D environments — virtual factories, smart cities, and metaverse-scale operations.</p>
        <div class="a3fs">
          <div class="a3f"><span class="a3fa">→</span><p><strong>Enterprise AI agents</strong> & 3D agents that reduce human operations by 70%+</p></div>
          <div class="a3f"><span class="a3fa">→</span><p>Real-time <strong>AI digital twins</strong> for any industry — manufacturing to healthcare</p></div>
          <div class="a3f"><span class="a3fa">→</span><p><strong>AI automation</strong> & workflow intelligence that drives revenue and funds our mission</p></div>
        </div>
      </div>
      <div class="rv d2">
        <div class="globe-wrap">
          <div class="g-rings">
            <div class="g-ring gr1"></div>
            <div class="g-ring gr2"></div>
            <div class="g-ring gr3"></div>
          </div>
          <canvas id="globeC" width="250" height="250"></canvas>
          <div class="g-badge" style="top:4%;left:0%;--gd:7s;--gdd:0s;"><span class="gbd"></span>3D Agents Active</div>
          <div class="g-badge" style="bottom:8%;right:-8%;--gd:9s;--gdd:2s;"><span class="gbd"></span>Digital Twin Live</div>
          <div class="g-badge" style="top:44%;right:-12%;--gd:8s;--gdd:1s;"><span class="gbd"></span>70% Cost Saved</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ RESEARCH ═══ -->
<section id="research" class="s-lt">
  <div class="si">
    <div class="rv" style="text-align:center">
      <span class="slbl" style="color:#1254a4">DEDICATED RESEARCH TEAM</span>
      <h2 class="stit" style="color:#030f1e">Research That<br><em style="color:#1254a4;font-style:italic;font-weight:300">Changes Everything</em></h2>
    </div>
    <div class="res-grid">
      <div class="rc rv d1"><span class="rcico">🧬</span><h3>Biotechnology</h3><p>Innovative biotech solutions that recycle plastics, clean oceans, and restore marine ecosystems at global scale.</p><span class="rcn">01</span></div>
      <div class="rc rv d2"><span class="rcico">🌊</span><h3>Ocean Revival</h3><p>AI-guided cleanup fleets and nature-based technologies to heal our blue planet for generations.</p><span class="rcn">02</span></div>
      <div class="rc rv d3"><span class="rcico">🧘</span><h3>Emotion-Driven Energies</h3><p>Scientific exploration of higher emotional states and emotion-driven energies made universally accessible.</p><span class="rcn">03</span></div>
      <div class="rc rv d4"><span class="rcico">🌌</span><h3>Universe & Multiverse</h3><p>Theoretical and experimental research into consciousness across dimensions and multiversal pathways.</p><span class="rcn">04</span></div>
    </div>
  </div>
</section>

<!-- ═══ CYCLE ═══ -->
<section id="model" class="s-mid">
  <div class="si">
    <div style="text-align:center;margin-bottom:52px" class="rv">
      <span class="slbl">HOW IT WORKS</span>
      <h2 class="stit">The Virtuous <em>Cycle</em></h2>
    </div>
    <div class="cyc rv">
      <div class="cycs"><div class="cycn">01</div><h3>Deploy AI Agents</h3><p>Cut operational costs for businesses worldwide with intelligent autonomous agents</p></div>
      <div class="cyca">→</div>
      <div class="cycs"><div class="cycn">02</div><h3>Generate Revenue</h3><p>Sustainable cash flow from AI services creates a self-reinforcing engine</p></div>
      <div class="cyca">→</div>
      <div class="cycs"><div class="cycn">03</div><h3>Fund the Mission</h3><p>50% of profits fuel research, ocean cleanup, and consciousness studies</p></div>
    </div>
  </div>
</section>

<!-- ═══ PRICING ═══ -->
<section id="pricing" class="s-dk">
  <div class="si">
    <div class="ph rv">
      <span class="slbl">INVEST IN INTELLIGENCE</span>
      <h2 class="stit">Pricing That Powers<br><em>the Mission</em></h2>
      <p>Every rupee you invest automatically funds biotechnology, ocean revival, emotion-driven energies research, and steps toward the multiverse.</p>
    </div>
    <div class="pg">
      <div class="pc pc-s rv d1">
        <div class="ptier">STARTER</div>
        <div class="pname">Seed Agent</div>
        <div class="pprice"><span class="am">₹99K</span><span class="pe">/mo</span></div>
        <p class="pnote">* Excl. one-time setup</p>
        <p class="pdesc">Perfect for small teams ready to cut operations costs with 3D AI.</p>
        <ul class="pfs"><li><span class="pfi">→</span>1 AI agent</li><li><span class="pfi">→</span>Basic digital twin & automation</li><li><span class="pfi">→</span>30%+ operations cost reduction</li><li><span class="pfi">→</span>Monthly mission impact report</li></ul>
        <a href="#" onclick="showModal('register')" class="bpg">START WITH SEED AGENT</a>
      </div>
      <div class="pc pc-f rv d2">
        <div class="pbadge">MOST POPULAR</div>
        <div class="ptier">RECOMMENDED</div>
        <div class="pname">Lotus Agent</div>
        <div class="pprice"><span class="am">₹2.99L</span><span class="pe">/mo</span></div>
        <p class="pnote">* Excl. one-time setup</p>
        <p class="pdesc">Scale fast with full 3D agents that generate revenue while funding the mission.</p>
        <ul class="pfs"><li><span class="pfi">→</span>3 advanced AI agents</li><li><span class="pfi">→</span>Real-time digital twins & simulations</li><li><span class="pfi">→</span>60–70% efficiency + new revenue streams</li><li><span class="pfi">→</span>Priority support & custom training</li><li><span class="pfi">→</span>50% of profits directly fund research</li></ul>
        <a href="#" onclick="showModal('register')" class="bps">DEPLOY LOTUS AGENT</a>
      </div>
      <div class="pc pc-e rv d3">
        <div class="ptier">VISIONARY</div>
        <div class="pname">Multiverse</div>
        <div class="pprice"><span class="am" style="font-size:28px">Custom</span></div>
        <p class="pnote">&nbsp;</p>
        <p class="pdesc">Unlimited agents + direct partnership with our emotion-driven energies & multiverse research team.</p>
        <ul class="pfs"><li><span class="pfi">→</span>Unlimited custom 3D AI agents</li><li><span class="pfi">→</span>Metaverse-scale operations & digital twins</li><li><span class="pfi">→</span>Dedicated research liaison & co-creation</li><li><span class="pfi">→</span>Named contributor to breakthroughs</li><li><span class="pfi">→</span>White-glove onboarding & 24/7 support</li></ul>
        <a href="#" onclick="showModal('register')" class="bpg">BUILD YOUR MULTIVERSE</a>
      </div>
    </div>
    <p class="pfooter">Every plan includes a monthly impact report showing how your investment advances ocean cleanup, biotechnology, emotion-driven energies, and multiverse research.</p>
  </div>
</section>

<!-- ═══ JOIN ═══ -->
<section id="join" class="s-lt">
  <div class="si">
    <div class="join-in rv">
      <div class="jbg"><span style="width:6px;height:6px;border-radius:50%;background:#1254a4;display:inline-block"></span>APPLICATION OPEN</div>
      <h2 class="stit" style="color:#030f1e;margin-bottom:14px">Ready to Build<br><em style="color:#1254a4;font-style:italic;font-weight:300">the Future?</em><br>Join the Mission</h2>
      <p class="jbody">Whether you're an investor, researcher, developer, ocean-tech partner, or consciousness seeker — I personally review every submission.</p>
      <button type="button" class="bjoin" onclick="showModal('register')">Create Your BSN Profile →</button>
      <p class="jnote">TAKES UNDER 3 MINUTES · REVIEWED WITHIN 48 HOURS</p>
    </div>
  </div>
</section>

<!-- ═══ FOOTER ═══ -->
<footer>
  <div class="fi">
    <div class="flogo"><img src="/logo.png" alt="BSN"><span class="fb">BSN</span></div>
    <div class="flinks"><a href="#">Privacy</a><a href="#">Research Papers</a><a href="#">3D Demo Portal</a><a href="#">© 2026 Bandna Shri Nika</a></div>
    <div class="fcopy">Built with love in Delhi, India<br>For the 3D world and beyond<br><span style="font-size:9px;color:rgba(245,236,218,.18);letter-spacing:1.5px">FOUNDED BY </span><span style="color:rgba(56,189,248,.6);font-weight:500">Aryan Datta</span><span style="color:rgba(245,236,218,.18);margin:0 4px">&amp;</span><span style="color:rgba(56,189,248,.7);font-weight:600">Vansh Dhiman</span></div>
  </div>
</footer>
`;

export default function App() {
  useEffect(() => {

    // ── Flask API base (change for production) ──────────────────────────
    const FLASK = typeof FLASK_API !== 'undefined' ? FLASK_API : 'http://localhost:5000';

    /* CURSOR */
    const cd=document.getElementById('cd'),cr=document.getElementById('cr');
    let mx=0,my=0,rx=0,ry=0;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px'});
    (function A(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(A)})();
    document.querySelectorAll('a,button,.profile-btn').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('hov'));el.addEventListener('mouseleave',()=>document.body.classList.remove('hov'))});

    /* PROGRESS */
    const pb=document.getElementById('pb');
    window.addEventListener('scroll',()=>{pb.style.width=(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight)*100)+'%'},{passive:true});

    /* NAV SCROLL */
    window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',window.scrollY>50),{passive:true});

    /* MOBILE MENU */
    window.togMob=function(){
      const m=document.getElementById('mobMenu'),h=document.getElementById('navHam');
      m.classList.toggle('open');h.classList.toggle('open');
      document.body.style.overflow=m.classList.contains('open')?'hidden':'';
    }

    /* PROFILE DROPDOWN */
    let pOpen=false;
    window.togProfile=function(){
      pOpen=!pOpen;
      document.getElementById('authDD').classList.toggle('open',pOpen);
    }
    document.addEventListener('click',e=>{
      if(!document.getElementById('profileWrap').contains(e.target)){
        pOpen=false;document.getElementById('authDD').classList.remove('open');
      }
    });

    /* AUTH MODAL */
    window.showModal=function(tab){
      document.getElementById('authModal').classList.add('open');
      document.body.style.overflow='hidden';
      window.switchTab(tab||'login');
      pOpen=false;document.getElementById('authDD').classList.remove('open');
    }
    window.closeModal=function(){document.getElementById('authModal').classList.remove('open');document.body.style.overflow=''}
    window.outClose=function(e){if(e.target===document.getElementById('authModal'))closeModal()}
    window.switchTab=function(t){
      document.getElementById('tLogin').classList.toggle('active',t==='login');
      document.getElementById('tReg').classList.toggle('active',t==='register');
      document.getElementById('fLogin').style.display=t==='login'?'block':'none';
      document.getElementById('fReg').style.display=t==='register'?'block':'none';
      document.getElementById('fForgot').style.display='none';
    }

    /* ── FORGOT PASSWORD ── */
    window.showForgot=function(e){
      if(e)e.preventDefault();
      document.getElementById('tLogin').classList.remove('active');
      document.getElementById('tReg').classList.remove('active');
      document.getElementById('fLogin').style.display='none';
      document.getElementById('fReg').style.display='none';
      document.getElementById('fForgot').style.display='block';
      document.getElementById('fpStep1').style.display='block';
      document.getElementById('fpStep2').style.display='none';
      const le=document.getElementById('lEmail').value.trim();
      if(le) document.getElementById('fpEmail').value=le;
    }

    /* BOOK DEMO */
    window.bookDemo=function(e){
      if(e){e.preventDefault();}
      const start=new Date(Date.now()+24*60*60*1000);
      start.setMinutes(0,0,0);
      const end=new Date(start.getTime()+30*60*1000);
      const fmt=d=>d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
      const params=new URLSearchParams({action:'TEMPLATE',text:'BSN 3D AI Strategy Session',dates:`${fmt(start)}/${fmt(end)}`,details:'30-minute call with Aryan Datta for BSN AI agents, 3D AI strategy, and business automation roadmap.',add:'aryan.datta.940@gmail.com'});
      window.open(`https://calendar.google.com/calendar/render?${params.toString()}`,'_blank');
    }

    /* ── BACKEND ── */
    const API = 'https://bsnjavabackend.onrender.com/api/users';
    const hdrs = {'accept':'*/*','Content-Type':'application/json'};

    // Parses any backend response; returns {ok, data, message}
    async function apiCall(url, body){
      const res = await fetch(url, {method:'POST', headers:hdrs, body:JSON.stringify(body)});
      let data = {};
      try { data = await res.json(); } catch(_){}
      return { ok: res.ok, status: res.status, data, message: data.message || '' };
    }

    function buildUser(data, fallbacks={}){
      const name = data.fullName || fallbacks.name || '';
      return { name, email: data.email || fallbacks.email || '', ...data };
    }

    /* ── AUTH LOADING OVERLAY ── */
    window.showLoading=function(msg){
      document.getElementById('authLoadingText').textContent=msg||'Signing you in…';
      document.getElementById('authLoading').classList.add('open');
    }
    window.hideLoading=function(){
      document.getElementById('authLoading').classList.remove('open');
    }

    /* ── LOGIN ── */
    window.doLogin=async function(){
      const email=document.getElementById('lEmail').value.trim();
      const pass=document.getElementById('lPass').value;
      if(!email||!pass){alert('Please fill in email and password.');return}

      window.showLoading('Signing you in…');
      try {
        const {ok, data, message} = await apiCall(`${API}/login`, {email, password:pass});
        if(ok){
          const user = buildUser(data, {email});
          localStorage.setItem('bsnUser', JSON.stringify(user));
          window.loginUser(user); window.closeModal();
        } else {
          alert(message || 'Invalid email or password. Please try again.');
        }
      } catch(e) {
        alert('Could not reach the server. Please try again.');
      } finally {
        window.hideLoading();
      }
    }

    /* ── REGISTER ── */
    window.doRegister=async function(){
      const name       = document.getElementById('rName').value.trim();
      const email      = document.getElementById('rEmail').value.trim();
      const phone      = document.getElementById('rPhone').value.trim();
      const role       = document.getElementById('rRole').value.trim();
      const lookingFor = document.getElementById('rLookingFor').value.trim();
      const pass       = document.getElementById('rPass').value;
      if(!name||!email||!phone||!role||!lookingFor||!pass){alert('Please fill in all fields.');return}

      window.showLoading('Creating your account…');
      try {
        const {ok, data, message} = await apiCall(API, {fullName:name, email, phone, role, lookingFor, password:pass});
        if(ok){
          // 201 — new account created
          const user = buildUser(data, {name, email});
          localStorage.setItem('bsnUser', JSON.stringify(user));
          window.loginUser(user); window.closeModal();
        } else if(message && message.toLowerCase().includes('user already exists')){
          // Email taken — offer to switch to login
          alert('This email is already registered. Switching to Sign In.');
          document.getElementById('rEmail').value = email; // pre-fill not available on login form
          window.switchTab('login');
          document.getElementById('lEmail').value = email;
        } else {
          alert(message || 'Registration failed. Please try again.');
        }
      } catch(e) {
        alert('Could not reach the server. Please try again.');
      } finally {
        window.hideLoading();
      }
    }

    window.doForgotSend=async function(e){
      if(e)e.preventDefault();
      const email=document.getElementById('fpEmail').value.trim();
      if(!email){alert('Please enter your email.');return}

      window.showLoading('Sending reset code…');
      try {
        const {ok, message} = await apiCall(`${API}/forgot-password`, {email});
        if(ok){
          document.getElementById('fpEmailShow').textContent=email;
          document.getElementById('fpStep1').style.display='none';
          document.getElementById('fpStep2').style.display='block';
        } else {
          alert(message || 'Could not send reset code. Please try again.');
        }
      } catch(_) {
        alert('Could not reach the server. Please try again.');
      } finally {
        window.hideLoading();
      }
    }

    window.doForgotReset=async function(){
      const email=document.getElementById('fpEmail').value.trim();
      const otp=document.getElementById('fpOtp').value.trim();
      const pass=document.getElementById('fpPass').value;
      if(!otp||!pass){alert('Please enter the code and a new password.');return}
      if(pass.length<6){alert('New password must be at least 6 characters.');return}

      window.showLoading('Resetting your password…');
      try {
        const {ok, message} = await apiCall(`${API}/reset-password`, {email, otp, newPassword:pass});
        if(ok){
          alert('Password updated! Sign in with your new password.');
          document.getElementById('fpOtp').value='';
          document.getElementById('fpPass').value='';
          window.switchTab('login');
          document.getElementById('lEmail').value=email;
          document.getElementById('lPass').value='';
        } else {
          alert(message || 'Could not reset password. Check the code and try again.');
        }
      } catch(_) {
        alert('Could not reach the server. Please try again.');
      } finally {
        window.hideLoading();
      }
    }

    window.loginUser=function(u){
      document.getElementById('ddOut').style.display='none';
      document.getElementById('ddIn').style.display='block';
      const displayName=u.name||u.fullName||'User';
      const avatarEl=document.getElementById('ddAvatar');
      if(u.picture){
        avatarEl.innerHTML=`<img src="${u.picture}" alt="${displayName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;display:block">`;
      } else {
        avatarEl.textContent=displayName.charAt(0).toUpperCase();
      }
      document.getElementById('ddName').textContent=displayName;
      document.getElementById('ddEmail').textContent=u.email||'';
      document.getElementById('onlineDot').style.display='block';
    }

    /* ── AI DASHBOARD ── */
    window.goDashboard=function(){
      const user=JSON.parse(localStorage.getItem('bsnUser')||'null');
      if(user&&user.email){ window.location.href='/dashboard'; }
      else { window.showModal('register'); }
    }

    window.doLogout=function(){
      localStorage.removeItem('bsnUser');
      document.getElementById('ddOut').style.display='block';
      document.getElementById('ddIn').style.display='none';
      document.getElementById('onlineDot').style.display='none';
      document.getElementById('ddAvatar').innerHTML='A';
      pOpen=false;document.getElementById('authDD').classList.remove('open');
      if(window.google?.accounts?.oauth2) google.accounts.oauth2.revoke('', ()=>{});
    }

    /* REVEAL */
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vi');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
    document.querySelectorAll('.rv').forEach(el=>io.observe(el));

    /* WEBGL PARTICLES — blue */
    (function(){
      const c=document.getElementById('bg'),gl=c.getContext('webgl');
      if(!gl)return;
      function resize(){c.width=innerWidth;c.height=innerHeight;gl.viewport(0,0,c.width,c.height)}
      resize();window.addEventListener('resize',resize,{passive:true});
      const VS=`attribute vec3 p;attribute float s;attribute float a;uniform float t;varying float va;void main(){vec3 q=p;q.y=mod(q.y+t*.03,2.)-1.;gl_Position=vec4(q.x*.6,q.y,0,1);gl_PointSize=s;va=a;}`;
      const FS=`precision mediump float;varying float va;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.05,.65,.91,va*(1.-d*1.8));}`;
      function sh(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s}
      const prog=gl.createProgram();gl.attachShader(prog,sh(gl.VERTEX_SHADER,VS));gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prog);gl.useProgram(prog);
      const N=900,pos=new Float32Array(N*3),sz=new Float32Array(N),al=new Float32Array(N);
      for(let i=0;i<N;i++){pos[i*3]=Math.random()*4-2;pos[i*3+1]=Math.random()*2-1;pos[i*3+2]=0;sz[i]=Math.random()*2+.7;al[i]=Math.random()*.45+.1}
      function buf(d,attr,n){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW);const l=gl.getAttribLocation(prog,attr);gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,n,gl.FLOAT,false,0,0)}
      buf(pos,'p',3);buf(sz,'s',1);buf(al,'a',1);
      const tl=gl.getUniformLocation(prog,'t');
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);
      (function draw(t){gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(tl,t*.001);gl.drawArrays(gl.POINTS,0,N);requestAnimationFrame(draw)})(0);
    })();

    /* 3D GLOBE — blue */
    (function(){
      const c=document.getElementById('globeC'),ctx=c.getContext('2d');
      let t=0,W=250;
      const pts=Array.from({length:72},()=>({lat:(Math.random()-.5)*Math.PI,lon:Math.random()*Math.PI*2,city:Math.random()<.14}));
      const lns=Array.from({length:9},()=>({la1:(Math.random()-.5)*Math.PI,lo1:Math.random()*Math.PI*2,la2:(Math.random()-.5)*Math.PI,lo2:Math.random()*Math.PI*2}));
      function proj(lat,lon){const x=Math.cos(lat)*Math.cos(lon+t),y=Math.sin(lat),z=Math.cos(lat)*Math.sin(lon+t);return{sx:W/2+x*W*.44,sy:W/2-y*W*.44,z,vis:z>-.15}}
      (function frame(){
        requestAnimationFrame(frame);t+=.0035;
        ctx.clearRect(0,0,W,W);
        const g=ctx.createRadialGradient(W*.44,W*.43,8,W/2,W/2,W*.46);
        g.addColorStop(0,'rgba(8,38,64,.2)');g.addColorStop(1,'rgba(2,11,18,.07)');
        ctx.beginPath();ctx.arc(W/2,W/2,W*.46,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.strokeStyle='rgba(14,165,233,.1)';ctx.lineWidth=.7;ctx.stroke();
        for(let lt=-60;lt<=60;lt+=30){const lr=lt*Math.PI/180,r=Math.cos(lr)*W*.46,y=W/2-Math.sin(lr)*W*.46;ctx.beginPath();ctx.arc(W/2,y,r,0,Math.PI*2);ctx.strokeStyle='rgba(14,165,233,.04)';ctx.lineWidth=.5;ctx.stroke()}
        for(let i=0;i<6;i++){const ang=i*Math.PI/3;ctx.beginPath();for(let a=0;a<=360;a+=6){const la=(a/180*Math.PI)-Math.PI/2,p=proj(la,ang);if(p.vis){a<6?ctx.moveTo(p.sx,p.sy):ctx.lineTo(p.sx,p.sy)}}ctx.strokeStyle='rgba(14,165,233,.05)';ctx.lineWidth=.5;ctx.stroke()}
        lns.forEach((l,i)=>{const p1=proj(l.la1,l.lo1),p2=proj(l.la2,l.lo2);if(p1.vis&&p2.vis){ctx.beginPath();ctx.moveTo(p1.sx,p1.sy);ctx.lineTo(p2.sx,p2.sy);ctx.strokeStyle=`rgba(14,165,233,${.07+.09*Math.sin(t*1.4+i)})`;ctx.lineWidth=.7;ctx.stroke()}});
        pts.forEach(pt=>{const p=proj(pt.lat,pt.lon);if(!p.vis)return;const a=.28+(p.z+.15)/.65*.45;if(pt.city){ctx.beginPath();ctx.arc(p.sx,p.sy,2.5,0,Math.PI*2);ctx.fillStyle=`rgba(14,165,233,${a})`;ctx.fill();ctx.beginPath();ctx.arc(p.sx,p.sy,4.5+1.8*Math.sin(t*2.2+p.sx),0,Math.PI*2);ctx.strokeStyle=`rgba(14,165,233,${a*.3})`;ctx.lineWidth=.6;ctx.stroke()}else{ctx.beginPath();ctx.arc(p.sx,p.sy,1,0,Math.PI*2);ctx.fillStyle=`rgba(56,189,248,${a*.5})`;ctx.fill()}});
      })();
    })();

    /* ── GOOGLE AUTH ────────────────────────────────────────────────── */
    let _googleTokenClient = null;

    async function handleGoogleToken(tokenResponse) {
      if (tokenResponse.error) { window.hideLoading(); alert('Google sign-in cancelled.'); return; }
      window.showLoading('Setting up your profile…');
      try {
        // 1. Fetch Google profile
        const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const profile = await profileRes.json();
        if (!profile.email) { alert('Could not get email from Google. Please try again.'); return; }

        // Deterministic derived password — same every time for this Google account
        const derivedPass = 'BSN_G_' + profile.sub.slice(-12);

        // 2. Try to REGISTER first (handles brand-new Google users)
        const reg = await apiCall(API, {
          fullName:   profile.name,
          email:      profile.email,
          phone:      'N/A',
          role:       'Google User',
          lookingFor: 'BSN Platform Access',
          password:   derivedPass,
        });

        if (reg.ok) {
          // New user — registered and saved
          const user = buildUser(reg.data, {name: profile.name, email: profile.email});
          user.picture = profile.picture;
          user.googleId = profile.sub;
          user.authProvider = 'google';
          localStorage.setItem('bsnUser', JSON.stringify(user));
          window.loginUser(user); window.closeModal();
          return;
        }

        if (reg.message && reg.message.toLowerCase().includes('user already exists')) {
          // 3. User already in DB — try logging in with derived password (returning Google user)
          const login = await apiCall(`${API}/login`, {email: profile.email, password: derivedPass});

          if (login.ok) {
            const user = buildUser(login.data, {name: profile.name, email: profile.email});
            user.picture = profile.picture;
            user.googleId = profile.sub;
            user.authProvider = 'google';
            localStorage.setItem('bsnUser', JSON.stringify(user));
            window.loginUser(user); window.closeModal();
            return;
          }

          // 4. Email exists but was registered with a different (email/password) account
          alert('This email is already registered with a password account.\nPlease sign in using your email and password.');
          window.switchTab('login');
          document.getElementById('lEmail').value = profile.email;
          return;
        }

        // 5. Unexpected backend error — still allow local-only session
        console.error('Google register unexpected error:', reg.message);
        const fallbackUser = {
          name: profile.name, email: profile.email,
          picture: profile.picture, googleId: profile.sub, authProvider: 'google',
        };
        localStorage.setItem('bsnUser', JSON.stringify(fallbackUser));
        window.loginUser(fallbackUser); window.closeModal();

      } catch(e) {
        console.error('Google sign-in error:', e);
        alert('Could not complete Google sign-in. Please try again.');
      } finally {
        window.hideLoading();
      }
    }

    function initGoogleAuth() {
      if (!window.google?.accounts?.oauth2 || !GOOGLE_CLIENT_ID) return;
      _googleTokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'openid profile email',
        callback: handleGoogleToken,
        error_callback: function(){ window.hideLoading(); }, // popup closed / blocked
      });
    }

    window.signInWithGoogle = function() {
      if (!_googleTokenClient) {
        // Script might still be loading — try to init then retry
        initGoogleAuth();
        if (!_googleTokenClient) { alert('Google Sign-In is loading. Please try again in a moment.'); return; }
      }
      window.showLoading('Connecting to Google…');
      _googleTokenClient.requestAccessToken({ prompt: 'select_account' });
    };

    // Init immediately if script already loaded, else wait for load event
    initGoogleAuth();
    if (!_googleTokenClient) {
      const gsiScript = document.querySelector('script[src*="accounts.google.com/gsi"]');
      if (gsiScript) gsiScript.addEventListener('load', initGoogleAuth);
    }

    /* ── STATIC CHATBOT ────────────────────────────────────────────── */
    const CB_FAQ = [
      { q:'What does BSN actually do?',
        a:'We deploy autonomous AI agents and digital twins that run your business operations — procurement, scheduling, reporting, analysis — 24/7. Clients typically cut operations costs by 70%+.' },
      { q:'How much does it cost?',
        a:'Marketplace agents start at a one-time ₹4,999. Managed plans: Seed Agent ₹99K/mo (1 agent), Lotus Agent ₹2.99L/mo (3 advanced agents — most popular), and custom Multiverse plans for enterprises.',
        cta:{ label:'See Pricing →', act:'pricing' } },
      { q:'How do AI agents cut 70% of my costs?',
        a:'Agents automate repetitive operations around the clock — no salaries, no breaks, no errors from fatigue. Most clients see 30%+ savings in the first month, scaling to 70%+ as more workflows are automated.' },
      { q:'How fast can I deploy?',
        a:'Marketplace agents deploy in one click right after purchase. Custom enterprise agents typically go live in 2–4 weeks, including onboarding and training on your workflows.' },
      { q:'Is my business data secure?',
        a:'Yes. Data is encrypted in transit, kept isolated per client, and agents only operate inside the scope you give them. We never sell or share your data.' },
      { q:'Which industries do you serve?',
        a:'BSN agents are industry-agnostic — manufacturing, healthcare, logistics, retail, finance, real estate and more. If your business has repetitive operations, an agent can run them.' },
      { q:'Can I see a demo first?',
        a:"Of course — book a free 30-minute strategy session directly with the founder. You'll get a live demo plus a custom AI roadmap for your business.",
        cta:{ label:'Book a Free Demo →', act:'demo' } },
      { q:'How do I get started?',
        a:'Create a free BSN account — you get 3 free analyses, instant access to the AI Dashboard, and you can deploy your first agent in minutes.',
        cta:{ label:'Create Free Account →', act:'register' } },
    ];

    const cbMsgs  = document.getElementById('cbMsgs');
    const cbChips = document.getElementById('cbChips');
    let cbOpen = false, cbGreeted = false;

    function cbScroll(){ cbMsgs.scrollTop = cbMsgs.scrollHeight; }

    function cbAddMsg(text, who, cta){
      const m = document.createElement('div');
      m.className = 'cb-m ' + who;
      m.textContent = text;
      cbMsgs.appendChild(m);
      if(cta){
        const b = document.createElement('button');
        b.className = 'cb-cta';
        b.textContent = cta.label;
        b.onclick = () => {
          if(cta.act === 'pricing'){ window.togChat(false); document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'}); }
          else if(cta.act === 'demo'){ window.bookDemo(); }
          else if(cta.act === 'register'){ window.togChat(false); window.showModal('register'); }
        };
        cbMsgs.appendChild(b);
      }
      cbScroll();
    }

    function cbAnswer(item){
      const t = document.createElement('div');
      t.className = 'cb-m bot cb-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      cbMsgs.appendChild(t); cbScroll();
      setTimeout(() => { t.remove(); cbAddMsg(item.a, 'bot', item.cta); }, 700);
    }

    CB_FAQ.forEach((item, i) => {
      const c = document.createElement('button');
      c.className = 'cb-chip';
      c.textContent = item.q;
      c.onclick = () => { cbAddMsg(item.q, 'user'); cbAnswer(item); };
      cbChips.appendChild(c);
    });

    window.togChat = function(force){
      cbOpen = typeof force === 'boolean' ? force : !cbOpen;
      document.getElementById('cbPanel').classList.toggle('open', cbOpen);
      document.getElementById('cbFab').classList.toggle('open', cbOpen);
      if(cbOpen && !cbGreeted){
        cbGreeted = true;
        cbAddMsg("Hi! 👋 I'm the BSN assistant. Pick a question below — I'll answer instantly.", 'bot');
      }
    }

    /* RESTORE SESSION */
    const savedUser=JSON.parse(localStorage.getItem('bsnUser')||'null');
    if(savedUser&&savedUser.email){window.loginUser(savedUser);}

  }, []);

  return <div dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
