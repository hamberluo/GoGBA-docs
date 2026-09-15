// 两套语言字典的 key 必须一一对应。
//
// 少一个 key 不会报任何错，只会在那个语言下落回英文或显示空白 —— 而这只有
// 切到该语言、打开那个页面才看得见。
const fs = require('fs');

const src = fs.readFileSync('js/i18n.js', 'utf8');

// 只匹配字典本体，避免把代码里的普通字符串当成 key。
const dicts = {};
for (const m of src.matchAll(/'([a-z]{2}(?:-[A-Za-z]+)?)':\s*\{([\s\S]*?)\n        \}/g)) {
  dicts[m[1]] = new Set([...m[2].matchAll(/^\s*'([^']+)':/gm)].map((k) => k[1]));
}

const langs = Object.keys(dicts);
if (langs.length < 2) {
  console.error(`✗ i18n.js 只解析出 ${langs.length} 个字典，检查本身失效了`);
  process.exit(1);
}

const [base, ...rest] = langs;
let bad = false;
for (const lang of rest) {
  const missing = [...dicts[base]].filter((k) => !dicts[lang].has(k));
  const extra = [...dicts[lang]].filter((k) => !dicts[base].has(k));
  if (missing.length) {
    console.error(`✗ i18n.js ${lang} 缺少 key: ${missing.slice(0, 5).join(', ')}`);
    bad = true;
  }
  if (extra.length) {
    console.error(`✗ i18n.js ${lang} 多出 key: ${extra.slice(0, 5).join(', ')}`);
    bad = true;
  }
}
process.exit(bad ? 1 : 0);
