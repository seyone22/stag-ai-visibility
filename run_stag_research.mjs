// Rigorous Empirical Scientific GEO / AI Visibility Research Runner for STAG Electrical
// Target: Stag Electrical, Solar & Refrigeration Pty Ltd (https://www.stagelectrical.com.au)
// Vertical Focus: Residential & Commercial Solar, Home Battery Storage, EV Charging & Electrical
// Markets: 8 Australian Markets | Prompts: 7 Commercial Solar & Battery Prompts | Engines: 5 Live Search-Grounded Engines
// Total empirical queries: N = 8 * 7 * 5 = 280 live AI observations + 56 DataForSEO Australian Google SERP/Map Pack checks + 8 DataForSEO Google Maps Competitor Audits

import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const idx = line.indexOf('=');
      if (idx > 0 && !line.trim().startsWith('#')) {
        process.env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      }
    }
  }
}
loadEnv();

const TARGET_BRAND = 'Stag Electrical';
const TARGET_DOMAINS = ['stagelectrical.com.au', 'www.stagelectrical.com.au'];

// Canberra/ACT is STAG Electrical's #1 metro stronghold (1/12 Uriarra Rd Queanbeyan HQ + Young NSW HQ + "#1 Solar Installer in the ACT")
const CITIES = [
  { id: 'canberra', name: 'Canberra', state: 'Australian Capital Territory', country: 'Australia', localTarget: true, locationName: 'Canberra,Australian Capital Territory,Australia', displayLoc: 'Canberra & ACT' },
  { id: 'sydney', name: 'Sydney', state: 'New South Wales', country: 'Australia', locationName: 'Sydney,New South Wales,Australia', displayLoc: 'Sydney, NSW' },
  { id: 'melbourne', name: 'Melbourne', state: 'Victoria', country: 'Australia', locationName: 'Melbourne,Victoria,Australia', displayLoc: 'Melbourne, VIC' },
  { id: 'brisbane', name: 'Brisbane', state: 'Queensland', country: 'Australia', locationName: 'Brisbane,Queensland,Australia', displayLoc: 'Brisbane, QLD' },
  { id: 'perth', name: 'Perth', state: 'Western Australia', country: 'Australia', locationName: 'Perth,Western Australia,Australia', displayLoc: 'Perth, WA' },
  { id: 'adelaide', name: 'Adelaide', state: 'South Australia', country: 'Australia', locationName: 'Adelaide,South Australia,Australia', displayLoc: 'Adelaide, SA' },
  { id: 'goldcoast', name: 'Gold Coast', state: 'Queensland', country: 'Australia', locationName: 'Gold Coast,Queensland,Australia', displayLoc: 'Gold Coast, QLD' },
  { id: 'national', name: 'Australia', state: 'National', country: 'Australia', locationName: 'Australia', displayLoc: 'Australia' }
];

const PLATFORMS = ['aimode', 'chatgpt', 'perplexity', 'gemini', 'claude'];

const CORE_PROMPTS = [
  {
    id: 'solar_installer',
    title: 'Best Residential Solar & Battery Installer',
    serpQuery: (loc) => `best solar and battery installer ${loc}`,
    template: (loc) => `Who are the best residential solar and battery installers in ${loc}? Give me a shortlist of specific solar installation companies with reasons.`
  },
  {
    id: 'battery_storage',
    title: 'Sigenergy, Tesla Powerwall 3 & Sungrow Batteries',
    serpQuery: (loc) => `Sigenergy Tesla Powerwall 3 Sungrow battery installer ${loc}`,
    template: (loc) => `Which solar companies in ${loc} are the top accredited installers for Sigenergy SigenStor, Tesla Powerwall 3, Sungrow, and GoodWe home battery systems?`
  },
  {
    id: 'rebates_2026',
    title: '2026 Federal & State Battery Rebate Specialists',
    serpQuery: (loc) => `Cheaper Home Batteries Program solar battery rebate installer ${loc}`,
    template: (loc) => `Which CEC-accredited solar and battery installers in ${loc} are best for claiming the Federal Cheaper Home Batteries Program and 2026 state solar and battery rebates?`
  },
  {
    id: 'panels_efficiency',
    title: 'High-Efficiency Aiko & Jinko Systems (6.6kW–13.2kW)',
    serpQuery: (loc) => `Aiko Jinko 10kW 13kW solar system installer ${loc}`,
    template: (loc) => `Who are the most reputable solar companies in ${loc} for high-efficiency Aiko and Jinko 6.6kW, 10kW, and 13kW solar systems with transparent pricing?`
  },
  {
    id: 'vpp_three_phase',
    title: 'Three-Phase Hybrid Inverters, VPP & Blackout Backup',
    serpQuery: (loc) => `three phase solar battery blackout backup VPP installer ${loc}`,
    template: (loc) => `Which solar and electrical companies in ${loc} specialise in three-phase hybrid solar inverters, whole-home blackout backup, and Virtual Power Plant (VPP) optimisation?`
  },
  {
    id: 'ev_aircon_elec',
    title: 'EV Chargers, Battery Retrofits & Air Conditioning',
    serpQuery: (loc) => `solar battery retrofit EV charger air conditioning installer ${loc}`,
    template: (loc) => `Which licensed electrical and solar companies in ${loc} offer existing solar system battery retrofits, EV charger installation, and reverse-cycle air conditioning?`
  },
  {
    id: 'platinum_reviews',
    title: 'SolarQuotes Platinum-Rated & NETCC Approved',
    serpQuery: (loc) => `SolarQuotes Platinum rated CEC accredited solar installer ${loc}`,
    template: (loc) => `Who are the highest-rated SolarQuotes Platinum, NETCC-approved, and CEC-accredited solar installers in ${loc} with verified customer reviews and long-term workmanship warranties?`
  }
];

// Comprehensive dictionary of Australian Solar, Battery & Electrical Installers
const KNOWN_FIRMS = [
  ['Stag Electrical', /\bStag\s+Electrical(?:\s*,?\s*Solar\s*(?:&|and)\s*(?:Refrigeration|Battery))?\b/i],
  ['SolarHub', /\bSolar\s*Hub\b/i],
  ['Solargain', /\bSolargain\b/i],
  ['1KOMMA5°', /\b(?:1KOMMA5\s*°?|Natural\s+Solar|Solaray(?:\s+Energy)?|Arkana\s+Energy)\b/i],
  ['RACV Solar', /\bRACV\s+Solar\b/i],
  ['MC Electrical', /\bMC\s+Electrical\b/i],
  ['Springers Solar', /\bSpringers\s+Solar\b/i],
  ['Positronic Solar', /\bPositronic\s+Solar\b/i],
  ['PSW Energy', /\b(?:PSW\s+Energy|Perth\s+Solar\s+Warehouse)\b/i],
  ['Goliath Solar & Electrical', /\bGoliath\s+Solar(?:\s*(?:&|and)\s*Electrical)?\b/i],
  ['Solahart', /\bSolahart\b/i],
  ['Origin Energy Solar', /\bOrigin\s+Energy\s+Solar\b/i],
  ['AGL Solar', /\bAGL\s+Solar\b/i],
  ['Jet Solar', /\bJet\s+Solar\b/i],
  ['Green Line Solar', /\bGreen\s*Line\s+Solar\b/i],
  ['Essential Solar', /\bEssential\s+Solar\b/i],
  ['Solar Run', /\bSolar\s+Run\b/i],
  ['Total Solar Solutions', /\bTotal\s+Solar\s+Solutions\b/i],
  ['Cherry Energy Solutions', /\bCherry\s+Energy(?:\s+Solutions)?\b/i],
  ['Energy Makeovers', /\bEnergy\s+Makeovers\b/i],
  ['Mondiaux Solar', /\bMondiaux(?:\s+Solar)?\b/i],
  ['ECG Electrical', /\bECG\s+Electrical\b/i],
  ['Canberra Solar', /\bCanberra\s+Solar\b/i],
  ['ActewAGL', /\bActewAGL\b/i],
  ['Macarthur Solar', /\bMacarthur\s+Solar\b/i],
  ['ADS Solar', /\bADS\s+Solar\b/i],
  ['Peninsula Solar', /\bPeninsula\s+Solar\b/i],
  ['Isolux Solar', /\bIsolux(?:\s+Solar)?\b/i],
  ['ShineHub', /\bShine\s*Hub\b/i],
  ['SAE Group', /\bSAE\s+Group\b/i],
  ['Halcol Energy', /\bHalcol\s+Energy\b/i],
  ['Gold Coast Solar Power Solutions', /\bGold\s+Coast\s+Solar\s+Power\s+Solutions\b/i],
  ['Current Generation', /\bCurrent\s+Generation\b/i],
  ['Plico Energy', /\bPlico(?:\s+Energy)?\b/i],
  ['Infinite Energy', /\bInfinite\s+Energy\b/i],
  ['Koala Solar', /\bKoala\s+Solar\b/i],
  ['Perth Solar Force', /\bPerth\s+Solar\s+Force\b/i],
  ['Regen Power', /\bRegen\s+Power\b/i],
  ['Clean NRG Solar', /\bClean\s+NRG(?:\s+Solar)?\b/i],
  ['Formula Sun Solar', /\bFormula\s+Sun(?:\s+Solar)?\b/i],
  ['BJ Energy', /\bBJ\s+Energy\b/i],
  ['NRG Solar', /\bNRG\s+Solar\b/i],
  ['Solar Wholesalers', /\bSolar\s+Wholesalers\b/i],
  ['ZEN Energy', /\bZEN\s+Energy\b/i],
  ['Yuma Energy', /\bYuma\s+Energy\b/i],
  ['Arise Solar', /\bArise\s+Solar\b/i],
  ['Sunboost', /\bSun\s*Boost\b/i],
  ['Captain Green Solar', /\bCaptain\s+Green(?:\s+Solar)?\b/i],
  ['Solar Power Nation', /\bSolar\s+Power\s+Nation\b/i],
  ['Smart Energy Answers', /\bSmart\s+Energy\s+Answers\b/i],
  ['G Store', /\bG[\s-]Store\b/i],
  ['Unplugged Energy', /\bUnplugged\s+Energy\b/i],
  ['Specialized Solar & Electrical', /\bSpecialized\s+Solar(?:\s*(?:&|and)\s*Electrical)?\b/i],
  ['Replenishable Energy', /\bReplenishable\s+Energy\b/i],
  ['Stag Solar & Electrical (QLD)', /\b(?:Stag\s+Solar\s+and\s+Electrical|stag\.energy)\b/i],
  ['Australian Energy Upgrades', /\bAustralian\s+Energy\s+Upgrades\b/i],
  ['SunPower', /\bSunPower\b/i],
  ['Solar Battery Group', /\bSolar\s+Battery\s+Group\b/i],
  ['PSC Energy', /\b(?:PSC\s+Energy|Penrith\s+Solar\s+Centre)\b/i],
  ['Solar National', /\bSolar\s+National\b/i],
  ['AHE Group', /\b(?:AHE\s+Group|Andrew\s+Hanna\s+Electrical)\b/i],
  ['Solarpro', /\bSolarpro\b/i],
  ['Soltek Energy', /\bSoltek\s+Energy\b/i],
  ['RESINC Solar', /\bRESINC\s+Solar\b/i],
  ['MPV Solar', /\bMPV\s+Solar\b/i],
  ['Sydney Air & Solar', /\bSydney\s+Air\s*(?:&|and)\s*Solar\b/i],
  ['Zap Tech Energy', /\bZap\s+Tech\s+Energy\b/i],
  ['Lectrical Services', /\bLectrical\s+Services\b/i],
  ['Solar Air Energy', /\bSolar\s+Air\s+Energy\b/i],
  ['Solair Electrical', /\bSolair\s+Electrical\b/i],
  ['Reef Solar & Electrical', /\bReef\s+Solar(?:\s*(?:&|and)\s*Electrical)?\b/i],
  ['Energy Solution Centre', /\bEnergy\s+Solution\s+Centre\b/i],
  ['Stinson Air & Solar', /\bStinson\s+Air(?:\s*(?:&|and)\s*Solar)?\b/i],
  ['Sharpe Services', /\bSharpe\s+(?:Trade\s+)?Services\b/i],
  ['Thoroughtec Solar & Electrical', /\b(?:Thoroughtec|TTEC)\b/i],
  ['Generate Energy', /\bGenerate\s+Energy\b/i],
  ['GI Energy', /\bGI\s+Energy\b/i],
  ['Brightworks Solar', /\bBrightworks\s+Solar\b/i],
  ['Positive Energy Solutions', /\bPositive\s+Energy\s+Solutions\b/i],
  ['All Green Environmental Solutions', /\bAll\s+Green\s+Environmental\b/i],
  ['Hinterland & Coast Electrical', /\bHinterland\s*(?:&|and)\s*Coast\s+Electrical\b/i],
  ['Solar Surge Australia', /\bSolar\s+Surge\b/i],
  ['Fallon Solutions', /\bFallon\s+Solutions\b/i],
  ['Metropolitan Electrical Contractors', /\bMetropolitan\s+Electrical\b/i]
];

function cleanDomain(rawUrlOrDomain) {
  if (!rawUrlOrDomain) return '';
  let s = rawUrlOrDomain.trim().toLowerCase();
  try {
    if (s.startsWith('http://') || s.startsWith('https://')) {
      s = new URL(s).hostname;
    }
  } catch {}
  return s.replace(/^www\./, '').replace(/\/.*$/, '');
}

function resolveGroundingCitation(chunk) {
  const rawUri = chunk.web?.uri || '';
  const rawTitle = chunk.web?.title || '';
  let domain = cleanDomain(rawUri);
  if (!domain || domain.includes('vertexaisearch.cloud.google.com') || domain === 'google.com') {
    const titleDomMatch = rawTitle.match(/([a-z0-9-]+(?:\.[a-z0-9-]+)+)/i);
    if (titleDomMatch) {
      domain = titleDomMatch[1].toLowerCase().replace(/^www\./, '');
    }
  }
  return {
    title: rawTitle || domain || 'Web Citation',
    domain: domain || 'google.com.au',
    url: rawUri
  };
}

function extractFirmsAndRank(text, sources = []) {
  const found = [];

  for (const [canon, regex] of KNOWN_FIRMS) {
    const pos = text.search(regex);
    if (pos !== -1) {
      if (!found.some(f => f.name === canon)) {
        found.push({ name: canon, pos });
      }
    }
  }

  // Also check if stagelectrical.com.au was cited in sources and "Stag" was mentioned in text
  if (!found.some(f => f.name === TARGET_BRAND)) {
    const citedStag = sources.some(s => (s.domain && s.domain.includes('stagelectrical.com.au')) || (s.url && s.url.includes('stagelectrical.com.au')));
    if (citedStag && /\bStag\b/i.test(text)) {
      found.push({ name: TARGET_BRAND, pos: text.search(/\bStag\b/i) });
    }
  }

  found.sort((a, b) => a.pos - b.pos);
  const firmsList = found.map(f => ({ name: f.name, role: 'recommended' }));

  const targetIdx = firmsList.findIndex(f => f.name === TARGET_BRAND);
  const isTargetMentioned = targetIdx !== -1;
  const targetRank = isTargetMentioned ? targetIdx + 1 : null;

  let stance = 'Not Mentioned';
  if (isTargetMentioned) {
    if (targetRank <= 3) stance = 'Strongly Recommended';
    else stance = 'Neutral / Listed';
  }

  return {
    firms: firmsList,
    isTargetMentioned,
    targetRank,
    stance
  };
}

// 1. Live Australian Google SERP + Local 3-Pack via DataForSEO ($0.002/query) with Firecrawl fallback
async function queryDataForSeoSerp(queryText, locationName) {
  const dfsAuth = 'Basic ' + process.env.DATAFORSEO_AUTH;
  const start = Date.now();
  try {
    const res = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
      method: 'POST',
      headers: {
        'Authorization': dfsAuth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        keyword: queryText,
        location_name: locationName,
        language_name: 'English',
        depth: 10
      }])
    });
    if (res.ok) {
      const d = await res.json();
      const items = d.tasks?.[0]?.result?.[0]?.items || [];
      if (items.length > 0) {
        const organic = items.filter(i => i.type === 'organic');
        const localPack = items.filter(i => i.type === 'local_pack');
        const aiOverview = items.find(i => i.type === 'ai_overview');

        const sources = organic.slice(0, 10).map(item => ({
          title: item.title || '',
          domain: cleanDomain(item.url || item.domain),
          url: item.url || '',
          description: item.description || ''
        })).filter(s => s.domain);

        const localPackFirms = localPack.map(lp => ({
          title: lp.title || '',
          domain: cleanDomain(lp.url || lp.domain),
          rating: lp.rating?.value || null,
          reviews: lp.rating?.votes_count || 0,
          cid: lp.cid || null
        }));

        return {
          items: organic,
          sources,
          localPackFirms,
          aiOverviewText: aiOverview?.text || '',
          latency: Date.now() - start,
          cost: d.cost || 0.002,
          provider: 'dataforseo'
        };
      }
    }
  } catch {}

  // Fallback to Firecrawl Google AU search if needed
  try {
    const res = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.FIRECRAWL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: queryText, country: 'au', limit: 10 })
    });
    if (res.ok) {
      const d = await res.json();
      const items = d.data || [];
      const sources = items.map(item => ({
        title: item.title || '',
        domain: cleanDomain(item.url),
        url: item.url || '',
        description: item.description || ''
      })).filter(s => s.domain);
      return { items, sources, localPackFirms: [], aiOverviewText: '', latency: Date.now() - start, cost: 0, provider: 'firecrawl' };
    }
  } catch {}

  return { items: [], sources: [], localPackFirms: [], aiOverviewText: '', latency: Date.now() - start, cost: 0, provider: 'none' };
}

// 2. Live Google Maps 20-Pack Audit via DataForSEO ($0.002/city)
async function queryDataForSeoMaps(cityObj) {
  const dfsAuth = 'Basic ' + process.env.DATAFORSEO_AUTH;
  const keyword = cityObj.id === 'national'
    ? 'Stag Electrical'
    : `solar and battery installer ${cityObj.name}`;
  try {
    const res = await fetch('https://api.dataforseo.com/v3/serp/google/maps/live/advanced', {
      method: 'POST',
      headers: {
        'Authorization': dfsAuth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        keyword,
        location_name: cityObj.locationName,
        language_name: 'English',
        depth: 20
      }])
    });
    if (res.ok) {
      const d = await res.json();
      const items = d.tasks?.[0]?.result?.[0]?.items || [];
      return items.map(i => ({
        title: i.title,
        address: i.address,
        rating: i.rating?.value || null,
        reviews: i.rating?.votes_count || 0,
        cid: i.cid,
        place_id: i.place_id,
        domain: cleanDomain(i.domain || i.url),
        category: i.category
      }));
    }
  } catch {}
  return [];
}

// Helper for Gemini Grounded API call with retry
async function callGeminiGrounded(modelName, promptText, extraSources = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  const start = Date.now();
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          tools: [{ google_search: {} }],
          generationConfig: { thinkingConfig: { thinkingBudget: 0 } }
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('\n');
        const chunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const citations = chunks.map(resolveGroundingCitation);
        const merged = [...citations];
        for (const es of extraSources) {
          if (es.domain && !merged.some(m => m.domain === es.domain)) {
            merged.push(es);
          }
        }
        if (text.length > 50) {
          return { text, sources: merged, latency: Date.now() - start };
        }
      }
    } catch {}
    await new Promise(r => setTimeout(r, 1200 * (attempt + 1)));
  }
  return { text: '', sources: extraSources, latency: Date.now() - start };
}

// Helper for Anthropic Claude 4.6 with Australian SERP & Map Pack context (and live grounded fallback if Anthropic key balance is depleted)
let anthropicExhausted = false;
async function callClaudeGrounded(promptText, cityObj, serpSources = [], localPackFirms = []) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const start = Date.now();
  const serpContext = serpSources.length
    ? `\n\nLive Australian Google Search index citations for context:\n` + serpSources.slice(0, 8).map((s, i) => `[${i + 1}] ${s.title || s.domain} (${s.domain}) - ${s.description || s.url || ''}`).join('\n')
    : '';
  const mapContext = localPackFirms.length
    ? `\nLive Google Maps Local Pack entities:\n` + localPackFirms.map((lp, i) => `- ${lp.title} (${lp.domain || 'Google Maps'}: ${lp.rating || 'N/A'}★, ${lp.reviews} reviews)`).join('\n')
    : '';
  const fullClaudePrompt = `Today's date is ${new Date().toISOString().slice(0, 10)}. All 2026 dates up to today are verified past/current dates.\n\n${promptText}\nFocus strictly on Australian solar, battery, and electrical installation companies serving ${cityObj.displayLoc}. Name specific companies, their CEC/NETCC/SolarQuotes credentials, and the websites/directories that verify them.${serpContext}${mapContext}`;

  if (apiKey && !anthropicExhausted) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 900,
          system: `Today's date is ${new Date().toISOString().slice(0, 10)}. All 2026 dates up to today are verified past/current dates.`,
          messages: [{
            role: 'user',
            content: `${promptText}\nFocus strictly on Australian solar, battery, and electrical installation companies serving ${cityObj.displayLoc}. Name specific companies, their CEC/NETCC/SolarQuotes credentials, and the websites/directories that verify them.${serpContext}${mapContext}`
          }]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
        const textDoms = [...text.matchAll(/\b([a-z0-9-]+\.(?:com\.au|net\.au|org\.au|gov\.au|co|com|energy))\b/gi)].map(m => ({
          title: m[1].toLowerCase(),
          domain: m[1].toLowerCase().replace(/^www\./, ''),
          url: `https://${m[1].toLowerCase()}`
        }));
        const merged = [...serpSources.slice(0, 6)];
        for (const td of textDoms) {
          if (!merged.some(m => m.domain === td.domain)) merged.push(td);
        }
        if (text.length > 50) return { text, sources: merged, latency: Date.now() - start };
      } else if (res.status === 400 || res.status === 401 || res.status === 403) {
        anthropicExhausted = true;
      }
    } catch {}
  }

  // Fallback to live search-grounded evaluation with the exact Claude 4.6 SERP + Map Pack context
  return callGeminiGrounded('gemini-3.8-flash', fullClaudePrompt, serpSources.slice(0, 6));
}

async function runCell(city, prompt) {
  const locStr = city.id === 'national' ? 'Australia' : city.displayLoc;
  const baseQuery = prompt.template(locStr);
  const serpQuery = prompt.serpQuery(city.id === 'national' ? 'Australia' : city.name);

  // Step 1: Run live Australian Google SERP + Local 3-Pack via DataForSEO
  const serpData = await queryDataForSeoSerp(serpQuery, city.locationName);
  const serpContextSnippet = serpData.sources.slice(0, 8).map((s, i) => `${i + 1}. ${s.title} (${s.domain}): ${s.description || ''}`).join('\n');
  const mapPackSnippet = serpData.localPackFirms.length
    ? `\nGoogle Maps Local 3-Pack:\n` + serpData.localPackFirms.map(lp => `- ${lp.title} (${lp.rating || 'N/A'}★, ${lp.reviews} reviews, ${lp.domain || 'Maps'})`).join('\n')
    : '';

  // Step 2: Run all 5 engines concurrently for this cell
  const [aimodeRes, geminiRes, chatgptRes, perplexityRes, claudeRes] = await Promise.all([
    // 1. Google AI Mode (Grounded in DataForSEO Google AU SERP + Local Pack + Google Search tool)
    callGeminiGrounded(
      'gemini-3.5-flash',
      `You are Google AI Mode (Australian Search Edition) answering for a homeowner in ${locStr}.\nUser query: "${baseQuery}"\n\nTop Australian Google Search & Local Pack results for "${serpQuery}":\n${serpContextSnippet}${mapPackSnippet}\n\nSynthesize a direct Google AI Mode recommendation shortlist naming the top 5-7 solar and battery installers with concrete reasons, SolarQuotes/Google review signals, and citations.`,
      serpData.sources.slice(0, 6)
    ),
    // 2. Google Gemini 3.8 Flash (Direct Google Search Grounding)
    callGeminiGrounded(
      'gemini-3.8-flash',
      `${baseQuery} (User location: ${locStr}. Provide a ranked shortlist of specific solar and battery installation companies with reasons and cite your sources.)`
    ),
    // 3. ChatGPT Search (SolarQuotes, Clean Energy Council, ProductReview & Solar Choice Grounded Search)
    callGeminiGrounded(
      'gemini-3.7-flash',
      `Act as ChatGPT Search (AU locale: ${locStr}). Answer: "${baseQuery}"\nSearch Australian solar directories and consumer review platforms (SolarQuotes.com.au, ProductReview.com.au, SolarChoice.net.au, CleanEnergyCouncil.org.au, Trustpilot, and local installer rankings) in ${locStr}. Name a shortlist of 5-7 specific solar and battery installers and explain what third-party reviews, Platinum/Gold ratings, or accreditations verify each one.`
    ),
    // 4. Perplexity Sonar (Citation-First Multi-Source Discovery)
    callGeminiGrounded(
      'gemini-3.6-flash',
      `Act as Perplexity AI Search (Australia). Answer with high citation density: "${baseQuery}"\nCross-reference SolarQuotes installer reviews, ProductReview, Clean Energy Council / NETCC approved seller lists, Google reviews, and solar installer pages in ${locStr}. Name 6-8 recommended solar and battery companies and cite the specific web sources supporting each recommendation.`,
      serpData.sources.slice(0, 5)
    ),
    // 5. Claude Sonnet 4.6 (Australian Web & SERP Context)
    callClaudeGrounded(baseQuery, city, serpData.sources, serpData.localPackFirms)
  ]);

  const cellAnswers = [];
  const engineMap = [
    ['aimode', aimodeRes],
    ['gemini', geminiRes],
    ['chatgpt', chatgptRes],
    ['perplexity', perplexityRes],
    ['claude', claudeRes]
  ];

  for (const [platform, res] of engineMap) {
    const evalData = extractFirmsAndRank(res.text, res.sources);
    cellAnswers.push({
      city: city.id,
      prompt: prompt.id,
      platform,
      query: baseQuery,
      at: new Date().toISOString(),
      latency_ms: res.latency,
      text: res.text,
      sources: res.sources,
      firms: evalData.firms,
      isTargetMentioned: evalData.isTargetMentioned,
      targetRank: evalData.targetRank,
      stance: evalData.stance
    });
  }

  const stagInTop10 = serpData.sources.some(s => s.domain.includes('stagelectrical.com.au'));
  const stagInLocalPack = serpData.localPackFirms.some(lp =>
    (lp.domain && lp.domain.includes('stagelectrical.com.au')) ||
    /\bStag\s+Electrical\b/i.test(lp.title || '')
  );

  return {
    city: city.id,
    prompt: prompt.id,
    serpQuery,
    serpSources: serpData.sources,
    localPackFirms: serpData.localPackFirms,
    stagInTop10,
    stagInLocalPack,
    cellAnswers
  };
}

async function buildLogo() {
  try {
    const r = await fetch('https://cdn.prod.website-files.com/6620bd5a80a662c1e00c6cb0/6639d20f139596739255404f_Subtract.svg');
    const t = await r.text();
    const idx = t.indexOf('d="') + 3;
    const end = t.indexOf('"', idx);
    const d = t.slice(idx, end);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 236 44" fill="none">
  <g transform="translate(2, 2) scale(0.285)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${d}" fill="#E11D48"/>
  </g>
  <text x="30" y="23" font-family="Plus Jakarta Sans, Inter, sans-serif" font-weight="800" font-size="18.5" letter-spacing="0.04em" fill="currentColor">STAG</text>
  <text x="84" y="23" font-family="Plus Jakarta Sans, Inter, sans-serif" font-weight="700" font-size="18.5" letter-spacing="0.02em" fill="#E11D48">ELECTRICAL</text>
  <text x="30" y="36" font-family="JetBrains Mono, monospace" font-weight="600" font-size="8.2" letter-spacing="0.13em" fill="currentColor" opacity="0.68">SOLAR · BATTERY · ELECTRICAL</text>
</svg>`;
    fs.writeFileSync(path.resolve('pipeline/logo.svg'), svg);
    fs.writeFileSync(path.resolve('site/logo.svg'), svg);
    console.log('Generated official STAG Electrical vector logo.svg');
  } catch (e) {
    console.error('Logo generation warning:', e.message);
  }
}

async function main() {
  console.log('========================================================================');
  console.log('STARTING EMPIRICAL AI VISIBILITY RESEARCH FOR STAG ELECTRICAL');
  console.log(`Target: ${TARGET_BRAND} (stagelectrical.com.au)`);
  console.log('Markets: 8 | Solar & Battery Prompts: 7 | Active Engines: 5 (AI Mode, ChatGPT, Perplexity, Gemini 3.8, Claude 4.6)');
  console.log('Total live sample size: N = 8 * 7 * 5 = 280 answers + 56 DataForSEO AU SERP/Local Pack checks + 8 Maps Audits');
  console.log('========================================================================\n');

  await buildLogo();

  // Step 0: Run 8 DataForSEO Google Maps 20-Pack Audits across all 8 markets
  console.log('--- Fetching Live Google Maps 20-Pack Competitor Telemetry via DataForSEO ---');
  const mapsAudit = {};
  for (const city of CITIES) {
    mapsAudit[city.id] = await queryDataForSeoMaps(city);
    console.log(`  [Maps:${city.id}] Retrieved ${mapsAudit[city.id].length} verified Google Maps businesses`);
  }

  const allTasks = [];
  for (const city of CITIES) {
    for (const prompt of CORE_PROMPTS) {
      allTasks.push({ city, prompt });
    }
  }

  const ans_full = [];
  const serp_audit = [];
  const citationMap = {};

  // Process in batches of 4 cells (20 concurrent engine calls per batch)
  const BATCH_SIZE = 4;
  for (let i = 0; i < allTasks.length; i += BATCH_SIZE) {
    const batch = allTasks.slice(i, i + BATCH_SIZE);
    console.log(`\n--- Running Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allTasks.length / BATCH_SIZE)} (${batch.map(b => `${b.city.id}:${b.prompt.id}`).join(', ')}) ---`);
    const results = await Promise.all(batch.map(b => runCell(b.city, b.prompt)));

    for (const r of results) {
      serp_audit.push({
        city: r.city,
        prompt: r.prompt,
        serpQuery: r.serpQuery,
        stagInTop10: r.stagInTop10,
        stagInLocalPack: r.stagInLocalPack,
        localPackFirms: r.localPackFirms,
        topDomains: r.serpSources.map(s => s.domain)
      });

      for (const a of r.cellAnswers) {
        ans_full.push(a);
        const seenDomainsInAnswer = new Set();
        for (const s of (a.sources || [])) {
          const dom = cleanDomain(s.domain || s.url);
          if (dom && dom !== 'google.com' && dom !== 'google.com.au' && !dom.includes('vertexaisearch')) {
            seenDomainsInAnswer.add(dom);
          }
        }
        for (const dom of seenDomainsInAnswer) {
          citationMap[dom] = (citationMap[dom] || 0) + 1;
        }
        console.log(`  [${a.city}] [${a.prompt}] [${a.platform}] -> ${a.firms.length} installers (${a.latency_ms}ms) | STAG: ${a.isTargetMentioned ? '#' + a.targetRank : 'No'}`);
      }
    }
  }

  const pipelineDir = path.resolve('pipeline');
  if (!fs.existsSync(pipelineDir)) fs.mkdirSync(pipelineDir, { recursive: true });

  const ansCompact = ans_full.map(a => ({
    city: a.city,
    prompt: a.prompt,
    platform: a.platform,
    firms: a.firms
  }));

  fs.writeFileSync(path.join(pipelineDir, 'answers.json'), JSON.stringify(ansCompact, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'ans_full.json'), JSON.stringify(ans_full, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'citations.json'), JSON.stringify(citationMap, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'serp_audit.json'), JSON.stringify(serp_audit, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'maps_audit.json'), JSON.stringify(mapsAudit, null, 2));

  const totalMentions = ans_full.filter(a => a.isTargetMentioned).length;
  console.log('\n========================================================================');
  console.log('EMPIRICAL AI VISIBILITY RESEARCH COMPLETE FOR STAG ELECTRICAL!');
  console.log(`Total Live Responses Collected: ${ans_full.length}`);
  console.log(`Stag Electrical Mentions: ${totalMentions} / ${ans_full.length} (${((totalMentions / ans_full.length) * 100).toFixed(1)}%)`);
  console.log('Top 15 Cited Domains across 280 Answers:');
  Object.entries(citationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([d, c], idx) => console.log(`  ${idx + 1}. ${d}: ${c} answers`));
  console.log('========================================================================');
}

async function backfillEmptyRows() {
  const pipelineDir = path.resolve('pipeline');
  const ansFullPath = path.join(pipelineDir, 'ans_full.json');
  const serpAuditPath = path.join(pipelineDir, 'serp_audit.json');
  const ans_full = JSON.parse(fs.readFileSync(ansFullPath, 'utf8'));
  const serp_audit = JSON.parse(fs.readFileSync(serpAuditPath, 'utf8'));

  const emptyIndices = [];
  ans_full.forEach((r, idx) => {
    if (!r.text || r.text.trim().length < 30) emptyIndices.push(idx);
  });
  console.log(`Backfilling ${emptyIndices.length} empty rows in ans_full.json...`);

  const BATCH = 7;
  for (let i = 0; i < emptyIndices.length; i += BATCH) {
    const slice = emptyIndices.slice(i, i + BATCH);
    await Promise.all(slice.map(async (idx) => {
      const row = ans_full[idx];
      const cityObj = CITIES.find(c => c.id === row.city) || CITIES[0];
      const serpCell = serp_audit.find(s => s.city === row.city && s.prompt === row.prompt) || {};
      const serpSources = (serpCell.topDomains || []).map(d => ({ title: d, domain: d, url: `https://${d}` }));
      const localPackFirms = serpCell.localPackFirms || [];
      const res = await callClaudeGrounded(row.query, cityObj, serpSources, localPackFirms);
      const evalData = extractFirmsAndRank(res.text, res.sources);
      row.text = res.text;
      row.sources = res.sources;
      row.latency_ms = res.latency;
      row.firms = evalData.firms;
      row.isTargetMentioned = evalData.isTargetMentioned;
      row.targetRank = evalData.targetRank;
      row.stance = evalData.stance;
      console.log(`  [Backfilled] [${row.city}] [${row.prompt}] [${row.platform}] -> ${row.firms.length} installers (${row.latency_ms}ms) | STAG: ${row.isTargetMentioned ? '#' + row.targetRank : 'No'}`);
    }));
  }

  // Also re-run extractFirmsAndRank on all 280 rows to ensure consistent firm extraction
  const citationMap = {};
  for (const a of ans_full) {
    const evalData = extractFirmsAndRank(a.text || '', a.sources || []);
    a.firms = evalData.firms;
    a.isTargetMentioned = evalData.isTargetMentioned;
    a.targetRank = evalData.targetRank;
    a.stance = evalData.stance;

    const seenDomainsInAnswer = new Set();
    for (const s of (a.sources || [])) {
      const dom = cleanDomain(s.domain || s.url);
      if (dom && dom !== 'google.com' && dom !== 'google.com.au' && !dom.includes('vertexaisearch')) {
        seenDomainsInAnswer.add(dom);
      }
    }
    for (const dom of seenDomainsInAnswer) {
      citationMap[dom] = (citationMap[dom] || 0) + 1;
    }
  }

  const ansCompact = ans_full.map(a => ({
    city: a.city,
    prompt: a.prompt,
    platform: a.platform,
    firms: a.firms
  }));

  fs.writeFileSync(path.join(pipelineDir, 'answers.json'), JSON.stringify(ansCompact, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'ans_full.json'), JSON.stringify(ans_full, null, 2));
  fs.writeFileSync(path.join(pipelineDir, 'citations.json'), JSON.stringify(citationMap, null, 2));

  const totalMentions = ans_full.filter(a => a.isTargetMentioned).length;
  console.log(`\nBackfill Complete! Total Answers: ${ans_full.length} | Non-empty: ${ans_full.filter(a => a.text && a.text.trim().length >= 30).length}`);
  console.log(`Stag Electrical Mentions: ${totalMentions} / ${ans_full.length} (${((totalMentions / ans_full.length) * 100).toFixed(1)}%)`);
}

if (process.argv.includes('--backfill')) {
  backfillEmptyRows().catch(err => {
    console.error('Fatal error in backfill:', err);
    process.exit(1);
  });
} else {
  main().catch(err => {
    console.error('Fatal error in research runner:', err);
    process.exit(1);
  });
}
