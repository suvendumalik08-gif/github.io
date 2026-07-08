document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll progress bar + nav background ---------- */
  const progressBar = document.getElementById('progressBar');
  const nav = document.getElementById('siteNav');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (nav) nav.classList.toggle('is-scrolled', scrollTop > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

  if (sections.length && navAnchors.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => navObserver.observe(section));
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------- Rank ticker animation (hero signature element) ---------- */
  const rankNum = document.getElementById('rankNum');
  const rankFill = document.getElementById('rankFill');
  const rankTicker = document.getElementById('rankTicker');

  if (rankNum && rankFill && rankTicker) {
    let hasRun = false;
    const rankObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          animateRank();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    rankObserver.observe(rankTicker);
  }

  function animateRank() {
    const start = 47;
    const end = 1;
    const duration = 1600;
    const startTime = performance.now();

    rankFill.style.width = '92%';

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(start - (start - end) * eased);
      rankNum.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        rankNum.textContent = end;
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Animated stat counters (About section) ---------- */
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (statNums.length) {
    const statObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    statNums.forEach(el => statObserver.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 900;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const current = Math.round(target * progress);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Skill bars fill on scroll ---------- */
  const skillBars = document.querySelectorAll('.skill-bar[data-level]');
  if (skillBars.length) {
    const skillObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const level = bar.getAttribute('data-level') || '0';
          const fill = bar.querySelector('.skill-fill');
          if (fill) fill.style.width = level + '%';
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });
    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  /* ---------- Expertise tabs ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('is-active'));
      tabPanels.forEach(p => p.classList.remove('is-active'));

      btn.classList.add('is-active');
      const panel = document.querySelector(`.tab-panel[data-panel="${target}"]`);
      if (panel) panel.classList.add('is-active');
    });
  });

  /* ---------- FAQ accordion ---------- */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items (single-open accordion)
      accordionItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Resume button placeholder ---------- */
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Add your resume PDF and link this button to it, e.g. href="resume.pdf" download.');
    });
  }

});
