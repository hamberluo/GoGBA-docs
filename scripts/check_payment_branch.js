// The gateway hands back two non-interchangeable things: `url_qrcode` is an
// image for a second device to scan, `url` a cashier page that opens WeChat
// itself. Showing the image on a phone asks the buyer to scan a code with the
// screen displaying it — which is what shipped, and what support reported.
//
// The second check is the same shape: on a phone the cashier replaces the
// page, so the gateway sends the buyer back with the order in the query and
// the page has to pick it up — or a paid buyer arrives at a blank buy page.
//
// Syntax checks cannot see either: the page was valid JavaScript throughout.
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../premium.html', import.meta.url), 'utf8');
const source = html.match(/function showPayment\(order\) \{[\s\S]*?\n {16}\}/);

if (!source) {
  console.error('✗ premium.html: showPayment not found — this branch check is broken');
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
  expect(`${label} should navigate to url`, navigated === ORDER.paymentUrl);
  expect(`${label} should not render a QR code`, elements['.pay-qr'].src === '');
  expect(`${label} fallback link should point at url`, elements['.pay-open'].href === ORDER.paymentUrl);
}

const desktop = run(DESKTOP, ORDER);
expect('desktop should render url_qrcode', desktop.elements['.pay-qr'].src === ORDER.qrcodeUrl);
expect('desktop should not navigate', desktop.navigated === '');

const withoutUrl = run(PHONES.iPhone, { paymentUrl: '', qrcodeUrl: ORDER.qrcodeUrl });
expect('phone without url should fall back to the QR code', withoutUrl.elements['.pay-qr'].src === ORDER.qrcodeUrl);

const pendingSource = html.match(/function pendingOrder\(search, store\) \{[\s\S]*?\n {12}\}/);
if (!pendingSource) {
  console.error('✗ premium.html: pendingOrder not found — this resume check is broken');
  process.exit(1);
}
const pendingOrder = new Function('PENDING_KEY', `${pendingSource[0]}\nreturn pendingOrder;`)('k');
const storage = (saved) => ({ getItem: () => saved });
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

expect('the query names the order to resume',
  same(pendingOrder('?order=A1&sku=premium', storage(null)), { orderNo: 'A1', sku: 'premium' }));
expect('storage is the fallback on a plain reload',
  same(pendingOrder('', storage('{"orderNo":"B2","sku":"toolkit"}')), { orderNo: 'B2', sku: 'toolkit' }));
expect('the query wins over storage',
  same(pendingOrder('?order=A1&sku=premium', storage('{"orderNo":"B2","sku":"toolkit"}')), { orderNo: 'A1', sku: 'premium' }));
expect('nothing pending resumes nothing', pendingOrder('', storage(null)) === null);
expect('no storage at all resumes nothing', pendingOrder('', null) === null);
expect('corrupt storage resumes nothing', pendingOrder('', storage('{not json')) === null);

if (failures.length) {
  console.error('✗ payment branch failures:');
  for (const f of failures) console.error(`    ${f}`);
  process.exit(1);
}
console.log('✓ payment branch (phone → cashier, desktop → QR; resume from query or storage)');
