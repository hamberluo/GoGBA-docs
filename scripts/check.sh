#!/bin/bash
# 检查站点的 HTML 与内联 JS。
#
# 存在的理由：premium.html 的内联脚本一度因为编辑留下的残块而整体语法错误，
# 页面看起来正常、按钮却全无反应——而这只有在浏览器里点一下才会发现。

set -e

cd "$(dirname "${BASH_SOURCE[0]}")/.."

fail=0

# 独立 JS 文件：i18n.js 坏掉的表现是整站不翻译。
for f in js/*.js; do
    [ -f "$f" ] || continue
    if ! node --check "$f" 2>/tmp/_err; then
        echo "✗ $f 语法错误:"
        sed 's/^/    /' /tmp/_err | head -4
        fail=1
    fi
done

node scripts/check_i18n_keys.js || fail=1
node scripts/check_payment_branch.js || fail=1

for f in *.html; do
    # 内联 <script> 交给 node 做真正的语法解析，不靠数括号。
    python3 - "$f" <<'PY' > /tmp/_inline.js
import sys, re
html = open(sys.argv[1], encoding='utf-8').read()
# 只取真正的 JS：带 src 的是外链，type 为 ld+json 等的是数据而非脚本。
blocks = [
    body for attrs, body in re.findall(r'<script([^>]*)>(.*?)</script>', html, re.S)
    if 'src=' not in attrs
    and not re.search(r'type\s*=\s*["\'][^"\']*json', attrs, re.I)
]
print('\n;\n'.join(blocks))
PY
    if [ -s /tmp/_inline.js ] && ! node --check /tmp/_inline.js 2>/tmp/_err; then
        echo "✗ $f 内联 JS 语法错误:"
        sed 's/^/    /' /tmp/_err | head -4
        fail=1
    fi

    # 标签配平：漏掉的闭合标签会让后面的内容整块错位。
    python3 - "$f" <<'PY' || fail=1
import sys, html.parser
VOID = {'meta','link','br','img','input','hr','source','area','base','col','embed','track','wbr'}
class P(html.parser.HTMLParser):
    def __init__(s): super().__init__(); s.stack=[]; s.bad=[]
    def handle_starttag(s, t, a):
        # 自闭合写法（<img ... />）不进栈，否则会被当成未闭合。
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
    print(f'✗ {sys.argv[1]} 标签未闭合: {p.stack[:3]} 多余闭合: {p.bad[:3]}')
    sys.exit(1)
PY
done

# version.json 是 App 读的，格式错了会让更新检查静默失效。
if [ -f version.json ]; then
    python3 -c "
import json, sys
d = json.load(open('version.json'))
missing = [k for k in ('version', 'url') if not d.get(k)]
if missing:
    print(f'✗ version.json 缺少字段: {missing}')
    sys.exit(1)
" || fail=1
fi

rm -f /tmp/_inline.js /tmp/_err

if [ "$fail" = "0" ]; then
    echo "✓ 全部通过"
else
    exit 1
fi
