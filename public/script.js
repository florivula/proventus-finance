const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const scrollProgress = document.querySelector('[data-scroll-progress]');
let scrollFrame = 0;
const updateScrollState = () => {
  scrollFrame = 0;
  header?.classList.toggle('scrolled', window.scrollY > 28);
  if (!scrollProgress) return;
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
};
const requestScrollUpdate = () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollState);
};
updateScrollState();
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });

if (navToggle && nav) {
  const closeNav = (returnFocus = false) => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('nav-open');
    if (returnFocus) navToggle.focus();
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    document.body.classList.toggle('nav-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeNav()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('nav-open')) closeNav(true);
  });
}

const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
  window.setTimeout(() => revealItems.forEach((item) => item.classList.add('visible')), 3200);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const selector = link.getAttribute('href');
    const target = selector ? document.querySelector(selector) : null;
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
});

if ('IntersectionObserver' in window && nav) {
  const navLinks = [...nav.querySelectorAll('a[href^="#"]:not(.nav-cta)')];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
  navSections.forEach((section) => sectionObserver.observe(section));
}

document.querySelectorAll('[data-faq] details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('[data-faq] details[open]').forEach((other) => {
      if (other !== detail) other.removeAttribute('open');
    });
  });
});

const engineTags = [...document.querySelectorAll('[data-service]')];
const engineLink = document.querySelector('[data-engine-link]');
const engineKicker = document.querySelector('[data-core-kicker]');
const engineState = document.querySelector('[data-core-state]');
const selectEngineService = (button) => {
  engineTags.forEach((tag) => {
    const selected = tag === button;
    tag.classList.toggle('active', selected);
    tag.setAttribute('aria-pressed', String(selected));
  });
  if (engineKicker) engineKicker.textContent = button.dataset.kicker;
  if (engineState) engineState.textContent = button.dataset.state;
  if (engineLink) {
    engineLink.setAttribute('href', button.dataset.target);
    engineLink.setAttribute('aria-label', `View ${button.dataset.kicker} service`);
  }
};
engineTags.forEach((button) => button.addEventListener('click', () => selectEngineService(button)));
engineLink?.addEventListener('click', () => {
  const target = document.querySelector(engineLink.getAttribute('href'));
  if (!target) return;
  target.classList.add('spotlight');
  window.setTimeout(() => target.classList.remove('spotlight'), 1800);
});

const officeStories = {
  collect: {
    label: 'Collection',
    title: 'One clear intake.',
    copy: 'Inputs, owners and timing are agreed before the recurring work begins.'
  },
  review: {
    label: 'Review',
    title: 'One financial picture.',
    copy: 'Records are checked in context, so loose ends surface while there is still time to resolve them.'
  },
  explain: {
    label: 'Explanation',
    title: 'A view ready to use.',
    copy: 'The report arrives with plain-language context and a visible trail back to the records.'
  }
};
const officeTabs = [...document.querySelectorAll('[data-office-tab]')];
const officeHotspots = [...document.querySelectorAll('[data-office-select]')];
const officeLabel = document.querySelector('[data-office-label]');
const officeTitle = document.querySelector('[data-office-title]');
const officeCopy = document.querySelector('[data-office-copy]');
const selectOfficeStory = (key) => {
  const story = officeStories[key];
  if (!story) return;
  officeTabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.officeTab === key)));
  officeHotspots.forEach((hotspot) => hotspot.classList.toggle('active', hotspot.dataset.officeSelect === key));
  if (officeLabel) officeLabel.textContent = story.label;
  if (officeTitle) officeTitle.textContent = story.title;
  if (officeCopy) officeCopy.textContent = story.copy;
};
officeTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectOfficeStory(tab.dataset.officeTab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = (index + (event.key === 'ArrowRight' ? 1 : -1) + officeTabs.length) % officeTabs.length;
    officeTabs[nextIndex].focus();
    selectOfficeStory(officeTabs[nextIndex].dataset.officeTab);
  });
});
officeHotspots.forEach((hotspot) => hotspot.addEventListener('click', () => selectOfficeStory(hotspot.dataset.officeSelect)));

const phaseData = {
  collect: { period: 'PERIOD / INPUT', status: 'STATUS / COLLECTING', done: 2, focus: 2 },
  review: { period: 'PERIOD / REVIEW', status: 'STATUS / CHECKING', done: 9, focus: 9 },
  close: { period: 'PERIOD / CLOSE', status: 'STATUS / ALIGNING', done: 15, focus: 16 },
  explain: { period: 'PERIOD / REPORT', status: 'STATUS / READY', done: 24, focus: 24 }
};
const phaseButtons = [...document.querySelectorAll('[data-phase]')];
const periodLabel = document.querySelector('[data-period-label]');
const statusLabel = document.querySelector('[data-status-label]');
const calendarCells = [...document.querySelectorAll('.calendar-grid i')];
const selectPhase = (button) => {
  const data = phaseData[button.dataset.phase];
  if (!data) return;
  phaseButtons.forEach((item) => {
    const selected = item === button;
    item.setAttribute('aria-pressed', String(selected));
    item.closest('li')?.classList.toggle('active', selected);
  });
  if (periodLabel) periodLabel.textContent = data.period;
  if (statusLabel) statusLabel.textContent = data.status;
  calendarCells.forEach((cell, index) => {
    cell.classList.remove('done', 'active', 'focus');
    if (index < data.done) cell.classList.add('done');
    if (index === data.focus) cell.classList.add('focus');
    if (index === Math.min(data.focus + 1, calendarCells.length - 1)) cell.classList.add('active');
  });
};
phaseButtons.forEach((button) => button.addEventListener('click', () => selectPhase(button)));
if (phaseButtons[0]) selectPhase(phaseButtons[0]);

const reportBars = [...document.querySelectorAll('[data-report-bar]')];
const reportState = document.querySelector('[data-report-state]');
const reportNote = document.querySelector('[data-report-note]');
reportBars.forEach((bar) => {
  bar.addEventListener('click', () => {
    reportBars.forEach((item) => {
      const selected = item === bar;
      item.classList.toggle('current', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    if (reportState) reportState.textContent = bar.dataset.state;
    if (reportNote) reportNote.textContent = bar.dataset.note;
  });
});

if (!reducedMotion) {
  const engine = document.querySelector('[data-engine]');
  if (engine && window.matchMedia('(pointer: fine)').matches) {
    engine.addEventListener('pointermove', (event) => {
      const rect = engine.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      engine.style.setProperty('--tilt-x', `${-y * 2.2}deg`);
      engine.style.setProperty('--tilt-y', `${x * 2.8}deg`);
    });
    engine.addEventListener('pointerleave', () => {
      engine.style.setProperty('--tilt-x', '0deg');
      engine.style.setProperty('--tilt-y', '0deg');
    });
  }

  const officeImage = document.querySelector('.office-image');
  const officePhoto = officeImage?.querySelector(':scope > img:first-child');
  if (officeImage && officePhoto && window.matchMedia('(pointer: fine)').matches) {
    officeImage.addEventListener('pointermove', (event) => {
      const rect = officeImage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * -10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
      officePhoto.style.transform = `scale(1.025) translate(${x}px, ${y}px)`;
    });
    officeImage.addEventListener('pointerleave', () => {
      officePhoto.style.transform = 'scale(1) translate(0, 0)';
    });
  }
}
