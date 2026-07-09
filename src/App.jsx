import { useEffect } from "react";

const pageHtml = `

<div id="cd"></div>
<div id="cr"></div>
<div id="pb"></div>
<canvas id="bg"></canvas>

<!-- ═══ NAVBAR ═══ -->
<nav id="nav">
  <a href="#" class="nav-logo">
    <img src="/logo.png" alt="BSN">
    <div><div class="nav-bsn">BSN</div><div class="nav-sub">BANDNA SHRI NIKA</div></div>
  </a>

  <div class="nav-links">
    <a href="#mehnat">Mehnat</a>
    <a href="#products">Products</a>
    <a href="#experiments">Experiments</a>
    <a href="#vision">Vision</a>
    <a href="#research">Research</a>
    <a href="#join">Join</a>
  </div>

  <div class="nav-right">
    <a href="https://mehnat-eight.vercel.app/" target="_blank" rel="noopener" class="btn-demo">
      <span class="dd"></span>Try Mehnat
    </a>
    <a href="#join" class="btn-gi">Get Involved</a>

    <!-- Profile -->
    <div class="profile-wrap" id="profileWrap">
      <div class="profile-btn" id="profileBtn" onclick="togProfile()">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        <div class="profile-online" id="onlineDot"></div>
      </div>

      <div class="auth-dd" id="authDD">
        <!-- Logged out -->
        <div id="ddOut" class="dd-out">
          <p>Sign in to follow the research journey behind every BSN product.</p>
          <div class="dd-btns">
            <button class="dd-login" onclick="showModal('login')">Log In</button>
            <button class="dd-reg" onclick="showModal('register')">Register</button>
          </div>
        </div>
        <!-- Logged in -->
        <div id="ddIn" style="display:none">
          <div class="dd-user">
            <div class="dd-avatar" id="ddAvatar">A</div>
            <div class="dd-name" id="ddName">User</div>
            <div class="dd-email" id="ddEmail">user@bsn.ai</div>
            <div class="dd-badge"><span class="dd-badge-dot"></span>BSN MEMBER</div>
          </div>
          <button class="dd-item" onclick="openJourney()">
            <svg viewBox="0 0 24 24"><path d="M12 2v20M2 8h6M2 16h6M16 8h6M16 16h6"/></svg>Research Journey
          </button>
          <a href="#products" class="dd-item" onclick="togProfile()">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Products
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
  <a href="#mehnat" onclick="togMob()">Mehnat</a>
  <a href="#products" onclick="togMob()">Products</a>
  <a href="#experiments" onclick="togMob()">Experiments</a>
  <a href="#vision" onclick="togMob()">Vision</a>
  <a href="#research" onclick="togMob()">Research</a>
  <a href="#join" onclick="togMob()">Join</a>
  <div class="mob-bottom">
    <a href="https://mehnat-eight.vercel.app/" target="_blank" rel="noopener" class="mob-demo">
      <span style="width:6px;height:6px;border-radius:50%;background:var(--e);box-shadow:0 0 6px var(--e)"></span>Try Mehnat
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

    <p class="ferr" id="authErr"></p>

    <!-- Login -->
    <div id="fLogin">
      <div class="fg"><label class="fl">EMAIL</label><input type="email" class="fi2" id="lEmail" placeholder="you@example.com"></div>
      <div class="fg"><label class="fl">PASSWORD</label><input type="password" class="fi2" id="lPass" placeholder="••••••••"></div>
      <button class="fsub" onclick="doLogin()" id="lBtn">Sign In to BSN</button>
      <p class="ffoot">No account? <a href="#" onclick="switchTab('register')">Register free</a></p>
    </div>

    <!-- Register -->
    <div id="fReg" style="display:none">
      <div class="fg"><label class="fl">FULL NAME</label><input type="text" class="fi2" id="rName" placeholder="Your name"></div>
      <div class="fg"><label class="fl">EMAIL</label><input type="email" class="fi2" id="rEmail" placeholder="you@example.com"></div>
      <div class="fg"><label class="fl">PHONE</label><input type="tel" class="fi2" id="rPhone" placeholder="9999999999"></div>
      <div class="fg"><label class="fl">ROLE</label><input type="text" class="fi2" id="rRole" placeholder="Founder / Student / Developer"></div>
      <div class="fg"><label class="fl">LOOKING FOR</label><input type="text" class="fi2" id="rLookingFor" placeholder="What are you looking for?"></div>
      <div class="fg"><label class="fl">PASSWORD</label><input type="password" class="fi2" id="rPass" placeholder="Create a password"></div>
      <button class="fsub" onclick="doRegister()" id="rBtn">Create Account</button>
      <p class="ffoot">Have an account? <a href="#" onclick="switchTab('login')">Sign in</a></p>
    </div>
  </div>
</div>

<!-- ═══ RESEARCH JOURNEY (post-login view) ═══ -->
<div class="jview" id="jview">
  <div class="jv-head">
    <div class="jv-brand"><img src="/logo.png" alt="BSN"><div><div class="nav-bsn">BSN</div><div class="nav-sub">RESEARCH JOURNEY</div></div></div>
    <button class="jv-close" onclick="closeJourney()">✕ CLOSE</button>
  </div>
  <div class="jv-inner">
    <div class="jv-hello">
      <span class="slbl">WELCOME BACK</span>
      <h2 class="stit">Hello, <em id="jvName">Explorer</em> 👋</h2>
      <p class="jv-sub">This is the record of every product we have researched, experimented with, and shipped. Nothing here is a promise — it's a log of work done.</p>
      <div class="jv-stats">
        <div class="jvs"><div class="n">3</div><div class="l">SHIPPED &amp; LIVE</div></div>
        <div class="sdiv"></div>
        <div class="jvs"><div class="n">2</div><div class="l">IN BETA</div></div>
        <div class="sdiv"></div>
        <div class="jvs"><div class="n">4</div><div class="l">RESEARCH RECORDS</div></div>
      </div>
    </div>

    <div class="jv-timeline">

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot live"></span><span class="jrec-line"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag live">SHIPPED · LIVE</span><span class="jrec-id">REC-009</span></div>
          <h3>Mehnat <span class="jhero">HERO PRODUCT</span></h3>
          <p class="jrec-what"><strong>Researched:</strong> proof-of-work behavior loops — points that move only when a verified video is recorded. Streak decay, freeze tokens, rank multipliers (Iron → up), squads where the streak survives only if everyone records.</p>
          <p class="jrec-out"><strong>Outcome:</strong> shipped as a live social effort-tracker. 13-week verified-effort grid, ranked ladder, community grind.</p>
          <a class="jrec-link" href="https://mehnat-eight.vercel.app/" target="_blank" rel="noopener">Open Mehnat →</a>
        </div>
      </div>

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot live"></span><span class="jrec-line"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag live">SHIPPED · LIVE</span><span class="jrec-id">REC-008</span></div>
          <h3>Dewleaf — AI Skin &amp; Scalp Advisor</h3>
          <p class="jrec-what"><strong>Researched:</strong> staged severity classification from a short questionnaire (e.g. "Breakouts — Stage 2 of 5") and automatic AM/PM routine generation, in under a minute.</p>
          <p class="jrec-out"><strong>Outcome:</strong> shipped free to use. Cosmetic guidance only — clearly labelled not a medical diagnosis.</p>
          <a class="jrec-link" href="https://skin-advisor.onrender.com" target="_blank" rel="noopener">Try Dewleaf →</a>
        </div>
      </div>

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot live"></span><span class="jrec-line"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag live">SHIPPED</span><span class="jrec-id">REC-007</span></div>
          <h3>AI Real Estate Sales Assistant</h3>
          <p class="jrec-what"><strong>Researched:</strong> a 6-step lead pipeline — inquiry → AI qualification → HOT/WARM/COLD scoring → instant response → automated follow-ups → agent hand-off. Built with Node.js, Express, Groq AI, Gmail SMTP.</p>
          <p class="jrec-out"><strong>Outcome:</strong> working assistant with agent dashboard and daily lead digest email.</p>
        </div>
      </div>

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot beta"></span><span class="jrec-line"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag beta">IN BETA</span><span class="jrec-id">REC-006</span></div>
          <h3>Digital Twin Engine</h3>
          <p class="jrec-what"><strong>Researched:</strong> real-time sensor sync, predictive failure modeling, and reusable industry templates for manufacturing, healthcare and logistics twins.</p>
          <p class="jrec-out"><strong>Outcome:</strong> working beta; predictive simulations run against live sensor feeds.</p>
        </div>
      </div>

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot beta"></span><span class="jrec-line"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag beta">IN BETA</span><span class="jrec-id">REC-005</span></div>
          <h3>3D World Architect</h3>
          <p class="jrec-what"><strong>Researched:</strong> virtual environment building with real-time physics simulation and export paths to Unity / Unreal.</p>
          <p class="jrec-out"><strong>Outcome:</strong> beta builder for immersive 3D business environments and photorealistic digital twins.</p>
        </div>
      </div>

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot done"></span><span class="jrec-line"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag done">RESEARCH COMPLETE</span><span class="jrec-id">REC-004</span></div>
          <h3>Investment Analyzer</h3>
          <p class="jrec-what"><strong>Researched:</strong> AI analysis of investment memos, pitch decks and financials — confidence scoring, risk &amp; red-flag detection, auto-generated follow-up questions.</p>
          <p class="jrec-out"><strong>Outcome:</strong> research validated; feeds our own internal deal-review process.</p>
        </div>
      </div>

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot done"></span><span class="jrec-line"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag done">RESEARCH COMPLETE</span><span class="jrec-id">REC-003</span></div>
          <h3>Autonomous Ops Agent</h3>
          <p class="jrec-what"><strong>Researched:</strong> end-to-end workflow automation — procurement, scheduling, reporting — with cost-reduction analytics and 24/7 agent monitoring.</p>
          <p class="jrec-out"><strong>Outcome:</strong> automation patterns proven; techniques reused across every product we ship.</p>
        </div>
      </div>

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot res"></span><span class="jrec-line"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag res">ACTIVE RESEARCH</span><span class="jrec-id">REC-002</span></div>
          <h3>Ocean Revival Agent</h3>
          <p class="jrec-what"><strong>Researching:</strong> satellite data ingestion, AI-guided cleanup fleet coordination, and global ecosystem health reporting.</p>
          <p class="jrec-out"><strong>Status:</strong> open research — findings published as they mature.</p>
        </div>
      </div>

      <div class="jrec">
        <div class="jrec-rail"><span class="jrec-dot concept"></span></div>
        <div class="jrec-card">
          <div class="jrec-top"><span class="jtag concept">FRONTIER · LONG-HORIZON</span><span class="jrec-id">REC-001</span></div>
          <h3>Frontier Explorer</h3>
          <p class="jrec-what"><strong>Exploring:</strong> long-horizon questions in consciousness, emotion-driven energy mapping and multiversal theory. Explicitly speculative — funded by product revenue, never sold as a product.</p>
          <p class="jrec-out"><strong>Status:</strong> concept stage. We publish notes, not promises.</p>
        </div>
      </div>

    </div>
  </div>
</div>

<!-- ═══ HERO ═══ -->
<section class="hero">
  <div class="hero-inner">
    <div>
      <div class="h-eye"><span class="e-dot"></span>AI PRODUCT STUDIO · DELHI, INDIA</div>
      <h1 class="ht">
        We Research.<br>We Build.<br>
        <span class="hem">We Ship</span><br>
        <span class="hgrad">AI Products.</span>
      </h1>
      <p class="h-body">BSN is a product company. Every product starts as an <strong>AI research record</strong>, becomes an <strong>experiment</strong>, and ships as something you can use today — like <strong>Mehnat</strong>, our live effort-tracking app. Product revenue funds our long-horizon research.</p>
      <div class="h-acts">
        <a href="https://mehnat-eight.vercel.app/" target="_blank" rel="noopener" class="bp2">Try Mehnat — Live Now →</a>
        <a href="#experiments" class="bo2">See the Experiments</a>
      </div>
      <div class="h-stats">
        <div class="hs"><div class="n">3</div><div class="l">PRODUCTS SHIPPED</div></div>
        <div class="sdiv"></div>
        <div class="hs"><div class="n">9</div><div class="l">RESEARCH RECORDS</div></div>
        <div class="sdiv"></div>
        <div class="hs"><div class="n">100%</div><div class="l">BUILT IN-HOUSE</div></div>
      </div>
    </div>

    <div class="hero-vis">
      <div class="c3w">
        <div class="c3">
          <div class="c3-live"><span class="c3-ldot"></span>LIVE</div>
          <img src="/logo.png" alt="BSN" class="c3-logo">
          <div class="c3-name">BANDNA SHRI NIKA</div>
          <div class="c3-tag">RESEARCH → EXPERIMENT → PRODUCT</div>
          <div class="c3-stats">
            <div class="c3s"><span class="c3s-l">Hero Product</span><span class="c3s-r">MEHNAT · LIVE</span></div>
            <div class="c3s"><span class="c3s-l">Latest Ship</span><span class="c3s-r">DEWLEAF</span></div>
            <div class="c3s"><span class="c3s-l">In Beta</span><span class="c3s-r">2 PRODUCTS</span></div>
          </div>
        </div>
      </div>
      <div class="ob" style="top:6%;left:-4%;--od:8s;--odb:0s;"><span class="ob-dot"></span>🔥 Mehnat Live</div>
      <div class="ob" style="bottom:18%;right:-6%;--od:10s;--odb:2s;"><span class="ob-dot"></span>🍃 Dewleaf Shipped</div>
      <div class="ob" style="top:42%;right:-9%;--od:9s;--odb:1s;"><span class="ob-dot"></span>🏠 RE Assistant</div>
      <div class="ob" style="bottom:7%;left:-2%;--od:11s;--odb:3s;"><span class="ob-dot"></span>🧪 9 Research Records</div>
    </div>
  </div>
  <div class="sc-hint"><span>SCROLL</span><div class="sc-line"></div></div>
</section>

<!-- ═══ MEHNAT — HERO PRODUCT ═══ -->
<section id="mehnat" class="s-mh">
  <div class="si">
    <div class="mh-grid">
      <div class="rv">
        <span class="slbl" style="color:#ff6a3d">HERO PRODUCT · LIVE NOW</span>
        <h2 class="stit mh-title">MEHNAT<span class="mh-dot">.</span></h2>
        <p class="mh-tag">"NOTHING COUNTS UNTIL IT'S ON CAMERA."</p>
        <p class="mh-body">Mehnat is a social effort-tracker built on one rule: <strong>points move only when you record</strong>. No verified video, no progress. Streaks decay, ranks multiply your points, and in a squad the streak survives only if <em>everyone</em> records.</p>
        <div class="mh-feats">
          <div class="mh-f"><span class="mh-fi">🎥</span><div><strong>Verified video proof</strong><p>One verified video a day keeps everything alive — streak, rank, points.</p></div></div>
          <div class="mh-f"><span class="mh-fi">🔥</span><div><strong>Streaks &amp; freezes</strong><p>Grind-day tracking with limited freeze tokens. Miss a day, feel it.</p></div></div>
          <div class="mh-f"><span class="mh-fi">🏆</span><div><strong>Ranked ladder</strong><p>Climb from Iron up. Higher rank = higher point multiplier.</p></div></div>
          <div class="mh-f"><span class="mh-fi">👥</span><div><strong>Squads</strong><p>Shared streaks. The squad survives only if every member records.</p></div></div>
        </div>
        <div class="h-acts" style="margin-top:26px">
          <a href="https://mehnat-eight.vercel.app/" target="_blank" rel="noopener" class="bp-mh">Open Mehnat →</a>
          <a href="#experiments" class="bo2">Read the experiment</a>
        </div>
      </div>
      <div class="rv d2">
        <div class="mh-shot">
          <div class="mh-shot-bar"><span></span><span></span><span></span><em>mehnat-eight.vercel.app</em></div>
          <img src="/products/mehnat-dashboard.png" alt="Mehnat dashboard — points move only when you record" onerror="this.parentElement.classList.add('noimg')">
          <div class="mh-shot-fallback">
            <div class="mh-fb-title">NOTHING COUNTS<br>UNTIL IT'S ON CAMERA.</div>
            <div class="mh-fb-row"><span>WALLET</span><strong>0 PTS — moves only when you record</strong></div>
            <div class="mh-fb-row"><span>RANK</span><strong>IRON · ×1 multiplier</strong></div>
            <div class="mh-fb-row"><span>EFFORT</span><strong>13-week verified grid</strong></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ PRODUCTS ═══ -->
<section id="products" class="s-dk">
  <div class="si">
    <div class="rv" style="text-align:center">
      <span class="slbl">SHIPPED · YOU CAN USE THESE TODAY</span>
      <h2 class="stit">Products, Not <em>Promises</em></h2>
      <p class="sect-sub">Everything below is live or in users' hands — each one grew out of a research record you can trace in our journey.</p>
    </div>
    <div class="prod-grid">
      <div class="prod-card rv d1">
        <div class="prod-top"><span class="jtag live">LIVE</span><span class="prod-ico">🔥</span></div>
        <h3>Mehnat</h3>
        <p class="prod-line">Social effort-tracker. Points move only when you record a verified video. Streaks, ranks, squads.</p>
        <a class="prod-link" href="https://mehnat-eight.vercel.app/" target="_blank" rel="noopener">mehnat-eight.vercel.app →</a>
      </div>
      <div class="prod-card rv d2">
        <div class="prod-top"><span class="jtag live">LIVE · FREE</span><span class="prod-ico">🍃</span></div>
        <h3>Dewleaf</h3>
        <p class="prod-line">AI skin &amp; scalp advisor. Answer a few questions, get a staged result and a full AM/PM routine in under a minute.</p>
        <a class="prod-link" href="https://skin-advisor.onrender.com" target="_blank" rel="noopener">skin-advisor.onrender.com →</a>
      </div>
      <div class="prod-card rv d3">
        <div class="prod-top"><span class="jtag live">SHIPPED</span><span class="prod-ico">🏠</span></div>
        <h3>AI Real Estate Sales Assistant</h3>
        <p class="prod-line">Qualifies leads, scores them HOT/WARM/COLD, responds instantly and nurtures with automated follow-ups. Agent dashboard + daily digest.</p>
        <span class="prod-link muted">Available for deployment — book a walkthrough</span>
      </div>
    </div>
    <p class="prod-note rv">Every product above links back to a research record. <a href="#" onclick="requireLoginForJourney(event)">Sign in to browse the full Research Journey →</a></p>
  </div>
</section>

<!-- ═══ EXPERIMENTS & DOCUMENTS (replaces pricing) ═══ -->
<section id="experiments" class="s-dk s-xp">
  <div class="si">
    <div class="ph rv">
      <span class="slbl">LAB NOTES · REAL DOCUMENTS</span>
      <h2 class="stit">Experiments That Became<br><em>Products</em></h2>
      <p>We don't publish rate cards. We publish the experiments — hypothesis, method, and what shipped.</p>
    </div>
    <div class="xp-grid">

      <div class="xp-card rv d1">
        <div class="xp-img">
          <img src="/experiments/automation-first.jpg" alt="BSN — The smartest businesses are automating first" onerror="this.parentElement.classList.add('noimg')">
          <div class="xp-img-fb">📄 AUTOMATION-FIRST · DOC</div>
        </div>
        <div class="xp-body">
          <div class="xp-meta"><span class="xp-id">EXP-001</span><span class="jtag done">VALIDATED</span></div>
          <h3>Automate the Repetitive</h3>
          <p><strong>Hypothesis:</strong> repetitive business tasks can be automated end-to-end with AI workflows.<br><strong>Method:</strong> automation pipelines across scheduling, reporting and follow-ups.<br><strong>Shipped into:</strong> Autonomous Ops Agent research + every product we build.</p>
        </div>
      </div>

      <div class="xp-card rv d2">
        <div class="xp-img">
          <img src="/experiments/real-estate-assistant.jpg" alt="AI Real Estate Sales Assistant — full experiment document" onerror="this.parentElement.classList.add('noimg')">
          <div class="xp-img-fb">📄 RE SALES ASSISTANT · DOC</div>
        </div>
        <div class="xp-body">
          <div class="xp-meta"><span class="xp-id">EXP-002</span><span class="jtag live">SHIPPED</span></div>
          <h3>AI Lead Qualification</h3>
          <p><strong>Hypothesis:</strong> AI can score property leads HOT/WARM/COLD and respond faster than any human agent.<br><strong>Method:</strong> 6-step pipeline — inquiry → AI analysis → scoring → instant response → follow-ups → agent hand-off.<br><strong>Shipped into:</strong> AI Real Estate Sales Assistant (Node.js · Express · Groq AI).</p>
        </div>
      </div>

      <div class="xp-card rv d3">
        <div class="xp-img">
          <img src="/experiments/dewleaf.jpg" alt="Dewleaf — Your skin, figured out" onerror="this.parentElement.classList.add('noimg')">
          <div class="xp-img-fb">📄 DEWLEAF · DOC</div>
        </div>
        <div class="xp-body">
          <div class="xp-meta"><span class="xp-id">EXP-003</span><span class="jtag live">SHIPPED</span></div>
          <h3>Staged Skin Classification</h3>
          <p><strong>Hypothesis:</strong> a short questionnaire can drive a useful, staged skin &amp; scalp assessment.<br><strong>Method:</strong> severity staging ("Stage 2 of 5") + generated AM/PM routines, under 60 seconds.<br><strong>Shipped into:</strong> Dewleaf — live and free. Cosmetic guidance, not medical diagnosis.</p>
        </div>
      </div>

      <div class="xp-card rv d4">
        <div class="xp-img">
          <img src="/products/mehnat-dashboard.png" alt="Mehnat — verified effort dashboard" onerror="this.parentElement.classList.add('noimg')">
          <div class="xp-img-fb">📄 MEHNAT · DASHBOARD</div>
        </div>
        <div class="xp-body">
          <div class="xp-meta"><span class="xp-id">EXP-004</span><span class="jtag live">LIVE · HERO</span></div>
          <h3>Proof-of-Work Motivation</h3>
          <p><strong>Hypothesis:</strong> effort tracked with verified video changes behavior more than self-reported check-ins.<br><strong>Method:</strong> points that move only on recording, streak decay, rank multipliers, squad-shared streaks.<br><strong>Shipped into:</strong> Mehnat — our hero product, live now.</p>
        </div>
      </div>

    </div>
    <p class="pfooter">Want the full write-ups? Register — the Research Journey holds every record from concept to ship.</p>
  </div>
</section>

<!-- ═══ VISION ═══ -->
<section id="vision" class="s-wh">
  <div class="si">
    <div class="rv" style="text-align:center">
      <span class="slbl" style="color:#064e23">OUR NORTH STAR</span>
      <h2 class="stit" style="color:#031508">Products Fund<br><em style="color:#0a6636;font-style:italic;font-weight:300">the Research</em></h2>
    </div>
    <div class="vis-grid">
      <div class="vc rv d1"><span class="vcn">01</span><span class="vcico">🧪</span><h3>Research First</h3><p>Every product starts as a research record — a hypothesis about what AI can do, tested honestly before a line of product code is written.</p></div>
      <div class="vc rv d2"><span class="vcn">02</span><span class="vcico">🚀</span><h3>Ship Real Products</h3><p>Research that survives becomes an experiment; experiments that work become products people use — Mehnat, Dewleaf, the RE Assistant.</p></div>
      <div class="vc rv d3"><span class="vcn">03</span><span class="vcico">🌊</span><h3>Fund the Frontier</h3><p>Product revenue funds our long-horizon research: biotechnology, ocean revival, and open questions about consciousness.</p></div>
    </div>
    <div class="vquote rv">
      <p>"We don't sell the future. We ship the present — and let the products pay for the future."</p>

      <!-- Dual founders -->
      <div class="founders-row">
        <div class="founder-sig">
          <div class="founder-avatar" style="background:linear-gradient(135deg,#052e16,#064e23)">
            <div class="av-pulse"></div>
            A
          </div>
          <div class="founder-name">Aryan</div>
          <div class="founder-role">FOUNDER</div>
        </div>
        <div class="founders-divider"></div>
        <div class="founder-sig">
          <div class="founder-avatar" style="background:linear-gradient(135deg,#064e23,#0a6636)">
            <div class="av-pulse" style="animation-delay:.8s"></div>
            VD
          </div>
          <div class="founder-name">Vansh Dhiman</div>
          <div class="founder-role">CO-FOUNDER</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ TEAM SECTION ═══ -->
<section id="team" class="team-section">
  <div class="si">
    <div class="rv" style="text-align:center">
      <span class="slbl">THE MINDS BEHIND BSN</span>
      <h2 class="stit">Our <em>Founders</em></h2>
      <p style="font-size:14px;color:rgba(255,255,255,.4);margin-top:12px;max-width:440px;margin-left:auto;margin-right:auto;line-height:1.7">Two builders shipping AI products and logging every step of the research behind them.</p>
    </div>
    <div class="team-grid">
      <div class="team-card rv d1">
        <div class="team-av" style="background:linear-gradient(135deg,#052e16,#0a5c2c)">
          <div class="ring"></div>
          <div class="ring2"></div>
          A
        </div>
        <div class="team-name">Aryan</div>
        <div class="team-role">FOUNDER &amp; CEO</div>
        <p class="team-bio">Product lead behind Mehnat, Dewleaf and the BSN research pipeline — turning AI research records into shipped products.</p>
        <div class="team-tags">
          <span class="team-tag">Product</span>
          <span class="team-tag">AI Research</span>
          <span class="team-tag">Vision</span>
        </div>
      </div>
      <div class="team-card rv d2">
        <div class="team-av" style="background:linear-gradient(135deg,#064e23,#0d6b31)">
          <div class="ring" style="animation-delay:.5s"></div>
          <div class="ring2" style="animation-delay:1.1s"></div>
          VD
        </div>
        <div class="team-name">Vansh Dhiman</div>
        <div class="team-role">CO-FOUNDER</div>
        <p class="team-bio">Co-architect of BSN's product engine — building the systems that carry an idea from research record to live product.</p>
        <div class="team-tags">
          <span class="team-tag">Co-Founder</span>
          <span class="team-tag">Engineering</span>
          <span class="team-tag">Strategy</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══ RESEARCH (long-horizon) ═══ -->
<section id="research" class="s-lt">
  <div class="si">
    <div class="rv" style="text-align:center">
      <span class="slbl" style="color:#064e23">FUNDED BY PRODUCT REVENUE · LONG-HORIZON</span>
      <h2 class="stit" style="color:#031508">The Research Our<br><em style="color:#0a6636;font-style:italic;font-weight:300">Products Pay For</em></h2>
      <p class="sect-sub" style="color:rgba(3,26,13,.5)">Clearly labelled long-horizon work. We publish notes, not promises — and we never sell this as a product.</p>
    </div>
    <div class="res-grid">
      <div class="rc rv d1"><span class="rcico">🧬</span><h3>Biotechnology</h3><p>Biotech approaches to recycling plastics and restoring marine ecosystems.</p><span class="rcn">01</span></div>
      <div class="rc rv d2"><span class="rcico">🌊</span><h3>Ocean Revival</h3><p>AI-guided cleanup coordination and ecosystem health monitoring — see REC-002 in the journey.</p><span class="rcn">02</span></div>
      <div class="rc rv d3"><span class="rcico">🧘</span><h3>Emotional Intelligence</h3><p>Exploratory work on emotional states and motivation — already informing products like Mehnat.</p><span class="rcn">03</span></div>
      <div class="rc rv d4"><span class="rcico">🌌</span><h3>Frontier Questions</h3><p>Speculative, curiosity-driven research into consciousness and the universe. Concept stage, honestly labelled.</p><span class="rcn">04</span></div>
    </div>
  </div>
</section>

<!-- ═══ HOW WE WORK ═══ -->
<section id="model" class="s-mid">
  <div class="si">
    <div style="text-align:center;margin-bottom:52px" class="rv">
      <span class="slbl">HOW IT WORKS</span>
      <h2 class="stit">The Product <em>Journey</em></h2>
    </div>
    <div class="cyc rv">
      <div class="cycs"><div class="cycn">01</div><h3>Research Record</h3><p>Every idea starts as a logged research record — hypothesis in, honest findings out</p></div>
      <div class="cyca">→</div>
      <div class="cycs"><div class="cycn">02</div><h3>Experiment</h3><p>Findings become working experiments — documented, tested, and published as lab notes</p></div>
      <div class="cyca">→</div>
      <div class="cycs"><div class="cycn">03</div><h3>Shipped Product</h3><p>Experiments that survive become live products — and their revenue funds the next record</p></div>
    </div>
  </div>
</section>

<!-- ═══ JOIN ═══ -->
<section id="join" class="s-lt">
  <div class="si">
    <div class="join-in rv">
      <div class="jbg"><span style="width:6px;height:6px;border-radius:50%;background:#064e23;display:inline-block"></span>APPLICATION OPEN</div>
      <h2 class="stit" style="color:#031508;margin-bottom:14px">Follow the<br><em style="color:#0a6636;font-style:italic;font-weight:300">Journey</em></h2>
      <p class="jbody">Whether you're an investor, researcher, developer or early user — register to unlock the full Research Journey and see every record from concept to shipped product. We personally review every submission.</p>
      <button type="button" class="bjoin" onclick="showModal('register')">Create Your BSN Profile →</button>
      <p class="jnote">TAKES UNDER 3 MINUTES · REVIEWED WITHIN 48 HOURS</p>
      <p style="margin-top:22px"><a href="#" onclick="bookDemo(event)" style="font-size:12px;color:#0a6636;font-weight:600;text-decoration:none">Prefer to talk? Book a 30-minute call with the founders →</a></p>
    </div>
  </div>
</section>

<!-- ═══ FOOTER ═══ -->
<footer>
  <div class="fi">
    <div class="flogo"><img src="/logo.png" alt="BSN"><span class="fb">BSN</span></div>
    <div class="flinks"><a href="https://mehnat-eight.vercel.app/" target="_blank" rel="noopener">Mehnat</a><a href="https://skin-advisor.onrender.com" target="_blank" rel="noopener">Dewleaf</a><a href="#experiments">Experiments</a><a href="#">Privacy</a><a href="#">© 2026 Bandna Shri Nika</a></div>
    <div class="fcopy">Built with love in Delhi, India<br>Research → Experiment → Product<br><span style="font-size:9px;color:rgba(255,255,255,.18);letter-spacing:1.5px">FOUNDED BY </span><span style="color:rgba(16,185,129,.6);font-weight:500">Aryan</span><span style="color:rgba(255,255,255,.18);margin:0 4px">&amp;</span><span style="color:rgba(52,211,153,.7);font-weight:600">Vansh Dhiman</span></div>
  </div>
</footer>


`;

export default function App() {
  useEffect(() => {

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
    const setErr=msg=>{const el=document.getElementById('authErr');el.textContent=msg||'';el.style.display=msg?'block':'none'};
    window.showModal=function(tab){
      document.getElementById('authModal').classList.add('open');
      document.body.style.overflow='hidden';
      setErr('');
      window.switchTab(tab||'login');
      pOpen=false;document.getElementById('authDD').classList.remove('open');
    }
    window.closeModal=function(){document.getElementById('authModal').classList.remove('open');document.body.style.overflow='';setErr('')}
    window.outClose=function(e){if(e.target===document.getElementById('authModal'))closeModal()}
    window.switchTab=function(t){
      setErr('');
      document.getElementById('tLogin').classList.toggle('active',t==='login');
      document.getElementById('tReg').classList.toggle('active',t==='register');
      document.getElementById('fLogin').style.display=t==='login'?'block':'none';
      document.getElementById('fReg').style.display=t==='register'?'block':'none';
    }
    window.bookDemo=function(e){
      if(e){e.preventDefault();}
      const start=new Date(Date.now()+24*60*60*1000);
      start.setMinutes(0,0,0);
      const end=new Date(start.getTime()+30*60*1000);
      const fmt=d=>d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
      const params=new URLSearchParams({
        action:'TEMPLATE',
        text:'BSN Product Walkthrough & Research Journey',
        dates:fmt(start)+'/'+fmt(end),
        details:'30-minute call with Aryan — BSN products (Mehnat, Dewleaf, AI Real Estate Assistant) and the research journey behind them.',
        add:'aryan.datta.940@gmail.com'
      });
      window.open('https://calendar.google.com/calendar/render?'+params.toString(),'_blank');
    }

    /* RESEARCH JOURNEY VIEW */
    window.openJourney=function(){
      const u=JSON.parse(localStorage.getItem('bsnUser')||'null');
      if(!u){window.showModal('login');return}
      document.getElementById('jvName').textContent=(u.name||'Explorer').split(' ')[0];
      document.getElementById('jview').classList.add('open');
      document.body.style.overflow='hidden';
      pOpen=false;document.getElementById('authDD').classList.remove('open');
    }
    window.closeJourney=function(){
      document.getElementById('jview').classList.remove('open');
      document.body.style.overflow='';
    }
    window.requireLoginForJourney=function(e){
      if(e)e.preventDefault();
      window.openJourney();
    }

    /* AUTH */
    window.doLogin=async function(){
      const email=document.getElementById('lEmail').value.trim(),pass=document.getElementById('lPass').value;
      if(!email||!pass){setErr('Please fill in email and password.');return}
      const btn=document.getElementById('lBtn');btn.disabled=true;btn.textContent='Signing in…';
      try{
        const res=await fetch('https://bsnjavabackend.onrender.com/api/users/login',{
          method:'POST',
          headers:{'accept':'*/*','Content-Type':'application/json'},
          body:JSON.stringify({email,password:pass})
        });
        if(!res.ok) throw new Error('login failed');
        const data=await res.json();
        const name=data.fullName || email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
        const user={name,email:data.email || email};
        localStorage.setItem('bsnUser',JSON.stringify(user));
        window.loginUser(user);window.closeModal();
        window.openJourney();
      }catch(err){
        console.error(err);
        setErr('Login failed — check your email and password, then try again.');
      }finally{btn.disabled=false;btn.textContent='Sign In to BSN'}
    }
    window.doRegister=async function(){
      const name=document.getElementById('rName').value.trim(),email=document.getElementById('rEmail').value.trim(),phone=document.getElementById('rPhone').value.trim(),role=document.getElementById('rRole').value.trim(),lookingFor=document.getElementById('rLookingFor').value.trim(),pass=document.getElementById('rPass').value;
      if(!name||!email||!phone||!role||!lookingFor||!pass){setErr('Please fill in all fields.');return}
      const btn=document.getElementById('rBtn');btn.disabled=true;btn.textContent='Creating account…';
      try{
        const res=await fetch('https://bsnjavabackend.onrender.com/api/users',{
          method:'POST',
          headers:{'accept':'*/*','Content-Type':'application/json'},
          body:JSON.stringify({fullName:name,email,phone,role,lookingFor,password:pass})
        });
        if(!res.ok) throw new Error('signup failed');
        const data=await res.json();
        const user={name:data.fullName || name,email:data.email || email};
        localStorage.setItem('bsnUser',JSON.stringify(user));
        window.loginUser(user);window.closeModal();
        window.openJourney();
      }catch(err){
        console.error(err);
        setErr('Signup failed — please try again in a moment.');
      }finally{btn.disabled=false;btn.textContent='Create Account'}
    }
    window.loginUser=function(u){
      document.getElementById('ddOut').style.display='none';
      document.getElementById('ddIn').style.display='block';
      const displayName=u.name || u.fullName || 'User';
      document.getElementById('ddAvatar').textContent=displayName.charAt(0).toUpperCase();
      document.getElementById('ddName').textContent=displayName;
      document.getElementById('ddEmail').textContent=u.email || '';
      document.getElementById('onlineDot').style.display='block';
    }
    window.doLogout=function(){
      localStorage.removeItem('bsnUser');
      document.getElementById('ddOut').style.display='block';
      document.getElementById('ddIn').style.display='none';
      document.getElementById('onlineDot').style.display='none';
      window.closeJourney();
      pOpen=false;document.getElementById('authDD').classList.remove('open');
    }

    /* REVEAL */
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vi');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
    document.querySelectorAll('.rv').forEach(el=>io.observe(el));

    /* WEBGL PARTICLES */
    (function(){
      const c=document.getElementById('bg'),gl=c.getContext('webgl');
      if(!gl)return;
      function resize(){c.width=innerWidth;c.height=innerHeight;gl.viewport(0,0,c.width,c.height)}
      resize();window.addEventListener('resize',resize,{passive:true});
      const VS='attribute vec3 p;attribute float s;attribute float a;uniform float t;varying float va;void main(){vec3 q=p;q.y=mod(q.y+t*.03,2.)-1.;gl_Position=vec4(q.x*.6,q.y,0,1);gl_PointSize=s;va=a;}';
      const FS='precision mediump float;varying float va;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.06,.73,.51,va*(1.-d*1.8));}';
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

    /* Restore session (name + email only) */
    const savedUser = JSON.parse(localStorage.getItem('bsnUser') || 'null');
    if(savedUser && savedUser.email){ window.loginUser(savedUser); }
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: pageHtml }} />;
}
