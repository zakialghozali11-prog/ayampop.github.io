/* =========================================================
   AYAM POP — SCRIPT
   1) Mobile nav toggle
   2) Scroll-spy active nav link
   3) Global bilingual toggle (EN / ID) — single source of truth
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    primaryNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll-spy: highlight the current section in the nav ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.dataset.nav === id);
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { observer.observe(section); });
  } else {
    setActiveLink('home');
  }

  /* ---------- Global bilingual toggle (EN / ID) ---------- */
  var STORAGE_KEY = 'ayampop-lang';
  var DEFAULT_LANG = 'en';
  var VALID_LANGS = ['en', 'id'];

  var langButtons = document.querySelectorAll('.lang-btn');
  var langBlocks  = document.querySelectorAll('[data-lang-content]');

  function readStoredLang() {
    try {
      var stored = window.localStorage.getItem(STORAGE_KEY);
      return VALID_LANGS.indexOf(stored) !== -1 ? stored : null;
    } catch (err) {
      return null;
    }
  }

  function persistLang(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) { /* storage disabled — silently ignore */ }
  }

  function applyLanguage(lang) {
    if (VALID_LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;

    // 1. Update the <html lang> attribute so screen readers and CSS :lang() pick it up.
    document.documentElement.setAttribute('lang', lang);

    // 2. Show only the blocks whose data-lang-content matches the chosen language.
    langBlocks.forEach(function (block) {
      block.hidden = block.dataset.langContent !== lang;
    });

    // 3. Reflect the active state on every toggle button (there is only one, but
    //    keeping the loop future-proofs a second control if one is ever added).
    langButtons.forEach(function (btn) {
      var active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // 4. Remember the choice for the next visit.
    persistLang(lang);
  }

  // Wire up every language button on the page (single source of truth).
  langButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyLanguage(button.dataset.lang);
    });
  });

  // Restore the visitor's last language, or fall back to English.
  var initialLang = readStoredLang() || DEFAULT_LANG;
  applyLanguage(initialLang);

});