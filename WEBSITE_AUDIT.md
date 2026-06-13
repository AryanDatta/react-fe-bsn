# BSN Website Audit — Mapped to Code

**Audited:** `bsn-react-starter` · June 2026
**Goal of the plan:** make the site *sell a clear AI service*, not just explain a big vision.

## How the site is built (read this first)

The entire homepage lives as one HTML string called `pageHtml` in **`src/App.jsx`, lines 9–460**. There are no separate component files for sections — every homepage change is an edit inside that string. The interactive logic (auth, chatbot, animations) is the `useEffect` below it (lines 462–932).

The **AI Dashboard / agent marketplace** is a separate page, **`src/Dashboard.jsx`** (the "investment / 3d-world / ops / digital-twin / ocean / multiverse" agents live there).

Two things to know before editing:
- **No "NUNCHI" text exists in the code.** The "philosophy" content you want to separate is actually the *consciousness / multiverse / emotion-driven energies / Bandna Shri Nika* theme. Treat those as the philosophy track.
- **There's a pricing contradiction already live:** the hero/pricing section sells managed plans at ₹99K–₹2.99L/mo (App.jsx 405–435), but the chatbot tells users "Marketplace agents start at a one-time ₹4,999" (App.jsx 859). Pick one story before launch.

---

## 1. Make the offer clear in the first 5 seconds

**Where:** `src/App.jsx`, hero section, lines **182–226**.

**Current (lines 186–196):**
- Eyebrow (186): `SEED STAGE · DELHI, INDIA`
- H1 (187–191): "Autonomous AI Agents for the **3D World** & **the Multiverse**"
- Body (192): "Deploy enterprise AI agents, AI digital twins and agentic AI that slash operations costs by 70%+ — so we can fund pioneering biotechnology, ocean revival, and steps toward the multiverse."
- Buttons (193–196): `Start the Journey →` and `Book a Demo`

**Problem:** A first-time buyer reads "3D World," "Multiverse," "digital twins" and cannot tell what they can actually buy. The headline leads with vision, not the product.

**Change to:**
- **H1:** "We build **AI automation systems** for businesses to save time, generate leads, and improve customer response."
- **Buttons:** rename `Start the Journey →` → **`Book Free AI Consultation`** (it already calls `bookDemo()` indirectly — point it at `bookDemo(event)`), and rename `Book a Demo` → **`See AI Demo`**.
- **Eyebrow:** consider `AI AUTOMATION FOR BUSINESSES · DELHI, INDIA`.

**Watch-outs:**
- `See AI Demo` needs somewhere to go. Today `bookDemo()` (lines 533–541) just opens a Google Calendar invite — there is no actual demo. Either link it to the Dashboard (`goDashboard()`) or to a new "Proof of Work" section (see #4).
- The hero stats (197–203: "70%+ cost reduction / 50% profits → research / 4 research pillars") mix a business metric with two mission metrics. Swap "PROFITS → RESEARCH" and "RESEARCH PILLARS" for buyer-relevant proof (e.g. "FASTER LEAD RESPONSE", "SERVICES LIVE").
- The orbiting hero visual (206–209) is Biotech / Ocean / Multiverse — pure philosophy. For a business homepage, consider swapping those orbit labels to your 4 services.

---

## 2. Replace abstract vision with business outcomes

The abstraction is spread across several sections. Exact spots and rewrites:

| Location (App.jsx) | Current abstract copy | Replace with outcome |
|---|---|---|
| 192 (hero body) | "fund pioneering biotechnology, ocean revival… multiverse" | "automate repetitive tasks, capture and qualify leads, and respond to customers faster" |
| 263 (Vision H2) | "From AI Agents to **Awakened Humanity**" | "AI systems that automate your busywork" |
| 266–268 (vision cards) | "Higher Consciousness… emotion-driven energies… multiverse" | reframe as outcomes: less manual work, faster lead response, time saved |
| 339–340 (AI+3D) | "Running the 3D World with Autonomous AI… virtual factories, smart cities, metaverse-scale" | "Automate the repetitive work that slows your team down" |
| 403 / 435 (pricing) | "funds biotechnology, ocean revival… steps toward the multiverse" | what the buyer gets, not where profits go |

Rule of thumb: every "AI / awareness / future intelligence / multiverse" line on the homepage should answer *"what does this do for my business?"*

Good news — your **chatbot FAQ already speaks in outcomes** (App.jsx 855–875: "cut operations costs by 70%+", "deploy in one click", industry list). Mine that copy for the rest of the page.

---

## 3. Add a "What We Build" section

**Status: does not exist.** The closest things are the abstract "AI + 3D" section (334–362) and the separate Dashboard marketplace — neither names the 4 services a buyer is looking for.

**Action:** insert a new `<section id="services">` in `App.jsx`, best placed **right after the Consulting section (after line 256), before Vision**. Use the existing card markup pattern from the Research grid (372–375) or vision grid (266–268) so styling is free.

Four services, each with *problem solved · who it's for · expected benefit*:
1. **AI WhatsApp Assistant** — answers customer messages 24/7 · for businesses losing leads after hours · never miss an enquiry.
2. **AI Lead Qualification System** — scores and routes incoming leads · for sales teams drowning in unqualified leads · spend time only on buyers.
3. **AI Customer Support Bot** — handles FAQs and tickets instantly · for support teams with repetitive queries · faster replies, lower cost.
4. **Custom AI Business Automation** — automates any repetitive workflow · for ops-heavy businesses · cut manual work and errors.

**Mismatch to resolve:** the Dashboard's actual agents (Dashboard.jsx 24–40: Investment Analyzer, 3D World Architect, Autonomous Ops Agent, Digital Twin Engine, Ocean Revival, Multiverse Explorer) are *different* from these 4 services. Decide whether the homepage promises WhatsApp/Lead/Support/Custom and the Dashboard should be updated to match — otherwise a buyer clicks through and sees unrelated products.

Also add these 4 to the **nav** (lines 54–63) and **mobile menu** (108–123) — e.g. a "Services" link.

---

## 4. Add proof without fake clients

**Status: no proof section exists.** There are no testimonials (good — nothing fake to remove). The only credibility elements today are the two founder cards (Team section, 294–331) and the chatbot.

**Action:** add a new `<section id="proof">` titled **"Proof of Work"** (or "AI Systems We Have Built"), placed **before Pricing (before line 397)** so buyers see proof before price. Include:
- Demo videos / screenshots of working agents
- The **Investor Memo Analyzer** — you already have it: it's the "Investment Analyzer" agent (Dashboard.jsx 25–26, id `investment`, LIVE). Feature it here with a screenshot.
- Workflow diagrams
- Before/after process examples

Reuse the card grid styling from Research (`res-grid`, App.jsx 371) or Team (`team-grid`, 301).

---

## 5. Separate the business side from the philosophy side

Right now business and philosophy are interleaved down the whole page. Philosophy/mission content to pull out or push down:

- Hero orbit visuals — Biotech / Ocean / Multiverse (App.jsx **206–209**)
- **Vision** section — "Awakened Humanity", consciousness (**259–291**)
- **Research** section — biotech, ocean, emotion-driven energies, multiverse (**364–378**)
- **Model / Virtuous Cycle** — "50% of profits fund research, ocean cleanup, consciousness" (**380–395**)
- Pricing mission framing (**403, 435**)
- Footer "For the 3D world and beyond" (**457**)

**Recommended structure:**

| Track | Purpose | Where it lives |
|---|---|---|
| **BSN AI Solutions** | businesses & sales | the homepage — hero, services (#3), proof (#4), pricing, contact |
| **NUNCHI / Awareness** | content, education, vision | a *separate page* (new route) or a single clearly-labelled section far down the homepage |

Practically: the app currently routes via `goDashboard()` / `window.location.href` (no router library). To make a real separate philosophy page you'd add lightweight routing (or a second HTML view like Dashboard.jsx already is). Minimum viable version: move all philosophy sections **below** the business content and put them under one banner ("The BSN Mission") so the top of the page is 100% AI solutions.

Reorder the **nav** (54–63) to lead with business: `Services · Proof · Pricing · Book Consultation`, and tuck `Vision · Research` under a "Mission" link.

---

## Suggested execution order

1. **Hero** (App.jsx 182–226) — biggest single win
2. **Services / "What We Build"** (new section after 256)
3. **Proof of Work** (new section before 397)
4. **Outcome-language pass** across sections (table in #2)
5. **Philosophy separation** + nav reorder (largest structural change, do last)

**Before any of this ships, settle two inconsistencies:** (a) the ₹4,999 vs ₹99K+ pricing story, and (b) homepage services vs Dashboard agents must match.
