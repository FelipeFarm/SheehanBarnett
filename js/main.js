(function () {
  // Header shadow once the page scrolls
  var header = document.getElementById('header');
  function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Height of the top bar plus header, so the hero can slide up underneath them
  var topbar = document.querySelector(".topbar");
  function setTopH() {
    var h = header.offsetHeight + (topbar ? topbar.offsetHeight : 0);
    document.documentElement.style.setProperty("--top-h", h + "px");
  }
  window.addEventListener("resize", setTopH);
  setTopH();

  // Practice areas dropdown
  var drop = document.querySelector('.nav-drop');
  var dropBtn = drop.querySelector('.nav-drop-btn');
  function setDrop(open) {
    drop.classList.toggle('is-open', open);
    dropBtn.setAttribute('aria-expanded', String(open));
  }
  dropBtn.addEventListener('click', function () { setDrop(!drop.classList.contains('is-open')); });
  drop.addEventListener('mouseenter', function () { setDrop(true); });
  drop.addEventListener('mouseleave', function () { setDrop(false); });
  document.addEventListener('click', function (e) { if (!drop.contains(e.target)) setDrop(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setDrop(false); setMenu(false); } });

  // Mobile menu
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (open) menu.style.top = Math.round(header.getBoundingClientRect().bottom) + 'px';
    header.classList.toggle("is-open", open);
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Contact form: mockup only, validates and shows a message, sends nothing
  var form = document.getElementById('consult-form');
  var note = document.getElementById('form-note');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = null;
    form.querySelectorAll('[required]').forEach(function (f) {
      var ok = f.type === 'checkbox' ? f.checked : f.checkValidity() && f.value.trim() !== '';
      f.classList.toggle('is-bad', !ok);
      if (!ok && !bad) bad = f;
    });
    if (bad) {
      note.className = 'form-note is-bad';
      note.textContent = bad.type === 'checkbox'
        ? 'Please confirm you have read the disclaimer.'
        : 'Please fill in your name, a valid email and a short description.';
      bad.focus();
      return;
    }
    note.className = 'form-note is-ok';
    note.textContent = 'Mockup only: nothing was sent. The live form will connect here.';
  });
})();
