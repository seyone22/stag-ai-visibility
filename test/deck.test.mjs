import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pipelineDir = path.join(rootDir, 'pipeline');
const siteDir = path.join(rootDir, 'site');

test('1. Empirical dataset ans_full.json has 280 complete non-empty answers', () => {
  const ans = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'ans_full.json'), 'utf8'));
  assert.equal(ans.length, 280, 'Expected exactly 280 answers');
  const empty = ans.filter(a => !a.text || a.text.trim().length < 30);
  assert.equal(empty.length, 0, `Expected 0 empty rows, found ${empty.length}`);
});

test('2. Metrics match empirical STAG Electrical counts', () => {
  const m = JSON.parse(fs.readFileSync(path.join(pipelineDir, 'metrics.json'), 'utf8'));
  assert.equal(m.national.answers, 280);
  assert.equal(m.national.lhdMentions, 19);
  assert.equal(m.cities.canberra.lhdMentions, 11);
  assert.equal(m.cities.canberra.answers, 35);
});

test('3. Client presentation site/index.html has exactly 30 slides and no NaN/undefined', () => {
  const html = fs.readFileSync(path.join(siteDir, 'index.html'), 'utf8');
  const slides = [...html.matchAll(/<section class="slide /g)];
  assert.equal(slides.length, 30, `Expected 30 slides in site/index.html, got ${slides.length}`);
  assert.equal(html.includes('undefined'), false, 'site/index.html must not contain undefined');
  assert.equal(html.includes('NaN'), false, 'site/index.html must not contain NaN');
  assert.equal(html.includes('+61XXXXXXXXX'), true, 'site/index.html should document the +61XXXXXXXXX schema bug');
  assert.equal(html.includes('solarquotes.com.au'), true, 'site/index.html should reference solarquotes.com.au');
});

test('4. Technical dossier site/technical.html has 13 slides including prompt architecture', () => {
  const html = fs.readFileSync(path.join(siteDir, 'technical.html'), 'utf8');
  const slides = [...html.matchAll(/<section id="tech-/g)];
  assert.equal(slides.length, 13, `Expected 13 slides in site/technical.html, got ${slides.length}`);
  assert.equal(html.includes('tech-03b-prompt-architecture'), true, 'site/technical.html must include tech-03b-prompt-architecture');
});

test('5. Master Raw Evidence Ledger exists and documents all 280 responses', () => {
  const ledgerPath = path.join(rootDir, 'STAG_ELECTRICAL_RAW_EVIDENCE_LEDGER.md');
  assert.equal(fs.existsSync(ledgerPath), true, 'STAG_ELECTRICAL_RAW_EVIDENCE_LEDGER.md must exist');
  const md = fs.readFileSync(ledgerPath, 'utf8');
  assert.equal(md.includes('[280 / 280]'), true, 'Ledger must contain all 280 verbatim responses');
});
