// The gateway hands back two non-interchangeable things: `url_qrcode` is an
// image for a second device to scan, `url` a cashier page that opens WeChat
// itself. Showing the image on a phone asks the buyer to scan a code with the
// screen displaying it — which is what shipped, and what support reported.
//
// Syntax checks cannot see this: the page was valid JavaScript throughout.
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../premium.html', import.meta.url), 'utf8');
const source = html.match(/function showPayment\(order\) \{[\s\S]*?\n {16}\}/);

if (!source) {
  console.error('✗ premium.html 里找不到 showPayment —— 支付分支检查已失效');
  process.exit(1);
}

function run(userAgent, order) {
  const elements = {
    '.pay-open': { href: '' },
    '.pay-mobile': { hidden: true },
    '.qr-wrap': { hidden: false },
    '.qr-steps': { hidden: false },
    '.pay-qr': { src: '' },
  };
  const window = { location: { href: '' } };
  const showPayment = new Function(
    'card',
    'navigator',
    'window',
    `${source[0]}\nreturn showPayment;`,
  )({ querySelector: (s) => elements[s] }, { userAgent }, window);
  showPayment(order);
  return { elements, navigated: window.location.href };
}

const ORDER = { paymentUrl: 'https://pay.example/cashier', qrcodeUrl: 'https://qr.example/a.png' };
const PHONES = {
  iPhone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
  Android: 'Mozilla/5.0 (Linux; Android 14; SM-S9310) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36',
};
const DESKTOP = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36';

const failures = [];
const expect = (name, ok) => { if (!ok) failures.push(name); };

for (const [label, ua] of Object.entries(PHONES)) {
  const { elements, navigated } = run(ua, ORDER);
  expect(`${label} 应跳转 url`, navigated === ORDER.paymentUrl);
  expect(`${label} 不应展示二维码`, elements['.pay-qr'].src === '');
  expect(`${label} 兜底链接应指向 url`, elements['.pay-open'].href === ORDER.paymentUrl);
}

const desktop = run(DESKTOP, ORDER);
expect('桌面应展示 url_qrcode', desktop.elements['.pay-qr'].src === ORDER.qrcodeUrl);
expect('桌面不应跳转', desktop.navigated === '');

const withoutUrl = run(PHONES.iPhone, { paymentUrl: '', qrcodeUrl: ORDER.qrcodeUrl });
expect('手机端缺 url 应回退二维码', withoutUrl.elements['.pay-qr'].src === ORDER.qrcodeUrl);

if (failures.length) {
  console.error('✗ 支付分支错误:');
  for (const f of failures) console.error(`    ${f}`);
  process.exit(1);
}
console.log('✓ 支付分支（手机跳转 / 桌面二维码）');
