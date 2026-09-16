// Every language dictionary must carry the same keys.
//
// A missing key throws nothing: it silently falls back to English, or renders
// blank — visible only by switching to that language and opening that page.
const fs = require('fs');

const src = fs.readFileSync('js/i18n.js', 'utf8');

// Match the dictionaries themselves, so ordinary strings in the code
// are not mistaken for keys.
const dicts = {};
for (const m of src.matchAll(/'([a-z]{2}(?:-[A-Za-z]+)?)':\s*\{([\s\S]*?)\n        \}/g)) {
  dicts[m[1]] = new Set([...m[2].matchAll(/^\s*'([^']+)':/gm)].map((k) => k[1]));
}

const langs = Object.keys(dicts);
if (langs.length < 2) {
  console.error(`✗ i18n.js: parsed only ${langs.length} dictionaries — this check itself is broken`);
  process.exit(1);
}

const [base, ...rest] = langs;
let bad = false;
for (const lang of rest) {
  const missing = [...dicts[base]].filter((k) => !dicts[lang].has(k));
  const extra = [...dicts[lang]].filter((k) => !dicts[base].has(k));
  if (missing.length) {
    console.error(`✗ i18n.js ${lang} missing keys: ${missing.slice(0, 5).join(', ')}`);
    bad = true;
  }
  if (extra.length) {
    console.error(`✗ i18n.js ${lang} extra keys: ${extra.slice(0, 5).join(', ')}`);
    bad = true;
  }
}
process.exit(bad ? 1 : 0);
