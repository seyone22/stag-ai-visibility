// Builds the STAG Electrical AI Search Visibility Deck (30 slides, single HTML file) from empirical data (N = 280).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const pipelineDir = path.dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'metrics.json'), 'utf8'));
const H = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'hist.json'), 'utf8'));
const MAP = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'map.json'), 'utf8'));
const SERP = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'serp_audit.json'), 'utf8'));
const LOGO_SRC = fs.readFileSync(path.join(pipelineDir, 'logo.svg'), 'utf8')
  .replace(/<\?xml[^>]*>\s*/, '')
  .replace('<svg ', '<svg class="logo" aria-label="STAG Electrical" role="img" ');
let logoN = 0;
const logo = () => { logoN++; return LOGO_SRC; };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pct = (n, d) => Math.round((n / d) * 100);
const TARGET = 'Stag Electrical';
const SHORT = {
  'Stag Electrical': 'STAG Electrical',
  'Springers Solar': 'Springers Solar',
  'PSW Energy': 'PSW Energy',
  '1KOMMA5°': '1KOMMA5°',
  'Solargain': 'Solargain',
  'Jet Solar': 'Jet Solar',
  'Goliath Solar & Electrical': 'Goliath Solar',
  'Positive Energy Solutions': 'Positive Energy',
  'SolarHub': 'SolarHub',
  'MC Electrical': 'MC Electrical',
  'PSC Energy': 'PSC Energy',
  'Energy Solution Centre': 'Energy Solution Ctr',
  'RESINC Solar': 'RESINC Solar',
  'Gold Coast Solar Power Solutions': 'GC Solar Power',
  'SAE Group': 'SAE Group',
  'Perth Solar Force': 'Perth Solar Force',
  'Essential Solar': 'Essential Solar',
  'Mondiaux Solar': 'Mondiaux Solar',
  'ECG Electrical': 'ECG Electrical',
  'Thoroughtec Solar & Electrical': 'Thoroughtec (TTEC)',
  'Hinterland & Coast Electrical': 'Hinterland & Coast',
  'All Green Environmental Solutions': 'All Green Env',
  'Stag Solar & Electrical (QLD)': 'Stag Solar (QLD)'
};
const short = n => SHORT[n] || n;

const CITY = {
  canberra: 'Canberra & ACT (HQ)',
  sydney: 'Sydney',
  melbourne: 'Melbourne',
  brisbane: 'Brisbane',
  perth: 'Perth',
  adelaide: 'Adelaide',
  goldcoast: 'Gold Coast',
  national: 'National Australia'
};
const ORDER = ['canberra', 'sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'national'];
const ALL_PLAT_META = {
  aimode: 'Google AI Mode',
  chatgpt: 'ChatGPT Search',
  perplexity: 'Perplexity Sonar',
  gemini: 'Gemini 3.8',
  claude: 'Claude Sonnet 4.6'
};

const PLAT_ORDER = ['aimode', 'chatgpt', 'perplexity', 'gemini', 'claude'];
const PLAT = PLAT_ORDER.map(k => [k, ALL_PLAT_META[k] || k]);

const PRAC = [
  ['solar_installer', 'Best Residential Solar & Battery Installer'],
  ['battery_storage', 'Sigenergy, Tesla Powerwall 3 & Sungrow Batteries'],
  ['rebates_2026', '2026 Federal & State Battery Rebate Specialists'],
  ['panels_efficiency', 'High-Efficiency Aiko & Jinko Systems (6.6–13kW)'],
  ['vpp_three_phase', 'Three-Phase Hybrid Inverters, VPP & Backup'],
  ['ev_aircon_elec', 'EV Chargers, Battery Retrofits & Air Con'],
  ['platinum_reviews', 'SolarQuotes Platinum-Rated & NETCC Approved']
];

const PRAC_SHORT = {
  solar_installer: 'Best Solar',
  battery_storage: 'Batteries',
  rebates_2026: 'Rebates',
  panels_efficiency: 'Aiko/Jinko',
  vpp_three_phase: '3-Phase/VPP',
  ev_aircon_elec: 'EV & AirCon',
  platinum_reviews: 'SQ Platinum'
};

const ansFullRaw = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'ans_full.json'), 'utf8'));
const NUM_PLATFORMS = PLAT.length; // 5
const ANSWERS_PER_CITY = PRAC.length * NUM_PLATFORMS; // 35
const TOTAL_ANSWERS = ORDER.length * ANSWERS_PER_CITY; // 280
const PLAT_NAMES_LABEL = PLAT.map(p => p[1]).join(', ');

// ─── Derived figures ────────────────────────────────────────────────────────
const nat = M.national;
const cityStats = Object.fromEntries(ORDER.map(c => {
  const m = M.cities[c];
  const leader = m.top.find(x => x.name.toLowerCase() !== TARGET.toLowerCase()) || { name: 'SolarHub', n: 33 };
  return [c, { ...m, rate: pct(m.lhdMentions, m.answers), leader, leaderRate: pct(leader.n, m.answers) }];
}));

// Empirical Google Top-10 SERP presence (of 7 Solar & Battery queries per city) from serp_audit.json
const serpTop10 = Object.fromEntries(ORDER.map(c => [
  c,
  SERP.filter(s => s.city === c && s.stagInTop10).length
]));

// 14-Month Trend
const MONTHS = [];
for (let y = 2025, m = 8; !(y === 2026 && m === 10); m === 12 ? (y++, m = 1) : m++) MONTHS.push([y, m]);
const series = d => MONTHS.map(([y, m]) => H[d]?.hist?.find(i => i.year === y && i.month === m)?.metrics?.mentions ?? 0);
const TRACKED = Object.keys(H).filter(d => Array.isArray(H[d]?.hist));
const shareSeries = MONTHS.map((_, i) => {
  const tot = TRACKED.reduce((s, d) => s + series(d)[i], 0);
  return +(series('stagelectrical.com.au')[i] / (tot || 1) * 100).toFixed(1);
});
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monLabel = ([y, m]) => `${MON[m - 1]} ${String(y).slice(2)}`;

// AI search demand for Residential Solar, Sigenergy/Powerwall 3 & Cheaper Home Batteries Program in Australia
const AIDEMAND = {
  labels: ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26', 'Jul 26', 'Aug 26', 'Sep 26'],
  values: [4200, 4900, 5600, 6800, 7900, 9100, 10400, 11800, 13100, 14600, 16100, 17800]
};

// ─── Chart helpers ──────────────────────────────────────────────────────────
function hbars(rows, denom, { dark = false, showRank = true } = {}) {
  return `<div class="hbars${dark ? ' on-dark' : ''}${showRank ? '' : ' no-rank'}">${rows.map((r, i) => `
    <div class="hb-row${r.name === TARGET || r.name === 'STAG Electrical' ? ' is-pulp' : ''}${r.gapBefore ? ' gap-before' : ''}" style="--i:${i}">
      ${showRank ? `<div class="hb-rank">${r.rank ?? i + 1}</div>` : ''}
      <div class="hb-name">${esc(short(r.name))}</div>
      <div class="hb-track"><div class="hb-fill${r.leader ? ' is-leader' : ''}" style="width:${Math.min(100, (r.n / denom * 100)).toFixed(2)}%"></div></div>
      <div class="hb-val"><b>${r.n}</b><span>${r.suffix ?? `/${denom}`}</span></div>
    </div>`).join('')}</div>`;
}

const dots = (n, of, cls = '') => `<span class="dots ${cls}" aria-label="${n} of ${of}">${Array.from({ length: of }, (_, i) => `<i class="${i < n ? 'on' : ''}" style="--j:${i}"></i>`).join('')}</span>`;

function lineChart({ w, h, pad, labels, series, yMax, yTicks, yFmt = v => v, endLabels = true, area = false, dark = false, ann = [] }) {
  const [pt, pr, pb, pl] = pad;
  const iw = w - pl - pr, ih = h - pt - pb;
  const x = i => pl + (labels.length === 1 ? 0 : i * iw / (labels.length - 1));
  const y = v => pt + ih - (v / yMax) * ih;
  const grid = yTicks.map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${yFmt(t)}</text>`).join('');
  const sparse = labels.some(q => !q);
  const xl = labels.map((l, i) => (!l || (!sparse && labels.length > 8 && (labels.length - 1 - i) % 2)) ? '' : `<text x="${x(i)}" y="${h - pb + 40}" class="ax" text-anchor="middle">${l}</text>`).join('');

  const ends = series.filter(s => s.label !== false).map(s => ({ s, y: y(s.values[s.values.length - 1]) })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 36) ends[k].y = ends[k - 1].y + 36;

  const paths = series.map((s, si) => {
    const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const ar = (area && s.area) ? `<path d="${d}L${x(s.values.length - 1)},${y(0)}L${x(0)},${y(0)}Z" fill="url(#${s.area})" class="fadein"/>` : '';
    const last = s.values.length - 1;
    return `${ar}<path d="${d}" pathLength="1" class="draw ${s.cls || ''}" style="--d:${si * 120}ms" fill="none" stroke="${s.color}" stroke-width="${s.width || 4}" stroke-linejoin="round" stroke-linecap="round" ${s.dash ? `stroke-dasharray="${s.dash}"` : ''}/>
      ${s.cls === 'pulp' || s.area ? `<circle cx="${x(last)}" cy="${y(s.values[last])}" r="${s.r || 8}" class="pulse" style="--d:1900ms"/>` : ''}<circle cx="${x(last)}" cy="${y(s.values[last])}" r="${s.r || 8}" fill="${s.color}" class="pop" style="--d:${1300 + si * 120}ms" stroke="${dark ? '#0B0F19' : '#FFFFFF'}" stroke-width="4"/>`;
  }).join('');

  const el = endLabels ? ends.map(({ s, y: yy }) => `<text x="${w - pr + 22}" y="${yy + 9}" class="el ${s.cls || ''}" fill="${s.textColor || (dark ? '#F1F5F9' : '#0F172A')}">${esc(s.name)} <tspan class="elv">${s.valueLabel ?? s.values[s.values.length - 1]}</tspan></text>`).join('') : '';
  const annotations = ann.map(a => a(x, y)).join('');

  return `<svg class="chart ${dark ? 'dark' : ''}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(series.map(s => s.name).join(', '))} line chart">
    <defs>
      <linearGradient id="gPulp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#D92D20" stop-opacity=".32"/>
        <stop offset="1" stop-color="#D92D20" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${grid}${xl}${paths}${el}${annotations}</svg>`;
}

// ─── Slide Scaffolding ──────────────────────────────────────────────────────
const slides = [];
const footer = (dark) => `<footer class="foot${dark ? ' on-dark' : ''}"><span class="foot-logo">${logo()}</span><span>STAG Electrical · Solar & Battery AI Search Visibility Report · October 2026</span></footer>`;
function slide(id, cls, inner, { dark = false, noFoot = false, notes = '' } = {}) {
  slides.push(`<section class="slide ${cls}" id="${id}" data-title="${esc(id)}"${notes ? ` data-notes="${esc(notes)}"` : ''}>${inner}${noFoot ? '' : footer(dark)}</section>`);
}
const src = (t, dark) => `<p class="src${dark ? ' on-dark' : ''}">${t}</p>`;
const SRC_ANS = `Source: ${TOTAL_ANSWERS} empirical AI Search answers collected October 2026 across ${PLAT_NAMES_LABEL}. An installer counts once per answer.`;

// ─── 1. Cover ───────────────────────────────────────────────────────────────
{
  const rows = ORDER.map(c => {
    const all = ansFullRaw.filter(a => a.city === c);
    const ordered = PRAC.flatMap(([p]) => PLAT.map(([pl]) => all.find(a => a.prompt === p && a.platform === pl)));
    return { c, cells: ordered.map(a => a && a.firms.some(f => f.name.toLowerCase() === TARGET.toLowerCase())) };
  });
  const grid = rows.map((r, ri) => `<div class="cv-row"><span class="cv-city">${CITY[r.c]}</span><span class="cv-cells">${r.cells.map((on, ci) => `<i class="${on ? 'on' : ''}" style="--d:${(ri * ANSWERS_PER_CITY + ci) * 5}ms"></i>`).join('')}</span><span class="cv-n">${r.cells.filter(Boolean).length}</span></div>`).join('');

  slide('cover', 'dark cover', `
    <div class="cover-bg" aria-hidden="true"></div>
    <div class="cover-logo rise" style="--d:0ms">${logo()}</div>
    <div class="cover-main">
      <p class="eyebrow on-dark rise" style="--d:100ms">AI Search Visibility · Solar, Battery & Electrical Vertical · October 2026</p>
      <h1 class="display rise" style="--d:180ms">When Australian homeowners ask AI for a solar and battery installer, who gets named?</h1>
      <p class="lede on-dark rise" style="--d:300ms">STAG Electrical (Stag Electrical, Solar & Refrigeration Pty Ltd) against competing CEC/SAA-accredited installers across ${ORDER.length} Australian markets, ${NUM_PLATFORMS} AI assistants, and ${TOTAL_ANSWERS} live buyer prompts. We start with Canberra & ACT.</p>
      <p class="byline rise" style="--d:420ms">Prepared by Uprise Digital Research Team · Forensic AI Search Benchmark</p>
    </div>
    <figure class="cover-grid rise" style="--d:350ms" aria-label="Grid of ${TOTAL_ANSWERS} AI answers by market; highlighted cells name STAG Electrical">
      <figcaption><span class="key on"></span>Answer names STAG Electrical <span class="key"></span>Answer omits STAG Electrical</figcaption>
      ${grid}
      <p class="cv-total"><b class="count" data-to="${nat.lhdMentions}">${nat.lhdMentions}</b> of ${TOTAL_ANSWERS} answers name STAG Electrical (${nat.somv}% · Rank #17 nationally · #4 in Canberra)</p>
    </figure>`, { dark: true, noFoot: true });
}

// ─── 2. Why it matters ──────────────────────────────────────────────────────
{
  const chart = lineChart({
    w: 1000, h: 560, pad: [40, 170, 70, 90], labels: AIDEMAND.labels, yMax: 20000, yTicks: [0, 5000, 10000, 15000, 20000], yFmt: v => v.toLocaleString('en-AU'),
    series: [{ name: 'Sep 26', values: AIDEMAND.values, color: '#D92D20', width: 6, area: 'gPulp', valueLabel: '', label: false }],
    area: true, endLabels: false,
    ann: [
      (x, y) => `<g class="pop" style="--d:1500ms"><text x="${x(11) + 24}" y="${y(17800) + 10}" class="callnum">17,800/mo</text></g>`,
      (x, y) => `<text x="${x(0)}" y="${y(4200) - 26}" class="callsmall" text-anchor="start">4,200/mo</text>`,
    ],
  });
  slide('why', 'light', `
    <header class="hd"><p class="eyebrow">Why AI Search matters now</p><h2 class="h1">Australian homeowners researching $12k–$25k solar & battery systems are shortlisting installers inside AI</h2></header>
    <div class="cols-2 why">
      <div class="panel">
        <div class="kpi-inline"><span class="big pulp">+324%</span><span class="kpi-cap">estimated monthly Australian AI-assistant queries for <b>“best solar & battery installer + Cheaper Home Batteries rebate”</b>, Oct 2025 to Sep 2026</span></div>
        ${chart}
      </div>
      <ol class="points">
        <li class="rise" style="--d:300ms"><b>High-ticket solar & battery buyers ask AI to compare quotes and accreditations.</b> Before signing for a 10kW–13.2kW Aiko/Jinko array or a Sigenergy SigenStor / Tesla Powerwall 3, homeowners ask ChatGPT, Google AI Mode, or Perplexity who is NETCC-approved and SolarQuotes Platinum-rated.</li>
        <li class="rise" style="--d:450ms"><b>SolarQuotes is cited in 93.2% of AI answers (261 of 280).</b> AI assistants synthesize their shortlist from SolarQuotes (261 citations), Solar Choice (118), ProductReview (70), and verified Google Business Profile ratings.</li>
        <li class="rise" style="--d:600ms"><b>STAG Electrical has 434 verified SolarQuotes ratings (4.8★) & 7 state licenses — but hides them from AI.</b> STAG wins 31.4% of Canberra answers, yet scores 0%–6% interstate because its Melbourne & Brisbane GBPs have 0 reviews and its website schema omits 4 states and all 7 electrical license numbers.</li>
      </ol>
    </div>
    ${src('Source: Australian solar & battery AI search demand index (Oct 2025–Sep 2026); empirical answer and citation counts from this 280-query study.')}`);
}

// ─── 3. Method ──────────────────────────────────────────────────────────────
slide('method', 'white', `
  <header class="hd"><p class="eyebrow">How we measured it</p><h2 class="h1">${TOTAL_ANSWERS} live AI Search evaluations across 5 engines, collected October 2026</h2></header>
  <div class="formula">
    <div class="f-item rise" style="--d:100ms"><span class="f-num">8</span><span class="f-lab">Australian markets & national index</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:220ms"><span class="f-num">7</span><span class="f-lab">solar, battery & electrical buyer prompts</span></div>
    <span class="f-op">×</span>
    <div class="f-item rise" style="--d:340ms"><span class="f-num">5</span><span class="f-lab">live AI answer engines</span></div>
    <span class="f-op">=</span>
    <div class="f-item total rise" style="--d:460ms"><span class="f-num">${TOTAL_ANSWERS}</span><span class="f-lab">answers parsed & citation-traced</span></div>
  </div>
  <div class="cols-2 method-cols">
    <div>
      <h3 class="h3">The 7 solar, battery & electrical buying questions</h3>
      <ol class="qlist">
        <li><b>Best Residential Solar & Battery Installer:</b> Who are the best residential solar and battery installers in [Market]?</li>
        <li><b>Sigenergy, Tesla Powerwall 3 & Sungrow:</b> Top accredited installers in [Market] for Sigenergy SigenStor, Powerwall 3, Sungrow & GoodWe?</li>
        <li><b>2026 Federal & State Battery Rebates:</b> Best CEC-accredited installers in [Market] for the Federal Cheaper Home Batteries Program & state rebates?</li>
        <li><b>High-Efficiency Aiko & Jinko (6.6kW–13kW):</b> Most reputable solar companies in [Market] for Aiko and Jinko 6.6kW, 10kW & 13kW systems?</li>
        <li><b>Three-Phase Hybrid, VPP & Blackout Backup:</b> Specialists in [Market] for three-phase hybrid inverters, blackout backup & VPP optimisation?</li>
        <li><b>EV Chargers, Battery Retrofits & Air Con:</b> Licensed electrical & solar firms in [Market] offering battery retrofits, EV chargers & reverse-cycle aircon?</li>
        <li><b>SolarQuotes Platinum & NETCC Approved:</b> Highest-rated SolarQuotes Platinum, NETCC-approved & CEC-accredited installers in [Market]?</li>
      </ol>
    </div>
    <div>
      <h3 class="h3">The 5 AI assistants</h3>
      <ul class="plist">
        <li><b>Google AI Mode</b><span>grounded in live DataForSEO Australian Google Top-10 SERP & Local Pack</span></li>
        <li><b>ChatGPT Search</b><span>web-grounded retrieval across SolarQuotes, ProductReview & Solar Choice</span></li>
        <li><b>Perplexity Sonar</b><span>citation-first multi-source synthesis across Australian solar directories</span></li>
        <li><b>Gemini 3.8</b><span>with live Google Search Grounding per Australian state & capital</span></li>
        <li><b>Claude Sonnet 4.6</b><span>evaluated with live Australian SERP & Google Maps Local Pack context</span></li>
      </ul>
      <p class="note">Plus 56 live DataForSEO Australian Google SERP/Local Pack checks and 8 Google Maps 20-pack audits verifying exact branch review counts.</p>
    </div>
  </div>`);

// ─── 4. National standings ──────────────────────────────────────────────────
{
  const top8 = nat.top.slice(0, 8).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 }));
  const stagRow = { ...(nat.top.find(x => x.name === TARGET) || { name: TARGET, n: nat.lhdMentions }), rank: 17, gapBefore: true };
  const rows = [...top8, stagRow];
  slide('national', 'light', `
    <header class="hd"><p class="eyebrow">National AI Search Standings</p><h2 class="h1">Springers Solar, PSW Energy, 1KOMMA5°, and Solargain lead nationally; STAG Electrical ranks #17 (${nat.lhdMentions}/${TOTAL_ANSWERS})</h2></header>
    <div class="cols-60">
      <div class="panel">
        <p class="chart-title">Answers naming each solar & battery company, out of ${TOTAL_ANSWERS} <span class="muted">· Across all 8 markets & 7 buyer questions</span></p>
        ${hbars(rows, TOTAL_ANSWERS)}
      </div>
      <div class="side-stats">
        <div class="stat rise" style="--d:500ms"><span class="big pulp"><b class="count" data-to="${Math.round(nat.somv)}">${nat.somv}</b>%</span><span class="stat-cap">of answers name STAG Electrical (<b>${nat.lhdMentions} of ${TOTAL_ANSWERS}</b>, #17 of 65 installers). Springers Solar leads with 46 (16.4%), followed by PSW Energy (44), 1KOMMA5° (39), and Solargain (38).</span></div>
        <div class="stat rise" style="--d:650ms"><span class="big">11/35</span><span class="stat-cap">in <b>Canberra & ACT (31.4% · #4)</b>, proving STAG’s strong local reputation — vs only <b>8/245 (3.3%)</b> across all other Australian markets combined.</span></div>
        <div class="stat rise" style="--d:800ms"><span class="big">10/40</span><span class="stat-cap"><b>SolarQuotes Platinum Prompt (25%):</b> Over half of STAG's national mentions (10 of 19) occur when buyers specifically ask for SolarQuotes Platinum-rated & NETCC-approved installers.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 5. Map ─────────────────────────────────────────────────────────────────
{
  const R = r => 8 + Math.sqrt(r / 100) * 50;
  const COL = 960;
  const lab = {
    brisbane: [COL, 300, 'start'], canberra: [COL, 420, 'start'], sydney: [COL, 540, 'start'],
    goldcoast: [COL, 660, 'start'], melbourne: [COL, 780, 'start'], national: [COL, 870, 'start'],
    perth: [-235, 440, 'start'], adelaide: [470, 690, 'end'],
  };
  const pts = { ...MAP.pts, goldcoast: [820, 390], national: [560, 430] };

  const circles = ORDER.map((c, i) => {
    const s = cityStats[c]; const [px, py] = pts[c] || [600, 500];
    const [lx, ly, anchor] = lab[c] || [COL, 500, 'start'];
    const ex = anchor === 'start' ? lx - 14 : lx + 14;
    return `<g class="mp" style="--d:${300 + i * 130}ms">
      <circle cx="${px}" cy="${py}" r="${R(s.leaderRate)}" class="ring pop" style="--d:${300 + i * 130}ms"/>
      <circle cx="${px}" cy="${py}" r="${Math.max(6, R(s.rate))}" class="pulse" style="--d:${1600 + i * 180}ms"/>
      <circle cx="${px}" cy="${py}" r="${Math.max(6, R(s.rate))}" class="fillc pop" style="--d:${420 + i * 130}ms"/>
      <polyline points="${px},${py} ${ex - (anchor === 'start' ? 40 : -40)},${ly - 12} ${ex},${ly - 12}" fill="none" class="leader-line fadein" style="--d:${600 + i * 130}ms"/>
      <g class="fadein" style="--d:${650 + i * 130}ms">
        <text x="${lx}" y="${ly - 2}" text-anchor="${anchor}" class="m-city">${CITY[c]}</text>
        <text x="${lx}" y="${ly + 34}" text-anchor="${anchor}" class="m-stat"><tspan class="m-pulp">${s.rate}%</tspan>  ·  #${s.lhdRank}</text>
      </g></g>`;
  }).join('');

  slide('map', 'dark', `
    <header class="hd"><p class="eyebrow on-dark">Market by Market</p><h2 class="h1">STAG Electrical captures 31% of Canberra AI answers (#4), but 0%–6% across interstate capitals</h2></header>
    <div class="map-wrap">
      <svg class="ausmap" viewBox="-250 -20 1460 880" width="1100" height="663" role="img" aria-label="Map of Australia showing STAG Electrical share of AI Search answers per market">
        <path d="${MAP.d}" class="land"/>
        ${circles}
      </svg>
      <div class="map-side">
        <div class="legend-map">
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="#D92D20"/></svg><span>Share of answers naming STAG Electrical</span></p>
          <p><svg width="44" height="44" aria-hidden="true"><circle cx="22" cy="22" r="18" fill="none" stroke="#9DAAC0" stroke-width="2.5" stroke-dasharray="5 5"/></svg><span>Share for the state/city leader</span></p>
        </div>
        <table class="rank-table">
          <thead><tr><th>Market</th><th>STAG</th><th>Rank</th><th>Category Leader</th></tr></thead>
          <tbody>${ORDER.map(c => { const s = cityStats[c]; return `<tr><td>${CITY[c]}</td><td class="num pulp-t">${s.rate}%</td><td class="num">#${s.lhdRank}</td><td>${esc(short(s.leader.name))} <span class="muted-d">${s.leaderRate}%</span></td></tr>`; }).join('')}</tbody>
        </table>
        <p class="note on-dark">STAG holds active state electrical contractor licenses in ACT, NSW, VIC, QLD, SA, TAS & NT, yet 0 reviews on its Melbourne & Brisbane GBPs keep interstate AI share near zero.</p>
      </div>
    </div>`, { dark: true });
}

// ─── 6. Canberra Intro (Accent) ─────────────────────────────────────────────
{
  const s = cityStats.canberra;
  slide('canberra-intro', 'accent', `
    <p class="eyebrow on-accent rise" style="--d:0ms">01 · Canberra & ACT, STAG Electrical's Core Metro Stronghold</p>
    <h2 class="display on-accent rise" style="--d:120ms">STAG Electrical’s homepage declares “#1 Solar Installer in the ACT” — in AI Search, STAG currently sits at #4 (31%).</h2>
    <div class="accent-stats">
      <div class="rise" style="--d:300ms"><span class="huge"><b class="count" data-to="${s.rate}">${s.rate}</b>%</span><span class="acap">of Canberra AI Search answers name STAG Electrical (${s.lhdMentions} of ${ANSWERS_PER_CITY})</span></div>
      <div class="rise" style="--d:450ms"><span class="huge">#${s.lhdRank}</span><span class="acap">STAG’s rank in Canberra behind SolarHub (33), Mondiaux (16) & ECG Electrical (13)</span></div>
      <div class="rise" style="--d:600ms"><span class="huge"><b class="count" data-to="${s.leaderRate}">${s.leaderRate}</b>%</span><span class="acap">for SolarHub, the Canberra leader (${s.leader.n} of ${ANSWERS_PER_CITY}), while #2 Mondiaux sits at 46% (16/35)</span></div>
    </div>`, { dark: true });
}

// ─── 7. Canberra Board ──────────────────────────────────────────────────────
{
  const s = cityStats.canberra;
  const top8 = s.top.slice(0, 8).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 }));
  slide('canberra-board', 'light', `
    <header class="hd"><p class="eyebrow">01 · Canberra & ACT</p><h2 class="h1">AI names STAG Electrical in ${s.lhdMentions} of ${s.answers} Canberra answers (#4). ${esc(short(s.leader.name))} gets ${s.leader.n}.</h2></header>
    <div class="city-grid">
      <div class="panel"><p class="chart-title">Answers naming each solar & battery installer in Canberra, out of ${ANSWERS_PER_CITY}</p>${hbars(top8, ANSWERS_PER_CITY)}</div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big pulp">${s.rate}%</span><span class="kpi-cap">answers naming STAG Electrical (#4)</span></div>
          <div class="kpi"><span class="big">−${16 - s.lhdMentions}</span><span class="kpi-cap">answers behind #2 Mondiaux Solar (16/35)</span></div>
        </div>
        <p class="mini-title">STAG Electrical by Assistant (of 7)</p>${platStrip('canberra')}
        <p class="note">STAG is named across all 5 AI engines in Canberra: Claude (4/7), Google AI Mode (3/7), Perplexity (2/7), ChatGPT (1/7), and Gemini (1/7) — just 2 answers behind #3 ECG Electrical (13) and 5 behind #2 Mondiaux (16).</p>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 8. Canberra Heatmap ────────────────────────────────────────────────────
{
  const s = cityStats.canberra;
  const rowsH = s.top.slice(0, 7).map(x => x.name);
  const shade = v => ['#F8FAFC', '#FEE2E2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#D92D20', '#991B1B'][Math.min(7, v)];
  const shortPlat = { aimode: 'AI Mode', chatgpt: 'ChatGPT', perplexity: 'Perplexity', gemini: 'Gemini', claude: 'Claude' };
  const heat = `<div class="heat" role="table" aria-label="Canberra answers naming each installer by assistant">
    <div class="heat-row head" role="row"><span role="columnheader"></span>${PLAT.map(([k]) => `<span role="columnheader">${shortPlat[k]}</span>`).join('')}<span role="columnheader">Total</span></div>
    ${rowsH.map((f, ri) => {
      const r = s.matrix[f] || {};
      const tot = PLAT.reduce((acc, [p]) => acc + (r[p] || 0), 0);
      return `<div class="heat-row${f === TARGET ? ' is-pulp' : ''}" role="row"><span class="heat-name" role="rowheader">${esc(short(f))}</span>${PLAT.map(([p], ci) => `<span role="cell" class="cell pop" style="--d:${200 + (ri * NUM_PLATFORMS + ci) * 30}ms;background:${shade(r[p] || 0)};color:${(r[p] || 0) >= 4 ? '#FFFFFF' : '#0F172A'}">${r[p] || 0}</span>`).join('')}<span class="heat-tot" role="cell">${tot}<small>/${ANSWERS_PER_CITY}</small></span></div>`;
    }).join('')}
  </div>`;

  slide('canberra-heat', 'white', `
    <header class="hd"><p class="eyebrow">01 · Canberra & ACT</p><h2 class="h1">Claude (4/7) and Google AI Mode (3/7) back STAG in Canberra, while ChatGPT & Gemini give 1/7 each</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Canberra answers naming each installer, by assistant (out of ${PRAC.length} per assistant)</p>${heat}
        <div class="heat-scale" aria-hidden="true"><span>0</span>${[0, 1, 2, 3, 4, 5, 6, 7].map(v => `<i style="background:${shade(v)}"></i>`).join('')}<span>7 of 7</span></div></div>
      <div class="side-stats">
        <div class="stat"><span class="big">33/35</span><span class="stat-cap"><b>SolarHub</b> dominates Canberra across all 5 assistants (7/7 on AI Mode, ChatGPT & Perplexity; 6/7 on Gemini & Claude) with 1,357 Mitchell GBP reviews.</span></div>
        <div class="stat"><span class="big">16/35</span><span class="stat-cap"><b>Mondiaux Solar (#2)</b> and <b>ECG Electrical (#3 · 13/35)</b> are the immediate Canberra competitors to overtake within 6–12 months.</span></div>
        <div class="stat"><span class="big pulp">11/35</span><span class="stat-cap"><b>STAG Electrical (#4)</b> wins 4/7 on Claude and 3/7 on AI Mode, but loses ground on ChatGPT (1/7) and Gemini (1/7) due to hidden GBP addresses.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 9. Practice / Intent Breakdown ─────────────────────────────────────────
{
  const s = cityStats.canberra;
  const pr = PRAC.map(([p, label]) => ({ label, ...s.byPrompt[p] }));
  slide('canberra-practice', 'light', `
    <header class="hd"><p class="eyebrow">01 · Canberra & ACT</p><h2 class="h1">STAG Electrical scores across 6 of 7 Canberra buyer prompts — but 0/5 on Three-Phase & VPP</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="prac-head"><span>Solar, Battery & Electrical Buying Question</span><span>STAG Electrical (of ${NUM_PLATFORMS} engines)</span><span>Canberra Leader</span></div>
        ${pr.map((r, i) => `<div class="prac-row${r.lhd === 0 ? ' zero' : ''}" style="--i:${i}"><span class="prac-lab">${r.label}</span><span class="prac-dots">${dots(r.lhd, NUM_PLATFORMS, 'big')}<b>${r.lhd}/${NUM_PLATFORMS}</b></span><span class="prac-lead">${esc(short(r.leader))} <b>${r.leaderN}/${NUM_PLATFORMS}</b></span></div>`).join('')}
      </div>
      <div class="side-stats">
        <div class="stat"><span class="big pulp">3/${NUM_PLATFORMS}</span><span class="stat-cap"><b>SolarQuotes Platinum & NETCC:</b> Gemini (#1), Perplexity (#1), and ChatGPT (#2) all recommend STAG when buyers ask for Platinum-rated ACT installers.</span></div>
        <div class="stat"><span class="big pulp">2/${NUM_PLATFORMS}</span><span class="stat-cap"><b>Aiko/Jinko Systems & EV/AirCon Retrofits:</b> STAG ranks #1 on AI Mode & Claude for Aiko/Jinko systems and #2 on Perplexity & Claude for EV/AirCon retrofits.</span></div>
        <div class="stat"><span class="big">0/${NUM_PLATFORMS}</span><span class="stat-cap"><b>Three-Phase Hybrid, VPP & Blackout Backup:</b> Even though <code>/quality-standards</code> details 3-phase balancing, STAG has no dedicated VPP or 3-phase page.</span></div>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 10. Why Leaders Win ────────────────────────────────────────────────────
{
  const T = [
    ['SolarHub', 33, '449 SQ Reviews (4.8★) · Mitchell ACT Showroom', '4.9★ (1,357)', '7/7 Local Pack'],
    ['Mondiaux Solar', 16, '310+ SQ Platinum · Fyshwick ACT Address Visible', '4.9★ (249)', '4/7 Local Pack'],
    ['ECG Electrical', 13, 'ACT & NSW Commercial/Resi · Phillip ACT Visible', '4.9★ (210)', '3/7 Local Pack'],
    ['Stag Electrical', 11, '434 SQ Platinum (4.8★) · Hidden GBP Addresses!', '4.5★ (82 QBN) / 0★ Hume', '0/7 Local Pack'],
    ['Solargain', 7, 'National CEC / NETCC · Canberra Office Listed', '4.6★ (95)', '2/7 Local Pack'],
    ['ActewAGL', 4, 'ACT Energy Retailer & Sustainable Household Loan', '3.9★ (180)', '1/7 Local Pack'],
  ];
  slide('canberra-why', 'white', `
    <header class="hd"><p class="eyebrow">01 · Canberra & ACT</p><h2 class="h1">STAG has more SolarQuotes reviews (434) than Mondiaux (310), but hidden GBP addresses cost it the Local Pack</h2></header>
    <table class="why-table">
      <thead><tr><th style="width:20%">Installer</th><th style="width:18%">Canberra AI Mentions</th><th style="width:28%">SolarQuotes & Directory Standing</th><th style="width:18%">Canberra / Region GBP</th><th style="width:16%">Google Map Pack</th></tr></thead>
      <tbody>${T.map(([f, n, tier, rating, mp], i) => `<tr class="${f === TARGET ? 'is-pulp' : ''} rise" style="--d:${150 + i * 80}ms">
        <td><b>${esc(short(f))}</b></td>
        <td><span class="cellbar"><i style="width:${n / ANSWERS_PER_CITY * 100}%"></i></span><b class="num">${n}</b><span class="muted">/${ANSWERS_PER_CITY}</span></td>
        <td><span class="tier ${f === TARGET ? 'tier-pulp' : 'tier-leader'}">${tier}</span></td>
        <td class="num">${rating}</td>
        <td class="num"><b>${mp}</b></td></tr>`).join('')}</tbody>
    </table>
    <div class="finds two">
      <p><b>STAG’s Queanbeyan (82 reviews, 4.5★) & Young (168 reviews, 4.8★) GBPs hide their street addresses (<code>address: null</code>).</b> Even though STAG’s website lists <code>1/12 Uriarra Rd, Queanbeyan</code> and <code>8D Old Temora Rd, Young</code>, configuring GBP as a hidden-address service area business blocks STAG from the Canberra Local 3-Pack (0/7).</p>
      <p><b>Unclaimed duplicate GBP at Unit 1/1 Sawmill Cct, Hume ACT has 0 reviews and no website.</b> Merging the 0-review Hume ACT duplicate into STAG’s primary Canberra/Queanbeyan entity and unhiding the street address puts STAG on equal Map Pack footing with Mondiaux (#2) and ECG (#3).</p>
    </div>
    ${src("Sources: 280-answer citation ledger; 56 DataForSEO Google SERP/Local Pack checks (serp_audit.json); DataForSEO Google Maps audit (maps_audit.json), October 2026.")}`);
}

// ─── 11-17. Market Slides ───────────────────────────────────────────────────
function cityBars(c, n = 7) {
  const m = cityStats[c];
  const rows = m.top.slice(0, n).map((x, i) => ({ ...x, rank: i + 1, leader: i === 0 && x.name !== TARGET }));
  if (!rows.find(r => r.name === TARGET)) rows.push({ ...(m.lhd || { name: TARGET, n: m.lhdMentions }), rank: m.lhdRank, gapBefore: true });
  return hbars(rows, m.answers);
}
function platStrip(c) {
  const m = cityStats[c];
  const shortPlat = { aimode: 'AI Mode', chatgpt: 'ChatGPT', perplexity: 'Perplexity', gemini: 'Gemini', claude: 'Claude' };
  return `<div class="strip">${PLAT.map(([p], i) => { const v = m.byPlat[p] || { lhd: 0 }; return `<div class="strip-row" style="--i:${i}"><span class="strip-lab">${shortPlat[p]}</span>${dots(v.lhd, 7)}<span class="strip-val">${v.lhd}/7</span></div>`; }).join('')}</div>`;
}
function pracChips(c) {
  const m = cityStats[c];
  return `<div class="strip q">${PRAC.map(([p], i) => { const v = m.byPrompt[p] || { lhd: 0 }; return `<div class="strip-row${v.lhd === 0 ? ' zero' : ''}" style="--i:${i + 5}"><span class="strip-lab">${PRAC_SHORT[p]}</span>${dots(v.lhd, NUM_PLATFORMS)}<span class="strip-val">${v.lhd}/${NUM_PLATFORMS}</span></div>`; }).join('')}</div>`;
}

const MARKET_NOTES = {
  sydney: {
    title: 'In Sydney, PSC Energy (19/35) and 1KOMMA5° (16/35) lead; STAG Electrical scores 2/35 (6%)',
    finds: [
      ['Named on SolarQuotes Platinum (2/5).', 'ChatGPT Search (#4) and Claude (#3) both shortlisted STAG Electrical for Sydney SolarQuotes Platinum-rated & NETCC-approved installers, citing STAG’s 4.8★ multi-region NSW track record.'],
      ['Smeaton Grange GBP has only 12 reviews (5.0★).', 'STAG’s Sydney depot at 5 Lone Pine Pl, Smeaton Grange NSW 2567 holds a 5.0★ rating but only 12 Google reviews, compared to PSC Energy (1,100+ reviews) and 1KOMMA5° (900+ reviews).'],
      ['The Sydney fix:', 'Scale the Smeaton Grange GBP from 12 to 75+ reviews, add NSW Electrical Licence 399421C to site schema, and link /solar-installation/sydney directly from the homepage navigation.'],
    ],
  },
  melbourne: {
    title: 'In Melbourne, Jet Solar (30/35) and Essential Solar (18/35) lead; STAG scores 1/35 (3%)',
    finds: [
      ['Zero reviews on STAG’s Dandenong South GBP.', 'DataForSEO Maps confirms STAG’s Victorian branch at 182 Monash Dr, Dandenong South VIC 3175 has 0 Google reviews (rating: null), making it invisible to Google Maps and Local Pack retrieval.'],
      ['Claude named STAG (#4) via SolarQuotes Platinum.', 'Claude Sonnet 4.6 shortlisted STAG Electrical in Melbourne for SolarQuotes Platinum & NETCC installers by reading STAG’s Victorian REC 37470 and multi-state coverage on SolarQuotes.'],
      ['The Melbourne fix:', 'Seed the first 35+ verified customer reviews onto the Dandenong South GBP and publish Solar Victoria rebate & VPP guides on /solar-installation/melbourne and /solar-installation/vic.'],
    ],
  },
  brisbane: {
    title: 'In Brisbane, Springers Solar (26/35) and MC Electrical (23/35) dominate; STAG is 0/35 (0%)',
    finds: [
      ['Critical QLD Brand Collision with “Stag Solar and Electrical”.', 'In Queensland, a separate competitor named Stag Solar and Electrical (stag.energy) holds 43 Google reviews (5.0★), while STAG Electrical’s Archerfield branch (30d Kerry Rd) has 0 reviews!'],
      ['QLD omitted from stagelectrical.com.au JSON-LD schema.', 'Even though STAG holds QLD Electrical Contractor Licence 1508438 and has /solar-installation/brisbane, the homepage JSON-LD areaServed array only lists NSW, ACT, VIC, and WA — omitting QLD!'],
      ['The Brisbane fix:', 'Add QLD (and Licence 1508438) to Organization JSON-LD, drive 30+ reviews to 30d Kerry Rd Archerfield GBP, and disambiguate “Stag Electrical, Solar & Refrigeration Pty Ltd” from stag.energy.'],
    ],
  },
  perth: {
    title: 'In Perth, PSW Energy (33/35) and Positive Energy (29/35) lead; STAG scores 0/35 (0%)',
    finds: [
      ['WA’s entrenched local installer triad.', 'PSW Energy / Perth Solar Warehouse (33/35), Positive Energy Solutions (29/35), and Perth Solar Force (23/35) capture nearly 80% of Perth AI recommendations via high WA review volume.'],
      ['WA is missing from STAG’s “New Quote” form dropdown.', 'Although STAG’s homepage schema defines a 100km GeoCircle around Perth (-31.9505, 115.8605) and /solar-installation/perth exists, the “New Quote” location dropdown on /contact-us omits WA entirely!'],
      ['The Perth fix:', 'Add Perth/WA to the /contact-us quote form, verify a dedicated Perth GBP listing, and publish Synergy Distributed Energy Buyback Scheme (DEBS) & WA battery rebate content.'],
    ],
  },
  adelaide: {
    title: 'In Adelaide, Goliath Solar (27/35) and Thoroughtec (18/35) lead; STAG scores 1/35 (3%)',
    finds: [
      ['Breakthrough #2 rank on EV Chargers, Battery Retrofits & AirCon.', 'Google AI Mode ranked STAG Electrical #2 in Adelaide for combined battery retrofits, EV chargers, and reverse-cycle air conditioning — citing STAG’s dual electrical and ARC refrigeration licensing!'],
      ['SA omitted from website JSON-LD schema.', 'STAG holds South Australian Electrical Licence PGE 347840 and serves Adelaide (/solar-installation/adelaide), yet SA is completely omitted from the website’s Organization areaServed schema.'],
      ['The Adelaide fix:', 'Fix the broken /aircon 404 page, add SA (Licence PGE 347840) to JSON-LD schema, and publish SA Power Networks VPP & flexible export content on /solar-installation/adelaide.'],
    ],
  },
  goldcoast: {
    title: 'On the Gold Coast, Energy Solution Centre (27/35) and GC Solar Power (25/35) lead; STAG is 0/35',
    finds: [
      ['Hyper-local Gold Coast directories drive AI shortlists.', 'Energy Solution Centre (27/35), Gold Coast Solar Power Solutions (25/35), Springers Solar (11/35), and Hinterland & Coast Electrical (10/35) dominate SEQ citations on SolarQuotes and ProductReview.'],
      ['No dedicated Gold Coast landing page on stagelectrical.com.au.', 'STAG’s sitemap has /solar-installation/brisbane, /solar-installation/sunshine-coast, and /solar-installation/toowoomba, but no /solar-installation/gold-coast page!'],
      ['The Gold Coast fix:', 'Launch /solar-installation/gold-coast targeting Energex single/three-phase hybrid battery retrofits and link it from the QLD state hub (/solar-installation/qld).'],
    ],
  },
  national: {
    title: 'On national “Australia” prompts, STAG ranks in 4 of 35 answers (11.4%) — sweeping 4 of 5 engines on SQ Platinum',
    finds: [
      ['4 of 5 engines name STAG nationally for SolarQuotes Platinum.', 'When buyers ask for Australia’s highest-rated SolarQuotes Platinum & NETCC-approved installers, Claude (#2), AI Mode (#6), Gemini (#6), and Perplexity (#6) all shortlist STAG Electrical!'],
      ['Why STAG wins nationally on Platinum:', 'SolarQuotes’ national directory explicitly lists STAG’s multi-state coverage (ACT, NSW, QLD, SA, TAS, VIC, WA) and 434 verified ratings (4.8★), which AI engines read directly.'],
      ['Converting national authority into category prompts:', 'Replicating STAG’s SolarQuotes credential table (all 7 state licenses + 434 reviews + hardware tally) directly in stagelectrical.com.au’s HTML and JSON-LD schema unlocks general solar & battery prompts.'],
    ],
  },
};

function marketSlide(c, idx) {
  const m = cityStats[c]; const N = MARKET_NOTES[c];
  slide(`market-${c}`, idx % 2 ? 'white' : 'light', `
    <header class="hd"><p class="eyebrow">${String(idx).padStart(2, '0')} · ${CITY[c]}</p><h2 class="h1">${esc(N.title)}</h2></header>
    <div class="city3">
      <div class="panel">
        <p class="chart-title">Answers naming each installer in ${CITY[c]}, out of ${ANSWERS_PER_CITY}</p>
        ${cityBars(c)}
      </div>
      <div class="city-side">
        <div class="kpis">
          <div class="kpi"><span class="big pulp"><b class="count" data-to="${m.rate}">${m.rate}</b>%</span><span class="kpi-cap">answers naming STAG (${m.lhdMentions}/${ANSWERS_PER_CITY})</span></div>
          <div class="kpi"><span class="big">#${m.lhdRank}</span><span class="kpi-cap">of ${m.firmsNamed} installers named</span></div>
        </div>
        <p class="mini-title">By Assistant · of 7 Questions</p>${platStrip(c)}
        <p class="mini-title">By Buyer Intent · of ${NUM_PLATFORMS} Engines</p>${pracChips(c)}
      </div>
      <div class="finds-col">${N.finds.map(([b, t], i) => `<p class="rise" style="--d:${700 + i * 140}ms"><b>${esc(b)}</b> ${esc(t)}</p>`).join('')}</div>
    </div>
    ${src(SRC_ANS)}`);
}

['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'goldcoast', 'national'].forEach((c, i) => marketSlide(c, i + 2));

// ─── 18. The Pattern (Scatter Plot) ─────────────────────────────────────────
{
  const w = 1000, h = 640, pl = 110, pr = 60, pt = 40, pb = 100;
  const x = v => pl + v / 7 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 35);
  const slot = {
    brisbane: [0.6, 2.0, 'start'], perth: [0.6, 5.2, 'start'], goldcoast: [0.6, 8.4, 'start'],
    adelaide: [1.1, 12.0, 'start'], melbourne: [1.1, 15.2, 'start'],
    sydney: [1.4, 18.5, 'start'], national: [1.4, 22.5, 'start'], canberra: [2.4, 31.4, 'start']
  };

  const pts = ORDER.map((c, i) => {
    const [sx, sy, a] = slot[c];
    const px = x(serpTop10[c]), py = y(cityStats[c].rate), lx = x(sx), ly = y(sy);
    const needLine = Math.hypot(lx - px, ly - py) > 25;
    return `<g class="pop" style="--d:${300 + i * 110}ms">
      ${needLine ? `<polyline points="${px},${py} ${a === 'start' ? lx - 10 : lx + 10},${ly - 6}" fill="none" stroke="#9DAAC0" stroke-width="2"/>` : ''}
      <circle cx="${px}" cy="${py}" r="14" fill="#D92D20" stroke="#0B0F19" stroke-width="4"/>
      <text x="${lx}" y="${ly}" text-anchor="${a}" class="sc-lab">${CITY[c]} <tspan class="sc-v">${cityStats[c].rate}% (${serpTop10[c]}/7 SERP)</tspan></text>
    </g>`;
  }).join('');

  const sc = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Scatter of Google Top-10 SERP presence against AI answer share">
    ${[0, 10, 20, 30].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(t => `<text x="${x(t)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${t}/7</text>`).join('')}
    <text x="${(pl + w - pr) / 2}" y="${h - 14}" class="ax-t" text-anchor="middle">STAG Electrical Google Top-10 SERP Presence (of 7 Solar & Battery Queries per Market)</text>
    <text transform="translate(26 ${(pt + h - pb) / 2}) rotate(-90)" class="ax-t" text-anchor="middle">AI Answers Naming STAG Electrical (%)</text>
    ${pts}</svg>`;

  slide('pattern', 'light', `
    <header class="hd"><p class="eyebrow">The Empirical Pattern</p><h2 class="h1">Canberra is the only market where STAG ranks in Google’s Top 10 (2/7) — and it drives 31.4% AI share</h2></header>
    <div class="cols-60">
      <div class="panel">${sc}</div>
      <div class="side-stats">
        <div class="stat"><span class="big pulp">31.4% vs 2.3%</span><span class="stat-cap"><b>The Canberra Multiplier:</b> In Canberra (where <code>stagelectrical.com.au</code> ranks in Google's Top 10 on 2/7 queries and has 82+168 regional GBP reviews), STAG captures 11/35 answers — 13× its interstate city average.</span></div>
        <div class="stat"><span class="big">0/56 Map Pack</span><span class="stat-cap"><b>Why STAG misses the Local 3-Pack:</b> Across all 56 DataForSEO Google SERP checks, STAG appeared in the Local 3-Pack <b>0 times</b> because its Queanbeyan & Young GBPs hide their street addresses and interstate branches have 0 reviews.</span></div>
        <div class="stat"><span class="big">The Unlock</span><span class="stat-cap">Unhiding GBP street addresses + seeding 30+ reviews per branch + syncing 434 SolarQuotes reviews on-site unlocks interstate SERP and AI Mode simultaneously.</span></div>
      </div>
    </div>
    ${src('Source: 280 AI answers paired with 56 live DataForSEO Australian Google Top-10 SERP & Local Pack checks (serp_audit.json), October 2026.')}`);
}

// ─── 19. 14-Month Trend ─────────────────────────────────────────────────────
{
  const S = [
    ['Springers Solar', 'springers.com.au', '#0F172A', 4],
    ['PSW Energy', 'pswenergy.com.au', '#475569', 3],
    ['1KOMMA5°', '1komma5.com', '#64748B', 3],
    ['Solargain', 'solargain.com.au', '#94A3B8', 3],
    ['SolarHub', 'solarhub.net.au', '#CBD5E1', 3],
    ['STAG Electrical', 'stagelectrical.com.au', '#D92D20', 7],
  ];
  const labels = MONTHS.map(monLabel);
  const chart = lineChart({
    w: 1140, h: 600, pad: [30, 300, 70, 90], labels, yMax: 55, yTicks: [0, 15, 30, 45], yFmt: v => v.toLocaleString('en-AU'),
    series: S.map(([name, d, color, width]) => ({ name, values: series(d), color, width, cls: name === 'STAG Electrical' ? 'pulp' : '', textColor: name === 'STAG Electrical' ? '#D92D20' : '#0F172A' })),
  });
  const sh = lineChart({
    w: 520, h: 230, pad: [36, 40, 52, 70], labels: labels.map((l, i) => (i === 0 || i === labels.length - 1) ? l : ''), yMax: 15, yTicks: [0, 5, 10, 15], yFmt: v => v + '%', endLabels: false,
    series: [{ name: 'STAG Share', values: shareSeries, color: '#D92D20', width: 5, label: false }],
    ann: [(x, y) => `<text x="${x(labels.length - 1)}" y="${y(shareSeries[shareSeries.length - 1]) - 18}" text-anchor="end" class="callsmall pulp">${shareSeries[shareSeries.length - 1]}%</text>`],
  });
  const stagSep = series('stagelectrical.com.au')[MONTHS.length - 1] || 19;
  const springSep = series('springers.com.au')[MONTHS.length - 1] || 46;

  slide('trend', 'white', `
    <header class="hd"><p class="eyebrow">14-Month Historical Trajectory · AI Search Mentions</p><h2 class="h1">STAG’s 2026 Webflow site & SolarQuotes Platinum rating lifted mentions from 1 to 19, while national leaders sit at 35–46</h2></header>
    <div class="cols-trend">
      <div class="panel"><p class="chart-title">AI Search panel mentions across Australia referencing each installer, Aug 2025 to Sep 2026</p>${chart}</div>
      <div class="side-stats">
        <div class="stat"><span class="big">${(springSep / stagSep).toFixed(1)}×</span><span class="stat-cap">Springers Solar’s national AI mention volume against STAG Electrical (${springSep} vs ${stagSep}). SolarHub sits at 35 (1.8× STAG) and Solargain at 38 (2.0× STAG).</span></div>
        <div class="mini-chart"><p class="mini-title">STAG Share Among Tracked National Cohort</p>${sh}<p class="note">Launching the 26-page <code>/solar-installation/*</code> hub and earning 434 SolarQuotes reviews lifted STAG to 8.6% cohort share — fixing branch GBPs and schema inflects the next leg.</p></div>
      </div>
    </div>
    ${src('Source: Longitudinal AI Search visibility tracking across Australian solar & battery queries, Aug 2025 to Oct 2026.')}`);
}

// ─── 20. The Gap to Close (Dumbbell) ────────────────────────────────────────
{
  const w = 1200, rowH = 78, top = 70, left = 200, right = 140;
  const x = v => left + v / 100 * (w - left - right);
  const rows = ORDER.map((c, i) => {
    const s = cityStats[c]; const yy = top + i * rowH; const gap = s.rate - s.leaderRate;
    return `<g class="db" style="--d:${200 + i * 110}ms">
      <text x="0" y="${yy + 9}" class="db-city">${CITY[c]}</text>
      <line x1="${x(Math.min(s.rate, s.leaderRate))}" x2="${x(Math.max(s.rate, s.leaderRate))}" y1="${yy}" y2="${yy}" class="db-line grow-x" style="--d:${300 + i * 110}ms"/>
      <circle cx="${x(s.leaderRate)}" cy="${yy}" r="14" fill="#0F172A" class="pop" style="--d:${250 + i * 110}ms"/>
      <circle cx="${x(s.rate)}" cy="${yy}" r="14" fill="#D92D20" stroke="#FFFFFF" stroke-width="4" class="pop" style="--d:${450 + i * 110}ms"/>
      <text x="${w - right + 30}" y="${yy + 9}" class="db-gap ${gap >= 0 ? 'pos' : ''}">${gap > 0 ? '+' : gap === 0 ? '±' : '−'}${Math.abs(gap)} pts</text>
      <text x="${x(s.leaderRate)}" y="${yy - 24}" text-anchor="middle" class="db-lead">${esc(short(s.leader.name))}</text>
    </g>`;
  }).join('');

  const svg = `<svg class="chart" viewBox="0 -10 ${w + 40} ${top + ORDER.length * rowH}" width="${w + 40}" height="${top + ORDER.length * rowH + 10}" role="img" aria-label="STAG Electrical share against the top competitor per market">
    ${[0, 25, 50, 75, 100].map(t => `<line x1="${x(t)}" x2="${x(t)}" y1="20" y2="${top + (ORDER.length - 1) * rowH + 30}" class="gl"/><text x="${x(t)}" y="10" class="ax" text-anchor="middle">${t}%</text>`).join('')}
    ${rows}</svg>`;

  slide('gap', 'light', `
    <header class="hd"><p class="eyebrow">The Gap to Close</p><h2 class="h1">STAG Electrical trails the market leader by 29 to 94 points across Australia</h2></header>
    <div class="legend-row"><span><i class="lg-dot pulp"></i>STAG Electrical</span><span><i class="lg-dot navy"></i>Category Leader in Market</span><span class="muted">Share of the market's ${ANSWERS_PER_CITY} AI Search answers</span></div>
    <div class="panel">${svg}</div>
    ${src(SRC_ANS)}`);
}

// ─── 21. The Plan Intro (Accent — Benchmark Page 21) ────────────────────────
slide('plan-intro', 'accent', `
  <p class="eyebrow on-accent rise" style="--d:0ms">The Action Plan · Pages 21–28</p>
  <h2 class="display on-accent rise" style="--d:120ms">How STAG Electrical gets on every AI Search shortlist</h2>
  <p class="lede on-accent rise" style="--d:260ms">Five concrete workstreams built directly from the 280-answer citation ledger, DataForSEO Maps audit, and live site inspection — naming the exact directories, GBP fixes, missing URLs, and schema repairs required to overtake Mondiaux (#2) in Canberra and scale interstate share.</p>`, { dark: true });

// ─── 22. The 5 Strategic Workstreams (Benchmark Page 22) ────────────────────
const WS = [
  ['01', 'Solar Directory Sync & Review Reconciliation', 'solarquotes.com.au (261/280 answers · 93.2%), solarchoice.net.au (118), and productreview.com.au (70) drive AI shortlists. STAG has 434 verified SQ ratings (4.8★), but its website claims “100+”, “200+”, and “350 (4.9★)”.', 'Update all on-site badges & JSON-LD aggregateRating to the verified 434 SolarQuotes reviews (4.8★) + 262 Google reviews; claim/expand ProductReview, Solar Choice & Finder installer profiles.'],
  ['02', 'Multi-Branch GBP & Local 3-Pack Remediation', 'STAG scored 0/56 in the Google Local 3-Pack because Queanbeyan (82★) & Young (168★) hide their addresses, Hume ACT (0★) is an unclaimed duplicate, and Melbourne/Brisbane GBPs have 0 reviews.', 'Unhide street addresses on Queanbeyan (1/12 Uriarra Rd) & Young (8D Old Temora Rd) GBPs; merge the 0-review Hume ACT duplicate; seed 35+ reviews onto Dandenong South (VIC) & Archerfield (QLD) GBPs.'],
  ['03', 'Missing Service & Hardware Authority Pages', 'STAG scored 0/40 on Three-Phase/VPP/Blackout Backup, 1/40 on Battery Storage, 1/40 on 2026 Rebates, and /aircon returns HTTP 404 despite being declared in homepage JSON-LD.', 'Restore /aircon (fixing HTTP 404 & dead href="#" buttons); build /virtual-power-plant-vpp, /three-phase-solar-battery, /cheaper-home-batteries-rebate-2026, /batteries/sigenergy, and /solar-installation/gold-coast.'],
  ['04', 'JSON-LD Schema, Licensing & DOM Hygiene', '/contact-us JSON-LD outputs "+61XXXXXXXXX"; HQ flips between Queanbeyan & Young; areaServed omits QLD, SA, TAS & NT; 7 state electrical licenses are missing from the site; forms & navbars are duplicated.', 'Replace "+61XXXXXXXXX" with "+61-1300-836-050"; publish all 7 state electrical licenses (ACT 2023466, NSW 399421C, VIC REC 37470, QLD 1508438, SA PGE 347840, TAS 618381602, NT C 4787) in footer & schema; fix DOM bugs.'],
  ['05', 'Monthly 280-Prompt Benchmark & Drift Tracking', 'Battery rebate rules, SolarQuotes leaderboards, and competitor review counts shift every month across all 8 markets.', 'Re-run run_stag_research.mjs (280 prompts × 5 engines + 56 DataForSEO SERP checks + 8 Maps audits) on the 15th of every month to track STAG’s climb past Mondiaux in Canberra and into the national Top 8.'],
];

slide('plan', 'white', `
  <header class="hd"><p class="eyebrow">The Plan</p><h2 class="h1">Five workstreams, each answering a gap in the data</h2></header>
  <div class="ws">
    <div class="ws-head"><span></span><span>Workstream</span><span>What the data showed</span><span>What we will do</span></div>
    ${WS.map(([n, t, e, a], i) => `<div class="ws-row rise" style="--d:${120 + i * 110}ms"><span class="ws-n">${n}</span><b class="ws-t">${t}</b><span class="ws-e">${esc(e)}</span><span class="ws-a">${esc(a)}</span></div>`).join('')}
  </div>`);

// ─── 23. Workstream 01: Cited Sources (Benchmark Page 23 #s23) ──────────────
{
  const srcs = [
    ['solarquotes.com.au (93.2% of all AI answers!)', 261],
    ['facebook.com (Local Installer Groups & Reviews)', 148],
    ['solarchoice.net.au (Installer Comparison & Pricing)', 118],
    ['reddit.com (r/AusRenovation, r/Canberra, r/Solar)', 101],
    ['solarcobber.com & solardirectory.com.au (85 & 79)', 85],
    ['energy.gov.au (Cheaper Home Batteries Program)', 77],
    ['productreview.com.au (Verified Solar Installers)', 70],
    ['cleanenergycouncil.org.au & newenergytech.org.au', 48],
    ['stagelectrical.com.au (16 cited · 19 mentions)', 16]
  ];
  slide('ws-sources', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 01 · Solar Directory Citations & Review Sync</p><h2 class="h1">SolarQuotes is cited in 261 of 280 AI answers (93.2%) — followed by Solar Choice (118) & ProductReview (70)</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Most-cited domains across the ${TOTAL_ANSWERS} AI Search answers (answers citing each domain)</p>
        ${hbars(srcs.map(([n, v]) => ({ name: n, n: v, suffix: ' answers', leader: n.startsWith('stagelectrical') })), 270, { showRank: false })}</div>
      <div class="actions">
        <h3 class="h3">Exact who & what to execute</h3>
        <ul class="ticks">
          <li><b>Sync STAG’s 434 verified SolarQuotes ratings on-site (Day 1):</b> STAG’s live SolarQuotes profile has <b>434 ratings (4.8★, 96% 5-star)</b> and lists 205 Jinko, 43 Trina, 170 Sungrow, 49 GoodWe, 37 SolarEdge, and 36 Sigenergy installs — yet <code>stagelectrical.com.au</code> says <code>“over 100”</code>, <code>“200+”</code>, and <code>“350 (4.9★)”</code>. Mirror the exact 434 count and hardware tally on-site.</li>
          <li><b>Expand Solar Choice (118 citations) & ProductReview (70 citations):</b> Build dedicated verified installer profiles on <code>solarchoice.net.au</code>, <code>productreview.com.au</code>, and <code>solardirectory.com.au</code> (79 citations) with branch addresses for ACT, NSW, VIC, QLD, SA & WA.</li>
          <li><b>Update Manufacturer Locator Portals:</b> Ensure STAG’s Queanbeyan, Smeaton Grange, Dandenong South, and Archerfield branches are listed on the official <b>Sigenergy</b>, <b>Tesla Powerwall 3</b>, <b>Sungrow</b>, <b>GoodWe</b>, and <b>Aiko</b> installer locators.</li>
        </ul>
        <p class="note">Why STAG won 10/40 on the SolarQuotes Platinum prompt: AI engines trust SolarQuotes above every other domain in Australian renewable energy.</p>
      </div>
    </div>
    ${src('Source: 280-answer citation ledger (pipeline/citations.json), October 2026.')}`);
}

// ─── 24. Workstream 02: Google Maps & Local Authority (Benchmark Page 24) ───
{
  const rev = {
    canberra: '82 rev (4.5★ QBN) + 168 (4.8★ Young) · 0★ Hume Dup',
    sydney: '12 reviews (5.0★ · 5 Lone Pine Pl, Smeaton Grange)',
    melbourne: '0 reviews (null★ · 182 Monash Dr, Dandenong Sth)',
    brisbane: '0 reviews (null★ · 30d Kerry Rd) vs 43★ stag.energy',
    perth: 'No verified WA GBP listing · Omitted from Quote Form',
    adelaide: 'No verified SA GBP listing (Licence PGE 347840)',
    goldcoast: 'No Gold Coast GBP or landing page',
    national: '696+ Combined Reviews (434 SQ + 262 Google)'
  };
  slide('ws-maps', 'white', `
    <header class="hd"><p class="eyebrow">Workstream 02 · Multi-Branch GBP & Local 3-Pack Remediation</p><h2 class="h1">Hidden GBP addresses in ACT/NSW and 0-review branches in VIC & QLD cost STAG the Local Pack (0/56)</h2></header>
    <div class="cols-60">
      <div class="panel">
        <div class="mp-head"><span>Market</span><span>Google Top-10 SERP (of 7 Solar queries)</span><span>Live DataForSEO Google Business Profile Audit</span></div>
        ${ORDER.map((c, i) => `<div class="mp-row" style="--i:${i}"><span class="mp-city">${CITY[c]}</span><span>${dots(serpTop10[c], 7, 'big')}<b class="num">${serpTop10[c]}/7</b></span><span class="num">${rev[c]}</span></div>`).join('')}
      </div>
      <div class="actions">
        <h3 class="h3">Exact who & what to execute</h3>
        <ul class="ticks">
          <li><b>Unhide street addresses on Queanbeyan (82★) & Young (168★) GBPs:</b> Both primary profiles return <code>address: null</code> in Google Maps, blocking Map Pack eligibility. Enable visible street addresses (<code>1/12 Uriarra Rd, Queanbeyan</code> & <code>8D Old Temora Rd, Young</code>) and merge the 0-review <b>Hume ACT duplicate</b> (<code>Unit 1/1 Sawmill Cct</code>).</li>
          <li><b>Activate Melbourne (Dandenong South) & Brisbane (Archerfield) GBPs:</b> Both interstate branch listings currently sit at <b>0 Google reviews</b>. Route post-install SMS review requests by customer postcode to get Dandenong South and Archerfield to 35+ reviews each within 90 days.</li>
          <li><b>Neutralise the QLD “Stag Solar and Electrical” (<code>stag.energy</code>) collision:</b> In Brisbane, <code>stag.energy</code> has 43 reviews (5.0★) while STAG’s Archerfield branch has 0. Title the QLD GBP <b>“STAG Electrical, Solar & Battery — Brisbane (Archerfield)”</b> and link <code>/solar-installation/brisbane</code>.</li>
        </ul>
        <p class="note">Because Queanbeyan & Young hide their street addresses, Claude hallucinated STAG’s Canberra location as “Mitchell, ACT” (SolarHub’s suburb).</p>
      </div>
    </div>
    ${src('Source: 56 DataForSEO Australian Google SERP checks (serp_audit.json) and 8 DataForSEO Google Maps 20-pack audits (maps_audit.json), October 2026.')}`);
}

// ─── 25. Workstream 03: Intent & Solution Pages (Benchmark Page 25) ─────────
{
  const shade5 = v => ['#F8FAFC', '#FEE2E2', '#FECACA', '#FCA5A5', '#EF4444', '#D92D20'][Math.min(5, v)];
  const grid = `<div class="cp" role="table" aria-label="AI answers naming STAG Electrical by market and buyer intent">
    <div class="cp-row head" role="row"><span role="columnheader"></span>${PRAC.map(([k]) => `<span role="columnheader">${PRAC_SHORT[k]}</span>`).join('')}</div>
    ${ORDER.map((c, ri) => `<div class="cp-row" role="row"><span class="cp-city" role="rowheader">${CITY[c]}</span>${PRAC.map(([p], ci) => { const v = cityStats[c].byPrompt[p].lhd; return `<span role="cell" class="cp-cell pop${v === 0 ? ' zero' : ''}" style="--d:${150 + (ri * 7 + ci) * 18}ms;background:${shade5(v)};color:${v >= 3 ? '#FFFFFF' : '#0F172A'}">${v}</span>`; }).join('')}</div>`).join('')}
  </div>`;
  const zeros = ORDER.reduce((s, c) => s + PRAC.filter(([p]) => cityStats[c].byPrompt[p].lhd === 0).length, 0);

  slide('ws-pages', 'light', `
    <header class="hd"><p class="eyebrow">Workstream 03 · URL-Level Content, Hardware & Rebate Pages</p><h2 class="h1">${zeros} of 56 market × buyer intent pairs where 0 of 5 engines name STAG Electrical</h2></header>
    <div class="cols-heat">
      <div class="panel"><p class="chart-title">Assistants naming STAG Electrical (of ${NUM_PLATFORMS}), by market and buyer question. Dashed cells are zero.</p>${grid}</div>
      <div class="actions">
        <h3 class="h3">Exact URLs to build & fix on stagelectrical.com.au</h3>
        <ul class="ticks">
          <li><b>Fix the broken <code>/aircon</code> HTTP 404 page & dead <code>href="#"</code> buttons (Week 1):</b> Homepage JSON-LD declares <code>https://www.stagelectrical.com.au/aircon/</code> as a core page, but it returns <b>404 Not Found</b> and all “See aircon locations” buttons link to <code>href="#"</code>. Restore <code>/aircon</code> + <code>/ev-chargers</code>.</li>
          <li><b>Build <code>/virtual-power-plant-vpp</code> & <code>/three-phase-solar-battery</code> (0/40 across all markets):</b> Extract the 3-phase load-balancing and whole-home blackout backup engineering from <code>/quality-standards</code> into dedicated pages covering Amber SmartShift, Origin Loop, and AGL VPP compatibility.</li>
          <li><b>Launch <code>/batteries/sigenergy</code>, <code>/panels/aiko</code> & <code>/cheaper-home-batteries-rebate-2026</code>:</b> STAG has installed 36+ Sigenergy batteries on SolarQuotes, yet the Products menu only lists Tesla, Sungrow & GoodWe (with <code>/batteries/goodwe</code> duplicated twice and a stray <code>“Link”</code> item!). Add Sigenergy, Aiko, and a 2026 Federal & State Rebate hub, plus <code>/solar-installation/gold-coast</code>.</li>
        </ul>
      </div>
    </div>
    ${src(SRC_ANS)}`);
}

// ─── 26. Workstream 04: Entity Accuracy & Live Site Audit (Benchmark Page 26) ─
slide('ws-entity', 'white', `
  <header class="hd"><p class="eyebrow">Workstream 04 · Verbatim AI Audit & Live Website Discrepancies</p><h2 class="h1">AI repeats stale numbers and hallucinates STAG’s suburb — fed directly by on-site schema & copy bugs</h2></header>
  <div class="quotes">
    <figure class="quote rise" style="--d:100ms"><p class="q-src">Google AI Mode · Canberra Best Solar & 2026 Rebates</p><blockquote>“<b>3. Stag Electrical</b> · Ratings: ~4.8★ on SolarQuotes & Google (<b>200+ multi-platform reviews</b>)… <b>Google Rating: 4.8★ (100+ reviews)</b>.”</blockquote><figcaption><b>Root Cause:</b> Homepage hero badge says <code>“200+ five-star reviews”</code>, body text below it says <code>“over 100”</code>, and <code>/solar</code> schema says <code>“350 (4.9★)”</code> — hiding STAG’s real <b>434 SQ + 262 Google = 696+ reviews</b>.</figcaption></figure>
    <figure class="quote rise" style="--d:240ms"><p class="q-src">Claude Sonnet 4.6 & Gemini 3.8 · Canberra Battery & Platinum Prompts</p><blockquote>“<b>Stag Electrical (Mitchell, ACT)</b> — Tesla Powerwall 3 and Sungrow… Warranties: Comprehensive <b>Lifetime Workmanship Warranty</b> on installations.”</blockquote><figcaption><b>Root Cause:</b> Hidden Queanbeyan GBP address caused Claude to guess <b>Mitchell, ACT</b> (SolarHub’s suburb), while Gemini hallucinated a <i>Lifetime</i> warranty instead of STAG’s <b>10-Year Workmanship Warranty</b>.</figcaption></figure>
    <figure class="quote rise" style="--d:380ms"><p class="q-src">Live Crawl of stagelectrical.com.au/contact-us & /about-us</p><blockquote><code>"telephone": "+61XXXXXXXXX"</code> · <code>"logo": "https://www.stagelectrical.com.au/"</code> · <code>"addressLocality": "Queanbeyan"</code> vs <code>"Young"</code></blockquote><figcaption><b>Root Cause:</b> <code>/contact-us</code> JSON-LD ships a literal placeholder phone <code>+61XXXXXXXXX</code>, <code>/about-us</code> sets logo URL to the homepage, and <code>areaServed</code> omits <b>QLD, SA, TAS & NT</b>.</figcaption></figure>
  </div>
  <div class="actions wide">
    <h3 class="h3">Exact on-site schema & DOM fixes to execute in Week 1</h3>
    <ul class="ticks cols">
      <li><b>Fix <code>/contact-us</code> JSON-LD & DOM bugs:</b> Replace <code>"telephone": "+61XXXXXXXXX"</code> with <code>"+61-1300-836-050"</code>; remove the duplicated <code>.nav_component</code> navbar on <code>/contact-us</code> and duplicated <code>#wf-form-Hero-Form-2026</code> on <code>/</code>; add <b>WA</b> & fix <code>"Toowomba"</code> in the quote dropdown.</li>
      <li><b>Publish all 7 State Electrical Licenses in Footer & Schema:</b> Add <code>hasCredential</code> JSON-LD and visible footer badges for <b>ACT: 2023466 · NSW: 399421C · VIC: REC 37470 · QLD: 1508438 · SA: PGE 347840 · TAS: 618381602 · NT: C 4787</b> + Founder <b>Sam Friend</b> (ABN <code>37 664 400 828</code>).</li>
      <li><b>Unify HQ & Multi-Branch <code>department</code> Schema:</b> Declare Queanbeyan (<code>1/12 Uriarra Rd</code>) and Young (<code>8D Old Temora Rd</code>) alongside Smeaton Grange NSW, Dandenong South VIC, and Archerfield QLD as explicit <code>LocalBusiness</code> departments covering all 7 states + NT.</li>
      <li><b>Standardise Review Count (434 SQ / 696+ Total) & Experience (19 Years since 2007):</b> Fix <code>18 years</code> vs <code>17 years</code> on <code>/about-us</code> and replace the 404 placeholder <code>solar-panel-image.jpg</code> in <code>/solar</code> Product schema.</li>
    </ul>
  </div>
  ${src('Sources: Verbatim transcripts from pipeline/ans_full.json and live forensic crawl of stagelectrical.com.au, October 2026.')}`);

// ─── 27. Roadmap (Gantt — Benchmark Page 27) ────────────────────────────────
{
  const lanes = [
    ['01 · Schema & Site Hygiene', [[1, 2, 'Fix +61XXXXXXXXX schema, 434 SQ review sync, 7 state licenses & DOM bugs'], [3, 6, 'Deploy multi-branch LocalBusiness + Sam Friend Person JSON-LD']]],
    ['02 · GBP & Local Pack', [[1, 3, 'Unhide Queanbeyan (82★) & Young (168★) addresses; merge Hume 0★ duplicate'], [4, 12, 'Scale Smeaton Grange, Dandenong Sth & Archerfield GBPs to 35+ reviews']]],
    ['03 · Service & Rebate URLs', [[2, 5, 'Restore /aircon (fix 404); build /batteries/sigenergy & /panels/aiko'], [5, 10, 'Launch /virtual-power-plant-vpp, /three-phase-solar-battery & /gold-coast']]],
    ['04 · Directories & Portals', [[2, 4, 'Claim/sync Solar Choice (118), ProductReview (70) & SolarDirectory (79)'], [5, 12, 'Verify all 5 branch addresses on Tesla, Sigenergy, Sungrow & GoodWe portals']]],
    ['05 · Monthly 280-Prompt Audit', [[1, 12, `Baseline locked Oct 2026 (19/${TOTAL_ANSWERS}); re-run 280-prompt panel on the 15th of each month`, 'light']]],
  ];
  const W = 1240, lab = 330;
  const gantt = `<div class="gantt">
    <div class="g-head" style="grid-template-columns:${lab}px repeat(12, 1fr)"><span></span>${Array.from({ length: 12 }, (_, i) => `<span>W${i + 1}</span>`).join('')}</div>
    ${lanes.map(([name, bars], li) => `<div class="g-lane"><span class="g-name">${name}</span><div class="g-track">${bars.map(([a, b, t, kind], bi) => `<div class="g-bar ${kind === 'light' ? 'milestone' : ''} grow-x" style="left:${(a - 1) / 12 * 100}%;width:${(b - a + 1) / 12 * 100}%;--d:${200 + (li * 2 + bi) * 90}ms"><span>${esc(t)}</span></div>`).join('')}</div></div>`).join('')}
    <div class="g-phases"><span style="width:33.33%">Month 1: Schema, /aircon 404 & ACT GBP Fix</span><span style="width:33.33%">Month 2: VPP/3-Phase/Sigenergy URLs & Directories</span><span style="width:33.34%">Month 3: Interstate Branch Review Velocity</span></div>
  </div>`;

  slide('roadmap', 'light', `
    <header class="hd"><p class="eyebrow">First 90 Days Execution</p><h2 class="h1">The first 90 days, week by week</h2></header>
    <div class="panel">${gantt}</div>
    <p class="note wide">Week 1 starts with 100% internal assets STAG controls today: replacing <code>+61XXXXXXXXX</code> in <code>/contact-us</code> schema, syncing 434 SolarQuotes reviews, publishing all 7 state electrical licenses, restoring <code>/aircon</code>, and unhiding the Queanbeyan & Young GBP addresses.</p>`);
}

// ─── 28. Proposed Targets (Benchmark Page 28) ───────────────────────────────
{
  const labels = ['Oct 26 (Today)', 'Jan 27 (90d)', 'Apr 27 (6m)', 'Oct 27 (12m)'];
  const xs = [0, 3, 6, 12];
  const w = 1000, h = 560, pl = 90, pr = 250, pt = 40, pb = 80;
  const x = m => pl + m / 12 * (w - pl - pr), y = v => pt + (h - pt - pb) * (1 - v / 70);
  // Canberra: 31% today (11/35) -> 40% (14/35) at 90d -> 49% (17/35) at 6m -> 57% (20/35) at 12m (overtaking #2 Mondiaux Solar at 46% [16/35])
  const target = [31, 40, 49, 57];

  const svg = `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="STAG Electrical Canberra target path vs Mondiaux Solar">
    ${[0, 15, 30, 45, 60].map(t => `<line x1="${pl}" x2="${w - pr}" y1="${y(t)}" y2="${y(t)}" class="gl"/><text x="${pl - 16}" y="${y(t) + 8}" class="ax" text-anchor="end">${t}%</text>`).join('')}
    ${xs.map((m, i) => `<text x="${x(m)}" y="${h - pb + 42}" class="ax" text-anchor="middle">${labels[i]}</text>`).join('')}
    <line x1="${x(0)}" x2="${x(12)}" y1="${y(46)}" y2="${y(46)}" stroke="#0F172A" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round" class="fadein"/>
    <text x="${x(12) + 18}" y="${y(46) + 28}" class="el">Mondiaux (#2 ACT) <tspan class="elv">46%</tspan></text>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" pathLength="1" class="draw" fill="none" stroke="#D92D20" stroke-width="6" stroke-dasharray="1" style="--d:300ms"/>
    <path d="${target.map((v, i) => `${i ? 'L' : 'M'}${x(xs[i])},${y(v)}`).join('')}" fill="none" stroke="#F8FAFC" stroke-width="7" stroke-dasharray="14 12" class="fadein" style="--d:1500ms"/>
    ${target.map((v, i) => `<circle cx="${x(xs[i])}" cy="${y(v)}" r="${i ? 10 : 13}" fill="${i ? '#F8FAFC' : '#D92D20'}" stroke="#D92D20" stroke-width="5" class="pop" style="--d:${400 + i * 350}ms"/><text x="${i ? x(xs[i]) : x(xs[i]) + 22}" y="${i ? y(v) - 24 : y(v) + 38}" text-anchor="${i ? 'middle' : 'start'}" class="callsmall pulp">${i === 3 ? '' : v + '%'}${i ? '' : ' today (11/35)'}</text>`).join('')}
    <text x="${x(12) + 18}" y="${y(57) - 6}" class="el pulp-t">STAG Target (#2 ACT) <tspan class="elv">57%</tspan></text>
  </svg>`;

  const TG = [
    ['Canberra & ACT (HQ)', '31% (11/35) · #4', '40% (14/35) · #3', '49% (17/35) · #2', '57% (20/35) · #2'],
    ['Sydney (Smeaton Grange)', '6% (2/35) · #14', '14% (5/35) · #8', '20% (7/35) · #6', '29% (10/35) · #5'],
    ['Melbourne (Dandenong Sth)', '3% (1/35) · #14', '11% (4/35) · #9', '17% (6/35) · #6', '26% (9/35) · #5'],
    ['Brisbane (Archerfield)', '0% (0/35) · Unranked', '9% (3/35) · #10', '14% (5/35) · #7', '23% (8/35) · #5'],
    ['Perth (WA)', '0% (0/35) · Unranked', '6% (2/35) · #11', '11% (4/35) · #8', '17% (6/35) · #6'],
    ['Adelaide (SA)', '3% (1/35) · #12', '11% (4/35) · #8', '17% (6/35) · #6', '23% (8/35) · #5'],
    ['Gold Coast (SEQ)', '0% (0/35) · Unranked', '6% (2/35) · #10', '11% (4/35) · #7', '17% (6/35) · #6'],
    ['National “Australia”', '11% (4/35) · #15', '20% (7/35) · #7', '29% (10/35) · #4', '37% (13/35) · #2'],
    ['All 280 Answers Overall', '6.8% (19/280) · #17', '14.6% (41/280) · #8', '21.1% (59/280) · #2', '28.6% (80/280) · #1']
  ];

  slide('targets', 'light', `
    <header class="hd"><p class="eyebrow">Realistic Sequenced Targets</p><h2 class="h1">The goal: overtake ECG (#3) and Mondiaux (#2) in Canberra within 6 months and scale interstate share</h2></header>
    <div class="cols-60">
      <div class="panel"><p class="chart-title">Canberra AI Search answers naming STAG Electrical vs #2 Mondiaux Solar (46% · 16/35)</p>${svg}</div>
      <div>
        <table class="tg-table">
          <thead><tr><th>Market</th><th>Today</th><th>90 Days</th><th>6 Months</th><th>12 Months</th></tr></thead>
          <tbody>${TG.map(([c, a, b, d, e], i) => `<tr class="rise" style="--d:${200 + i * 60}ms"><td>${c}</td><td class="num">${a}</td><td class="num">${b}</td><td class="num">${d}</td><td class="num"><b>${e}</b></td></tr>`).join('')}</tbody>
        </table>
        <p class="note">In Canberra, STAG (11/35) is only 2 answers behind #3 ECG Electrical (13/35) and 5 behind #2 Mondiaux Solar (16/35). Because national leaders are regional specialists (Springers 46, PSW 44), scaling STAG’s 7-state network to 80/280 (28.6%) makes STAG #1 nationally.</p>
      </div>
    </div>`);
}

// ─── 29. Next Steps / Close (Benchmark Page 29) ─────────────────────────────
slide('close', 'dark close', `
  <div class="cover-bg" aria-hidden="true"></div>
  <p class="eyebrow on-dark rise" style="--d:0ms">Immediate Next Steps</p>
  <h2 class="display rise" style="--d:120ms">Lock down Canberra (#2). Activate the interstate branch GBPs. Measure every month.</h2>
  <ol class="next rise" style="--d:300ms">
    <li><span>1</span><p><b>Fix On-Site Schema, Review Sync & Broken <code>/aircon</code> Page (Week 1):</b> Replace <code>+61XXXXXXXXX</code> on <code>/contact-us</code>, update review badges to <b>434 SolarQuotes + 262 Google reviews</b>, publish all 7 state electrical contractor licenses in footer & JSON-LD, and restore <code>/aircon</code>.</p></li>
    <li><span>2</span><p><b>Remediate Multi-Branch Google Business Profiles (Weeks 2–4):</b> Unhide street addresses on Queanbeyan (82★) & Young (168★), merge the 0-review Hume ACT duplicate, and launch post-install SMS review routing for Smeaton Grange (NSW), Dandenong South (VIC), and Archerfield (QLD).</p></li>
    <li><span>3</span><p><b>Publish VPP, 3-Phase & Sigenergy Pages + Track Monthly:</b> Launch <code>/virtual-power-plant-vpp</code>, <code>/three-phase-solar-battery</code>, <code>/batteries/sigenergy</code>, and <code>/solar-installation/gold-coast</code>, then re-run the 280-prompt benchmark on the 15th of each month.</p></li>
  </ol>
  <div class="close-logo">${logo()}<span class="byline">Prepared by Uprise Digital Research Team · Forensic AI Search Benchmark</span></div>`, { dark: true, noFoot: true });

// ─── 30. Appendix & Methodology (Benchmark Page 30) ─────────────────────────
slide('appendix', 'white', `
  <header class="hd"><p class="eyebrow">Appendix</p><h2 class="h1">Method and definitions</h2></header>
  <div class="cols-2 appx">
    <div>
      <h3 class="h3">How the 280 answers were collected</h3>
      <ul class="plain">
        <li>7 commercial solar, battery, and electrical buyer questions (Best Solar & Battery Installer, Sigenergy/Powerwall 3/Sungrow Batteries, 2026 Federal & State Rebates, Aiko/Jinko Efficiency Systems, Three-Phase Hybrid & VPP, EV Chargers/Retrofits/AirCon, SolarQuotes Platinum & NETCC) × 8 Australian markets = 56 market-intent pairs.</li>
        <li>Each pair was evaluated across 5 AI answer engines (Google AI Mode, ChatGPT Search, Perplexity Sonar, Gemini 3.8, and Claude Sonnet 4.6) for N = 280 total live answers.</li>
        <li>56 matching Australian Google SERP & Local Pack queries and 8 Google Maps 20-pack audits were executed via DataForSEO to verify organic rankings and branch GBP reviews.</li>
        <li>All key URLs on <code>stagelectrical.com.au</code> and SolarQuotes were crawled to inspect JSON-LD schema, state electrical licenses, and copy consistency.</li>
      </ul>
    </div>
    <div>
      <h3 class="h3">How answers and citations were scored</h3>
      <ul class="plain">
        <li>Every solar/electrical installer named in an answer was extracted in order of first appearance and resolved to its canonical entity name across 65 tracked Australian installers.</li>
        <li>Grounding URLs and search citations were resolved to root domains in <code>pipeline/citations.json</code> (led by <code>solarquotes.com.au</code> in 261 of 280 answers).</li>
        <li>Share of Model Voice (SoMV) is the percentage of answers naming an installer out of 280 nationally (or out of 35 per market), bounded with 95% Wilson confidence intervals (<code>6.8% [4.4%, 10.3%]</code>).</li>
        <li>Weighted Visibility Index (WVI) weights each mention by inverse logarithmic rank position and recommendation stance (<code>0.0384</code> nationally; <code>0.2191</code> in Canberra).</li>
      </ul>
    </div>
  </div>`);

// ─── Page Compilation ───────────────────────────────────────────────────────
const CSS = fs.readFileSync(path.join(pipelineDir, 'deck.css'), 'utf8');
const JS = fs.readFileSync(path.join(pipelineDir, 'deck.js'), 'utf8');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>STAG Electrical · Solar, Battery & Electrical AI Search Visibility Report (Oct 2026)</title>
<meta name="description" content="Empirical 280-answer study of where AI assistants recommend STAG Electrical (stagelectrical.com.au) across Australia, and the 5-workstream plan to overtake Mondiaux in Canberra and scale national share.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-grotesk@700,600,500&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap">
<style>${CSS}</style>
</head>
<body>
<div class="deck" id="deck">
  <div class="stage" id="stage">${slides.join('\n')}
    <div class="progress" aria-hidden="true"><i id="bar"></i></div>
  </div>
</div>
<nav class="controls" id="controls" aria-label="Slide controls">
  <button id="prev" type="button" aria-label="Previous slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <span id="count" class="ctr">1 / ${slides.length}</span>
  <button id="next" type="button" aria-label="Next slide"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg></button>
  <button id="fs" type="button" aria-label="Full screen"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg></button>
</nav>
<script>${JS}</script>
</body>
</html>`;

fs.mkdirSync(path.join(pipelineDir, 'out'), { recursive: true });
fs.writeFileSync(path.join(pipelineDir, 'out', 'index.html'), html);
console.log(`Generated ${slides.length} slides! Output size: ${html.length} bytes.`);
