import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(pipelineDir, '..');

const M = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'metrics.json'), 'utf8'));
const C = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'citations.json'), 'utf8'));
const SERP = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'serp_audit.json'), 'utf8'));
const MAPS = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'maps_audit.json'), 'utf8'));
const ANS = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'ans_full.json'), 'utf8'));

const CITY_NAME = {
  canberra: 'Canberra & ACT (HQ)',
  sydney: 'Sydney, NSW',
  melbourne: 'Melbourne, VIC',
  brisbane: 'Brisbane, QLD',
  perth: 'Perth, WA',
  adelaide: 'Adelaide, SA',
  goldcoast: 'Gold Coast, QLD',
  national: 'National Australia'
};

const PROMPT_NAME = {
  solar_installer: 'Best Residential Solar & Battery Installer',
  battery_storage: 'Sigenergy, Tesla Powerwall 3 & Sungrow Batteries',
  rebates_2026: '2026 Federal & State Battery Rebate Specialists',
  panels_efficiency: 'High-Efficiency Aiko & Jinko Systems (6.6kW–13kW)',
  vpp_three_phase: 'Three-Phase Hybrid Inverters, VPP & Blackout Backup',
  ev_aircon_elec: 'EV Chargers, Battery Retrofits & Air Conditioning',
  platinum_reviews: 'SolarQuotes Platinum-Rated & NETCC Approved'
};

const PLAT_NAME = {
  aimode: 'Google AI Mode',
  chatgpt: 'ChatGPT Search',
  perplexity: 'Perplexity Sonar',
  gemini: 'Gemini 3.8 Flash',
  claude: 'Claude Sonnet 4.6'
};

const lines = [];
lines.push(`# STAG ELECTRICAL — MASTER FORENSIC RAW EVIDENCE LEDGER (OCTOBER 2026)`);
lines.push(`**Target Entity:** Stag Electrical, Solar & Refrigeration Pty Ltd (\`https://www.stagelectrical.com.au/\`)`);
lines.push(`**Founder & Managing Director:** Sam Friend (Est. 2007 · ABN \`37 664 400 828\` / ACN \`664 400 828\`)`);
lines.push(`**Empirical Sample:** $N = 280$ Live Search-Grounded AI Evaluations ($8 \\text{ Markets} \\times 7 \\text{ Prompts} \\times 5 \\text{ Engines}$) + $56$ DataForSEO Australian Google SERP/Local Pack Checks + $8$ DataForSEO Google Maps 20-Pack Audits`);
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## SECTION 1: 1:1 SLIDE-BY-SLIDE EMPIRICAL PROOF INDEX`);
lines.push(`| Slide | Deck Assertion | Verifiable Raw Evidence Source |`);
lines.push(`| :--- | :--- | :--- |`);
lines.push(`| **Slides 1 & 4 (Cover & National)** | STAG Electrical is named in **19 / 280 answers (6.8% SoMV, 95% CI [4.4%, 10.3%], Rank #17 of 65 installers)**. Springers Solar leads with 46, PSW Energy 44, 1KOMMA5° 39, Solargain 38. | \`pipeline/metrics.json\` & Section 6 below (all 280 verbatim answers). |`);
lines.push(`| **Slide 2 (Why It Matters — Search Volume)** | Australian monthly search volume for **“solar installer”** grew **+50% YoY** from **2,400/mo (Oct 2025)** to **3,600/mo (Sep 2026)** (peaking at **4,400/mo** in Mar 2026), alongside **22,200/mo** for **“solar battery”**, **8,100/mo** for **“solar battery rebate”**, and **5,400/mo** each for **“tesla powerwall 3”** and **“sungrow battery”**. | Live **DataForSEO Google Ads Search Volume API** (\`POST https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live\`, \`location_name: "Australia"\`, \`language_name: "English"\`) — full 12-month series in Section 1.5 below. |`);
lines.push(`| **Slides 6–10 (Canberra & ACT Deep Dive)** | STAG Electrical captures **11 / 35 answers (31.4% SoMV, Rank #4)** in Canberra behind SolarHub (33), Mondiaux Solar (16), and ECG Electrical (13). Named across all 5 engines (Claude 4/7, AI Mode 3/7, Perplexity 2/7, ChatGPT 1/7, Gemini 1/7). | \`pipeline/metrics.json\` (\`cities.canberra\`) & Canberra cells #1–#35 in Section 6. |`);
lines.push(`| **Slides 11–17 (Interstate Markets)** | Sydney: **2/35 (5.7%)**; Melbourne: **1/35 (2.9%)**; Adelaide: **1/35 (2.9%)**; Brisbane, Perth & Gold Coast: **0/35 (0.0%)**; National Australia: **4/35 (11.4%)**. | \`pipeline/metrics.json\` & Cells #36–#280 in Section 6. |`);
lines.push(`| **Slide 18 (SERP vs AI Pattern)** | STAG ranks in Google's Organic Top 10 on **2 / 56 queries** (both in Canberra) and **0 / 56 in the Google Local 3-Pack**. | \`pipeline/serp_audit.json\` (Section 4 below). |`);
lines.push(`| **Slide 23 (Cited Sources)** | \`solarquotes.com.au\` is cited in **261 / 280 answers (93.2%)**, \`facebook.com\` (148), \`solarchoice.net.au\` (118), \`reddit.com\` (101), \`productreview.com.au\` (70), \`stagelectrical.com.au\` (16). | \`pipeline/citations.json\` (Section 5 below). |`);
lines.push(`| **Slide 24 (GBP Branch Audit)** | Young NSW GBP (\`cid=13028632929548237826\`) has **168 reviews (4.8★)** & hidden address; Queanbeyan HQ (\`cid=840063358789951524\`) has **82 reviews (4.5★)** & hidden address; Hume ACT duplicate (\`cid=9860764133579467617\`) has **0 reviews**; Smeaton Grange NSW has **12 reviews (5.0★)**; Dandenong South VIC & Archerfield QLD have **0 reviews** vs QLD rival \`stag.energy\` (**43 reviews, 5.0★**). | \`pipeline/maps_audit.json\` (Section 3 below). |`);
lines.push(`| **Slides 25 & 26 (Live Site & Schema Audit)** | \`/contact-us\` JSON-LD outputs \`"telephone": "+61XXXXXXXXX"\`; \`/aircon\` returns **HTTP 404**; review counts conflict (\`100+\`, \`200+\`, \`350\` vs live **434**); 7 state licenses omitted from website schema. | Section 2 below (Live Website & SolarQuotes Forensic Crawl). |`);
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## SECTION 2: LIVE WEBSITE & SOLARQUOTES FORENSIC EVIDENCE`);
lines.push(`### 2.1 Verified Corporate & State Electrical Contractor Licenses (SolarQuotes vs. Website)`);
lines.push(`- **Legal Entity:** \`Stag Electrical, Solar & Refrigeration Pty Ltd\` (ABN \`37 664 400 828\` / ACN \`664 400 828\`, transitioned from Trust ABN \`62 311 526 071\` on \`09 Dec 2022\`).`);
lines.push(`- **Founder & Managing Director:** \`Sam Friend\` (founded 2007 in Young, NSW).`);
lines.push(`- **7 State Electrical Contractor Licenses Verified on SolarQuotes (Missing from \`stagelectrical.com.au\` Footer & JSON-LD):**`);
lines.push(`  - **ACT:** \`2023466\``);
lines.push(`  - **NSW:** \`399421C\``);
lines.push(`  - **VIC:** \`REC 37470\``);
lines.push(`  - **QLD:** \`1508438\``);
lines.push(`  - **SA:** \`PGE 347840\``);
lines.push(`  - **TAS:** \`618381602\``);
lines.push(`  - **NT:** \`C 4787\``);
lines.push(`- **SolarQuotes Live Rating & Hardware Volume (\`https://www.solarquotes.com.au/installer-review/stag-electrical-solar-and-refrigeration/\`):**`);
lines.push(`  - **Overall Rating:** **4.8★ across 434 verified ratings** (4.9★ across 24 reviews in the last 12 months; 96% 5-star).`);
lines.push(`  - **Panels Installed:** Jinko Solar (205), Trina (43), Hyundai (6), Aiko (5), Canadian Solar (2), REC (2), LONGi (2).`);
lines.push(`  - **Inverters Installed:** Sungrow (170), GoodWe (49), SolarEdge (37), Sigenergy (36), Fronius (6), Enphase (3).`);
lines.push(`  - **Batteries Installed:** GoodWe (26), Sigenergy (20), Sungrow (18), ESY Sunhome (7), Tesla Powerwall 2/3 (3+), SolarEdge (2), BYD (1).`);
lines.push(``);
lines.push(`### 2.2 Live On-Site Discrepancies on \`stagelectrical.com.au\``);
lines.push(`1. **Literal Placeholder Phone Number in \`/contact-us\` JSON-LD Schema:**`);
lines.push(`   - First JSON-LD \`Electrician\` block on \`https://www.stagelectrical.com.au/contact-us\` outputs \`"telephone": "+61XXXXXXXXX"\` and \`"email": "info@stagelectrical.com.au"\` (while the second block and visible page show \`1300 836 050\` and \`admin@stagelectrical.com.au\`).`);
lines.push(`2. **Broken Core Service Page (\`https://www.stagelectrical.com.au/aircon\` returns HTTP 404):**`);
lines.push(`   - Homepage JSON-LD (\`WebSite.hasPart\` and \`BreadcrumbList\` position 4) declares \`https://www.stagelectrical.com.au/aircon/\`, but visiting \`/aircon\` returns **HTTP 404 Not Found**, and all *"See aircon locations"* / *"Air Conditioning"* buttons on \`/\` and \`/about-us\` point to dead \`href="#"\` anchors.`);
lines.push(`3. **Four Conflicting Review Counts Across Site & Schema:**`);
lines.push(`   - Live SolarQuotes profile: **434 verified ratings (4.8★)**.`);
lines.push(`   - Homepage hero badge: \`"See 200+ five-star reviews"\`.`);
lines.push(`   - Homepage body copy immediately below hero: \`"over 100 five-star reviews on SolarQuotes"\`.`);
lines.push(`   - \`/solar\` JSON-LD \`Product\` schema: \`"ratingValue": "4.9", "reviewCount": "350"\` alongside a broken 404 placeholder image \`"https://cdn.prod.website-files.com/solar-panel-image.jpg"\`.`);
lines.push(`4. **Conflicting Headquarters Address & Incomplete \`areaServed\` in Schema:**`);
lines.push(`   - \`/\` and \`/contact-us\` JSON-LD set HQ to \`1/12 Uriarra Rd, Queanbeyan NSW 2620\`; \`/about-us\` and \`/solar\` set HQ to \`8D Old Temora Rd, Young NSW 2594\` (and \`/about-us\` sets \`"logo": "https://www.stagelectrical.com.au/"\`).`);
lines.push(`   - JSON-LD \`areaServed\` lists only 4 states (\`NSW, ACT, VIC, WA\`) and \`GeoShape\` defines only two 100km circles (Canberra & Perth), omitting **QLD, SA, TAS, and NT**.`);
lines.push(`5. **DOM Duplication & Navigation Bugs:**`);
lines.push(`   - On \`/\`, \`#wf-form-Hero-Form-2026\` is rendered twice in the DOM; on \`/contact-us\`, the entire \`.nav_component\` navbar is duplicated before the footer; the *"New Quote"* dropdown omits \`WA\` and misspells \`"Toowomba"\`; the Products menu links \`/batteries/goodwe\` twice and includes a stray \`<a href="#">Link</a>\` item; \`/about-us\` says \`"18 years of experience"\` in the hero and \`"17 years"\` in the commitment grid.`);
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## SECTION 3: DATAFORSEO GOOGLE MAPS 20-PACK COMPETITOR & BRANCH AUDITS`);
for (const [city, items] of Object.entries(MAPS)) {
  lines.push(`### Market: ${CITY_NAME[city] || city} (\`${ (items || []).length }\` Maps Entities)`);
  lines.push(`| # | Business Title | Domain | Rating | Reviews | Address | Google CID |`);
  lines.push(`| :- | :--- | :--- | :--- | :--- | :--- | :--- |`);
  (items || []).forEach((it, idx) => {
    lines.push(`| ${idx + 1} | **${it.title || 'N/A'}** | \`${it.domain || '—'}\` | ${it.rating ?? 'null'}★ | ${it.reviews ?? 0} | ${it.address || 'null (Hidden SAB)'} | \`${it.cid || '—'}\` |`);
  });
  lines.push(``);
}
lines.push(`---`);
lines.push(``);
lines.push(`## SECTION 4: 56 DATAFORSEO AUSTRALIAN GOOGLE SERP & LOCAL 3-PACK CHECKS`);
lines.push(`| # | Market | Prompt ID | Google Search Query | STAG in Top 10? | STAG in Local Pack? | Local 3-Pack Firms | Top Organic Domains |`);
lines.push(`| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |`);
SERP.forEach((s, idx) => {
  const lpStr = (s.localPackFirms || []).map(lp => `${lp.title} (${lp.rating || 'null'}★, ${lp.reviews} rev)`).join('; ') || 'None';
  const topDoms = (s.topDomains || []).slice(0, 5).join(', ');
  lines.push(`| ${idx + 1} | ${CITY_NAME[s.city] || s.city} | \`${s.prompt}\` | \`${s.serpQuery}\` | **${s.stagInTop10 ? 'YES' : 'No'}** | **${s.stagInLocalPack ? 'YES' : 'No'}** | ${lpStr} | \`${topDoms}\` |`);
});
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## SECTION 5: COMPLETE UPSTREAM DOMAIN CITATION LEDGER (\`pipeline/citations.json\`)`);
lines.push(`| Rank | Domain | Answers Citing (out of 280) | Share of Answers |`);
lines.push(`| :- | :--- | :--- | :--- |`);
Object.entries(C)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 60)
  .forEach(([dom, count], idx) => {
    lines.push(`| ${idx + 1} | \`${dom}\` | **${count}** | ${((count / 280) * 100).toFixed(1)}% |`);
  });
lines.push(``);
lines.push(`---`);
lines.push(``);
lines.push(`## SECTION 6: ALL 280 VERBATIM AI RESPONSES (\`pipeline/ans_full.json\`)`);
lines.push(``);

ANS.forEach((a, idx) => {
  const firmsStr = (a.firms || []).map((f, i) => `#${i + 1} ${f.name}`).join(', ') || 'None extracted';
  const sourcesStr = (a.sources || []).map(s => `${s.domain} (${s.url || ''})`).join('; ') || 'None';
  lines.push(`### [${idx + 1} / 280] ${CITY_NAME[a.city] || a.city} · ${PROMPT_NAME[a.prompt] || a.prompt} · ${PLAT_NAME[a.platform] || a.platform}`);
  lines.push(`- **Cell ID:** \`${a.city} :: ${a.prompt} :: ${a.platform}\``);
  lines.push(`- **Timestamp:** \`${a.at}\` | **Latency:** \`${a.latency_ms}ms\``);
  lines.push(`- **Verbatim Prompt:** \`${a.query}\``);
  lines.push(`- **STAG Electrical Mentioned:** **${a.isTargetMentioned ? `YES (Rank #${a.targetRank} · ${a.stance})` : 'No'}**`);
  lines.push(`- **Extracted Installers (${(a.firms || []).length}):** ${firmsStr}`);
  lines.push(`- **Grounding Sources (${(a.sources || []).length}):** ${sourcesStr}`);
  lines.push(``);
  lines.push(`\`\`\`markdown`);
  lines.push((a.text || '').replace(/```/g, "'''"));
  lines.push(`\`\`\``);
  lines.push(``);
});

const outPath = path.join(rootDir, 'STAG_ELECTRICAL_RAW_EVIDENCE_LEDGER.md');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Generated STAG_ELECTRICAL_RAW_EVIDENCE_LEDGER.md (${lines.length} lines, ${fs.statSync(outPath).size} bytes)`);
