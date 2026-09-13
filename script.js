/* =========================================================
   AYAM POP — SCRIPT
   1) Mobile nav toggle
   2) Scroll-spy active nav link
   3) Bilingual recipe toggle (EN / ID)
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

    // Close the mobile menu after a nav link is chosen
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

  /* ---------- Bilingual recipe toggle ---------- */
  var langButtons = document.querySelectorAll('.lang-btn');
  var langBlocks = document.querySelectorAll('[data-lang-content]');

  langButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var chosen = button.dataset.lang;

      langButtons.forEach(function (btn) {
        var active = btn.dataset.lang === chosen;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      langBlocks.forEach(function (block) {
        block.hidden = block.dataset.langContent !== chosen;
      });
    });
  });

});