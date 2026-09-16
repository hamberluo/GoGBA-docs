#!/bin/bash
# Check the site's HTML and inline JS.
#
# Why this exists: premium.html's inline script was once left syntactically
# broken by an edit. The page looked fine and every button was dead — something
# only a click in a browser would have caught.

set -e

cd "$(dirname "${BASH_SOURCE[0]}")/.."

fail=0

# Standalone JS: a broken i18n.js shows up as the whole site untranslated.
for f in js/*.js; do
    [ -f "$f" ] || continue
    if ! node --check "$f" 2>/tmp/_err; then
        echo "✗ $f syntax error:"
        sed 's/^/    /' /tmp/_err | head -4
        fail=1
    fi
done

node scripts/check_i18n_keys.js || fail=1
node scripts/check_payment_branch.js || fail=1

for f in *.html; do
    # Hand inline <script> to node for real parsing, rather than counting braces.
    python3 - "$f" <<'PY' > /tmp/_inline.js
import sys, re
html = open(sys.argv[1], encoding='utf-8').read()
# Real JS only: src= is external, and ld+json and friends are data, not script.
blocks = [
    body for attrs, body in re.findall(r'<script([^>]*)>(.*?)</script>', html, re.S)
    if 'src=' not in attrs
    and not re.search(r'type\s*=\s*["\'][^"\']*json', attrs, re.I)
]
print('\n;\n'.join(blocks))
PY
    if [ -s /tmp/_inline.js ] && ! node --check /tmp/_inline.js 2>/tmp/_err; then
        echo "✗ $f inline JS syntax error:"
        sed 's/^/    /' /tmp/_err | head -4
        fail=1
    fi

    # Tag balance: one missing close tag shifts everything after it.
    python3 - "$f" <<'PY' || fail=1
import sys, html.parser
VOID = {'meta','link','br','img','input','hr','source','area','base','col','embed','track','wbr'}
class P(html.parser.HTMLParser):
    def __init__(s): super().__init__(); s.stack=[]; s.bad=[]
    def handle_starttag(s, t, a):
        # Self-closing (<img ... />) must not be pushed, or it reads as unclosed.
        if t not in VOID: s.stack.append(t)
    def handle_startendtag(s, t, a):
        pass
    def handle_endtag(s, t):
        if s.stack and s.stack[-1] == t: s.stack.pop()
        elif t in s.stack:
            while s.stack and s.stack.pop() != t: pass
        else: s.bad.append(t)
p = P(); p.feed(open(sys.argv[1], encoding='utf-8').read())
if p.stack or p.bad:
    print(f'✗ {sys.argv[1]} unclosed: {p.stack[:3]} stray closing: {p.bad[:3]}')
    sys.exit(1)
PY
done

# version.json is what the app reads; a malformed one kills update checks silently.
if [ -f version.json ]; then
    python3 -c "
import json, sys
d = json.load(open('version.json'))
missing = [k for k in ('version', 'url') if not d.get(k)]
if missing:
    print(f'✗ version.json missing fields: {missing}')
    sys.exit(1)
" || fail=1
fi

rm -f /tmp/_inline.js /tmp/_err

if [ "$fail" = "0" ]; then
    echo "✓ all checks passed"
else
    exit 1
fi
