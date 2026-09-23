(() => {
  const root = document.documentElement;
  const themeLink = document.querySelector('#theme-css');
  const toggle = document.querySelector('[data-theme-toggle]');
  const label = document.querySelector('[data-theme-label]');
  const icon = document.querySelector('[data-theme-icon]');
  if (!themeLink || !toggle) return;
  const modes = ['auto', 'light', 'dark'];
  let mode = 'auto';
  try { const saved = localStorage.getItem('portfolio-theme'); if (modes.includes(saved)) mode = saved; } catch {}
  let boundaryTimer;
  const activeScheme = () => {
    if (mode !== 'auto') return mode;
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6 ? 'dark' : 'light';
  };
  const apply = () => {
    const scheme = activeScheme();
    root.className = scheme;
    themeLink.href = themeLink.href.replace(/tokens\/(?:light|dark)\.css/, `tokens/${scheme}.css`);
    const color = getComputedStyle(root).getPropertyValue('--md-sys-color-surface').trim();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && color) meta.content = color;
    if (label) label.textContent = mode === 'auto' ? 'Auto · 6:00 p. m.' : scheme === 'dark' ? 'Oscuro' : 'Claro';
    if (icon) icon.textContent = scheme === 'dark' ? 'light_mode' : 'dark_mode';
    toggle.setAttribute('aria-label', `Tema ${mode === 'auto' ? 'automático' : mode}; activar ${mode === 'auto' ? 'claro' : mode === 'light' ? 'oscuro' : 'automático'}`);
    toggle.title = `Tema: ${mode === 'auto' ? 'automático (cambia a las 6 p. m.)' : scheme === 'dark' ? 'oscuro' : 'claro'}`;
  };
  const scheduleBoundary = () => {
    clearTimeout(boundaryTimer);
    if (mode !== 'auto') return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(now.getHours() < 6 ? 6 : now.getHours() < 18 ? 18 : 30, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    boundaryTimer = setTimeout(() => { apply(); scheduleBoundary(); }, next.getTime() - now.getTime() + 100);
  };
  toggle.addEventListener('click', () => {
    mode = modes[(modes.indexOf(mode) + 1) % modes.length];
    try { localStorage.setItem('portfolio-theme', mode); } catch {}
    apply(); scheduleBoundary();
  });
  window.addEventListener('focus', () => { apply(); scheduleBoundary(); });
  apply(); scheduleBoundary();
})();
