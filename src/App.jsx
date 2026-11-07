import { useEffect } from 'react';

const shell = String.raw`
  <header class="topbar">
    <a class="logo" href="#" onclick="S.cat='all';S.q='';syncSearch();go('shop');return false" aria-label="HomeServe home">
      <span class="logo-mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="m9.5 15 2 2 3.5-4"/></svg></span>HomeServe
    </a>
    <label class="loc"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <select id="loc" aria-label="Your area" onchange="setArea(this.value)"></select></label>
    <label class="hsearch-top"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <input id="hq" placeholder="Search for AC service, plumber, cleaning…" oninput="search(this)" aria-label="Search services"></label>
    <nav id="nav" aria-label="Main"></nav>
    <button id="themebtn" class="icon-btn themebtn" aria-label="Switch dark or light mode" onclick="toggleTheme()"></button>
    <div id="auth" class="authbar"></div>
  </header>

  <main id="app"></main>

  <footer class="site-footer">
    <div class="fgrid">
      <div><b class="f-brand">HomeServe</b><p>Your one-stop solution for home services in Vijayawada. Quality, trust and speed in one click.</p></div>
      <div><b>Services</b>
        <a href="#" onclick="openCat('cl');return false">Cleaning</a><a href="#" onclick="openCat('pl');return false">Plumbing</a>
        <a href="#" onclick="openCat('el');return false">Electrical</a><a href="#" onclick="openCat('ac');return false">AC Services</a></div>
      <div><b>Support</b>
        <a href="#" onclick="go('page:contact');return false">Contact us</a><a href="#" onclick="go('page:help');return false">Help centre</a>
        <a href="#" onclick="go('page:cancel');return false">Cancellation policy</a><a href="#" onclick="go('page:refund');return false">Refund policy</a></div>
      <div><b>Company</b>
        <a href="#" onclick="go('page:about');return false">About</a><a href="#" onclick="go('preg');return false">Become a provider</a>
        <a href="#" onclick="go('page:terms');return false">Terms</a><a href="#" onclick="go('page:privacy');return false">Privacy policy</a></div>
    </div>
    <small>© 2026 HomeServe Home Services. All rights reserved.</small>
  </footer>

  <nav class="bnav" aria-label="Quick navigation">
    <button onclick="openCat('all')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/></svg><small>Home</small></button>
    <button onclick="go('bookings')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><small>Bookings</small></button>
    <button onclick="go('cart')"><span class="bn-ic"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 7H6"/></svg><b id="cartbadge" hidden>0</b></span><small>Cart</small></button>
    <button onclick="go(S.user?'bookings':'login')"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg><small>Profile</small></button>
  </nav>

  <div id="toast" role="status" aria-live="polite"></div>
`;

const legacyScripts = [
  '/legacy/js/data.js',
  '/legacy/js/ui.js',
  '/legacy/js/state.js',
  '/legacy/js/art.js',
  '/legacy/js/customer.js',
  '/legacy/js/provider.js',
  '/legacy/js/admin.js',
  '/legacy/js/auth.js',
  'inline-init',
  '/legacy/js/extras.js',
  '/legacy/js/app.js',
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (src === 'inline-init') {
      const script = document.createElement('script');
      script.textContent = `
        document.getElementById('loc').innerHTML = AREAS.map(a => '<option ' + (a === S.area ? 'selected' : '') + '>' + a + '</option>').join('');
        document.getElementById('hq').value = S.q;
      `;
      document.body.appendChild(script);
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load ' + src));
    document.body.appendChild(script);
  });
}

export default function App() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        for (const src of legacyScripts) {
          if (cancelled) return;
          await loadScript(src);
        }
      } catch (error) {
        console.error('HomeServe startup failed:', error);
        const app = document.getElementById('app');
        if (app) app.innerHTML = '<div class="empty"><h2>Unable to start HomeServe</h2><p>Refresh the page. If the problem continues, check the browser console.</p></div>';
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: shell }} />;
}
