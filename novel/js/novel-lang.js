/**
 * Novel language switcher: ?lang=zh → Chinese, otherwise English
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const isZh = params.get('lang') === 'zh';

  // Toggle content visibility
  document.querySelectorAll('.lang-en').forEach(el => {
    el.style.display = isZh ? 'none' : '';
  });
  document.querySelectorAll('.lang-zh').forEach(el => {
    el.style.display = isZh ? '' : 'none';
  });

  // Set switcher links to preserve/replace lang on same page
  const basePath = window.location.pathname;
  document.querySelectorAll('.novel-lang-link[data-lang="zh"]').forEach(a => {
    a.href = basePath + '?lang=zh';
  });
  document.querySelectorAll('.novel-lang-link[data-lang="en"]').forEach(a => {
    a.href = basePath;
  });

  // Append lang=zh to episode links when in zh mode (for index page)
  if (isZh) {
    document.querySelectorAll('.episode-link').forEach(a => {
      const href = a.getAttribute('href');
      if (href && !href.includes('lang=')) {
        a.href = href + (href.includes('?') ? '&' : '?') + 'lang=zh';
      }
    });
  }
})();
