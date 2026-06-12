# GoGBA 文档站：黑白模式 + 多语言（i18n）设计

日期：2026-06-12
状态：已确认，待实现

## 背景

GoGBA 文档站是纯静态站点（HTML + CSS + 原生 JS，无构建工具），当前为单一深色主题（紫色 accent `#6366f1`），仅英文。本次新增两项能力：

1. 黑白（深/浅）双主题，accent 沿用应用图标的紫色。
2. 多语言：英文 / 简体中文 / 繁体中文，按系统语言自动展示并支持手动切换。

涉及 6 个页面：`index.html`、`about.html`、`support.html`、`privacy-policy.html`、`terms-of-service.html`、`license.html`。

## 设计原则

- 纯静态、无构建工具：能力通过轻量 JS + HTML 属性标记 + CSS 变量实现。
- 单套 HTML 维护，不复制页面（避免多语言/多主题导致页面成倍增长、改动不同步）。
- 首屏无闪烁（无 FOUC）：主题和语言在 CSS/内容渲染前即确定。
- 保持现有精简调性：翻译不堆砌"什么是 GBA/GBC/GB 模拟器"这类常识介绍。

## 文件改动清单

| 文件 | 改动 |
|------|------|
| `styles.css` | 颜色变量重构为语义化双主题（浅色默认 `:root` + `[data-theme="dark"]`），accent 系列两种模式共用图标紫的派生值 |
| `js/theme.js`（新增） | 主题切换逻辑 |
| `js/i18n.js`（新增） | 语言字典 + 渲染逻辑 |
| `js/common.js` | 在 `init()` 中接入主题与 i18n 初始化 |
| 6 个 `*.html` | ① `<head>` 内联防闪烁脚本；② 导航栏加主题切换按钮 + 语言下拉；③ 文本元素标注 `data-i18n` |

## 1. 黑白模式（主题）

### 策略
跟随系统 + 手动切换；深色与浅色两种模式**都保留紫色 accent**。

### CSS 变量分组
- `:root`：浅色模式（新的默认）。
- `[data-theme="dark"]`：深色模式（迁移现有深色配色）。
- accent 系列两种模式共用图标紫（基准 `#8B6FE0` 一带）；浅色模式用稍深派生值、深色模式用稍亮派生值，保证文字/按钮对比度（目标 WCAG AA）。
- 现有 `--primary-color` 等命名迁移到语义化命名（如 `--accent`、`--bg`、`--bg-secondary`、`--text-primary`、`--text-secondary`、`--border`、`--card-bg`、`--hover-bg`），并在两个主题块下各自赋值。
- body 背景的渐变光晕（`body::before`）改用 accent 变量，使其在双主题下都协调。

### 判定优先级
`localStorage('theme')` > 系统 `prefers-color-scheme` > 默认浅色。

### 切换控件
导航栏放一个图标按钮（☀/🌙），点击在 `light`/`dark` 间切换：更新 `<html data-theme>`、写入 `localStorage('theme')`、更新按钮图标与 `aria-label`。

### 防闪烁
`<head>` 中、`styles.css` 之前放一段内联同步脚本：读取 `localStorage('theme')`（无则读系统偏好），立即给 `<html>` 设置 `data-theme`。保证首帧即正确主题。

### 系统主题变化
监听 `matchMedia('(prefers-color-scheme: dark)')` 的 `change`。仅当用户**未手动选择**（localStorage 无 `theme`）时实时跟随系统。

## 2. 多语言（i18n）

### 策略
JS 字典 + `data-i18n` 属性；自动检测 + 手动切换；覆盖全部 6 页；保持精简调性。

### 字典结构（`js/i18n.js`）
```js
const I18N = {
  'en':      { 'nav.home': 'Home', 'home.features.title': 'Key Features', ... },
  'zh-Hans': { 'nav.home': '首页',  'home.features.title': '核心功能',      ... },
  'zh-Hant': { 'nav.home': '首頁',  'home.features.title': '核心功能',      ... },
};
```
- key 采用命名空间前缀：`nav.*`、`footer.*` 为全站共用；页面专属用 `home.*`、`about.*`、`support.*`、`privacy.*`、`terms.*`、`license.*`。
- 三种语言的 key 集合保持一致。

### HTML 标注
- 纯文本：`<h2 data-i18n="home.features.title">Key Features</h2>`，标签内英文原文作为兜底。
- 属性文本：`data-i18n-attr="placeholder:key1;aria-label:key2"`（按属性名映射 key）。
- 含内部链接的富文本：`data-i18n-html="key"`。注入内容均为站内静态字符串白名单，不含用户输入，无 XSS 风险。

### 语言判定优先级
`localStorage('lang')` > `navigator.language` 映射 > 默认 `en`。

映射规则：
- `zh-CN`、`zh-SG`、`zh-Hans*` → `zh-Hans`
- `zh-TW`、`zh-HK`、`zh-MO`、`zh-Hant*` → `zh-Hant`
- 其余 → `en`

### 切换控件
导航栏放一个**语言下拉菜单**（EN / 简体中文 / 繁體中文）。选择后：重渲染全部 `data-i18n*` 节点、更新 `<html lang>`、写入 `localStorage('lang')`。

### 渲染时机与防闪烁
- `<head>` 内联脚本提前设 `<html lang>`（依据上面的判定优先级）。
- HTML 标签内已含英文兜底文本，首屏可见；`i18n.js` 在 DOM ready 后一次性把所有标注节点替换为目标语言。
- 默认/英文用户首屏与最终一致，无可感闪烁；中文用户首帧英文兜底 → 渲染后切中文（一次性，无逐字跳动）。

### 翻译内容取舍
- 保持精简：不增写常识性的模拟器介绍。
- 法律页（privacy/terms/license）照实翻译全文，**不**额外添加"以英文版为准"声明（按用户决定）。

## 3. 导航栏控件布局

导航栏在原有菜单项之后追加：主题切换按钮 + 语言下拉。移动端折叠菜单内同样可访问（沿用现有 `.nav-menu` / `.mobile-menu-toggle` 机制）。

## 4. 部署清理（顺手项）

站点托管在 GitHub Pages（自定义域名 gogba.xyz），保持**纯静态**。当前 `_config.yml`（Jekyll 配置）与 `.nojekyll`（禁用 Jekyll）并存且矛盾——`.nojekyll` 实际生效，`_config.yml` 不起作用。处理：删除 `_config.yml`，明确走纯静态托管。不引入构建流水线、不换框架（确认当前技术栈足以支撑主题切换与 i18n 两项纯客户端能力，换现代框架属过度工程，YAGNI）。

## 测试与验证

- 主题：localStorage 为空时跟随系统；手动切换后刷新保持；切换后系统改主题不再覆盖手动选择；首屏无闪烁（深色系统下打开浅色已存选择，不应闪深色）。
- i18n：三种语言切换文本完整替换、无遗漏 key；`navigator.language` 各取值映射正确；刷新保持；`<html lang>` 同步更新。
- 跨页：6 个页面的导航控件、主题、语言均一致生效。
- 对比度：浅色/深色下 accent 文字与按钮满足可读性。

## 非目标（YAGNI）

- 不做多套 HTML / 子目录路由（如 `/zh/`）。
- 不做 SSR 或构建期预渲染。
- 不引入第三方 i18n / 主题库。
- 不做超出英/简/繁的语言。
